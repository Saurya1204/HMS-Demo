"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole, AdminKPIs } from "@/types";
import { initialUsers } from "@/lib/seed-data";

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: "success" | "error" | "warning" | "info" | "stroke-alert";
  timestamp: number;
}

export type AuthTab = "signin" | "signup" | "demo";

// Default public guest user representation
export const defaultGuestUser: User = {
  id: "guest-visitor",
  name: "Public Visitor",
  email: "guest@sbm-mnsri.in",
  role: "patient",
  department: "Community / Public",
  active: true,
};

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  authModalTab: AuthTab;
  setAuthModalTab: (tab: AuthTab) => void;
  openAuthModal: (tab?: AuthTab) => void;
  logout: () => Promise<void>;
  loginUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  loginAsUser: (userId: string) => void;
  getDashboardUrl: (role?: UserRole) => string;
  allUsers: User[];
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id" | "timestamp">) => void;
  removeToast: (id: string) => void;
  kpis: AdminKPIs | null;
  refreshKPIs: () => Promise<void>;
  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  isSeeding: boolean;
  triggerSeed: () => Promise<void>;
  globalRefreshKey: number;
  triggerGlobalRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(defaultGuestUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>("signin");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [globalRefreshKey, setGlobalRefreshKey] = useState(1);

  // Restore authenticated session on mount from localStorage/cookies if previously signed in
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sbm_active_user");
      const storedLoggedIn = localStorage.getItem("sbm_is_logged_in");
      if (stored && storedLoggedIn === "true") {
        const parsed = JSON.parse(stored) as User;
        if (parsed && parsed.role) {
          setCurrentUser(parsed);
          setIsLoggedIn(true);
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const getDashboardUrl = (role?: UserRole): string => {
    const targetRole = role || currentUser.role;
    switch (targetRole) {
      case "admin":
        return "/admin";
      case "doctor":
        return "/doctor";
      case "receptionist":
        return "/reception";
      case "nurse":
        return "/clinic";
      case "researcher":
        return "/research-portal";
      case "patient":
      default:
        return "/patient-portal";
    }
  };

  const loginUser = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    try {
      localStorage.setItem("sbm_active_user", JSON.stringify(user));
      localStorage.setItem("sbm_is_logged_in", "true");
      document.cookie = `sbm_user_role=${user.role}; path=/; max-age=86400`;
      document.cookie = `sbm_user_id=${user.id}; path=/; max-age=86400`;
    } catch {
      // Ignore storage write issues
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors
    }
    setIsLoggedIn(false);
    setCurrentUser(defaultGuestUser);
    try {
      localStorage.removeItem("sbm_active_user");
      localStorage.setItem("sbm_is_logged_in", "false");
      document.cookie = "sbm_user_role=; path=/; max-age=0";
      document.cookie = "sbm_user_id=; path=/; max-age=0";
    } catch {
      // Ignore
    }
    addToast({
      title: "Logged Out Successfully",
      description: "You are now in public visitor mode. Sign in anytime to access role dashboards.",
      type: "info",
    });
  };

  const openAuthModal = (tab: AuthTab = "signin") => {
    setAuthModalTab(tab);
    setIsRoleModalOpen(true);
  };

  const addToast = (toast: Omit<ToastMessage, "id" | "timestamp">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      timestamp: Date.now(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 5.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: UserRole) => {
    const found = initialUsers.find((u) => u.role === role);
    if (found) {
      loginUser(found);
      addToast({
        title: `Signed In as ${found.name}`,
        description: `Active Role: ${found.role.toUpperCase()} • ${found.department || ""}`,
        type: "success",
      });
    }
  };

  const loginAsUser = (userId: string) => {
    const found = initialUsers.find((u) => u.id === userId);
    if (found) {
      loginUser(found);
      addToast({
        title: `Signed In as ${found.name}`,
        description: `Active Role: ${found.role.toUpperCase()} • ${found.department || ""}`,
        type: "success",
      });
    }
  };

  const triggerGlobalRefresh = () => {
    setGlobalRefreshKey((k) => k + 1);
  };

  const refreshKPIs = async () => {
    try {
      const res = await fetch("/api/admin");
      const json = await res.json();
      if (json.success && json.data?.kpis) {
        setKpis(json.data.kpis);
      }
    } catch (e) {
      console.warn("Failed to fetch KPIs:", e);
    }
  };

  const triggerSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        addToast({
          title: "System Re-Seeded Successfully",
          description: "All clinical hospital records, AMMA referrals, and MNSRI studies reset.",
          type: "success",
        });
        triggerGlobalRefresh();
        await refreshKPIs();
      }
    } catch {
      addToast({
        title: "Seed Reset Failed",
        description: "Could not reset the database.",
        type: "error",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    refreshKPIs();
  }, [globalRefreshKey]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        logout,
        loginUser,
        switchRole,
        loginAsUser,
        getDashboardUrl,
        allUsers: initialUsers,
        toasts,
        addToast,
        removeToast,
        kpis,
        refreshKPIs,
        isRoleModalOpen,
        setIsRoleModalOpen,
        isSeeding,
        triggerSeed,
        globalRefreshKey,
        triggerGlobalRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
