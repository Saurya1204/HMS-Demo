"use client";

import React, { useState } from "react";
import { useApp, AuthTab } from "@/context/AppContext";
import { initialUsers } from "@/lib/seed-data";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Stethoscope,
  Users,
  FlaskConical,
  Activity,
  X,
  CheckCircle,
  ArrowRight,
  UserCheck,
  UserPlus,
  LogIn,
  KeyRound,
  Mail,
  User as UserIcon,
  Building,
  Heart,
  Loader2,
  Sparkles,
} from "lucide-react";
import { UserRole, User } from "@/types";

export function RoleModal() {
  const {
    isRoleModalOpen,
    setIsRoleModalOpen,
    currentUser,
    loginUser,
    addToast,
    authModalTab,
    setAuthModalTab,
    getDashboardUrl,
  } = useApp();
  const router = useRouter();

  // Form states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("demo123");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("demo123");
  const [signUpRole, setSignUpRole] = useState<UserRole>("doctor");
  const [signUpDept, setSignUpDept] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isRoleModalOpen) return null;

  const roleConfigs: Record<
    UserRole,
    {
      badge: string;
      color: string;
      icon: any;
      route: string;
      desc: string;
    }
  > = {
    admin: {
      badge: "Hospital Administrator",
      color: "bg-amber-100 text-amber-800 border-amber-300",
      icon: BarChart3,
      route: "/admin",
      desc: "Manage full hospital census, bed allocations, KPIs, seed controls, and master audit logs.",
    },
    doctor: {
      badge: "Attending Neurologist",
      color: "bg-teal-100 text-teal-800 border-teal-300",
      icon: Stethoscope,
      route: "/doctor",
      desc: "Manage consultation queue, review vitals, issue prescriptions, order lab tests, admit to ICU.",
    },
    receptionist: {
      badge: "Central Reception Desk",
      color: "bg-teal-100 text-teal-800 border-teal-300",
      icon: Users,
      route: "/reception",
      desc: "Manage live OPD waiting queue, admit AMMA inbound referrals, and process walk-in admissions.",
    },
    nurse: {
      badge: "AMMA Clinic Health Worker",
      color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: Activity,
      route: "/clinic",
      desc: "Rural village clinic triage, FAST stroke screening, vitals recording, and direct hospital referral.",
    },
    researcher: {
      badge: "MNSRI Research Director",
      color: "bg-indigo-100 text-indigo-800 border-indigo-300",
      icon: FlaskConical,
      route: "/research-portal",
      desc: "Manage clinical trials, research milestones, Lancet publication drafts, and AI evidence synthesis.",
    },
    patient: {
      badge: "Patient & Public User",
      color: "bg-teal-100 text-teal-800 border-teal-300",
      icon: Heart,
      route: "/patient-portal",
      desc: "Explore clinical services, book OPD consultations, verify stroke signs, and access visit summaries.",
    },
  };

  const handleSelectDemoPersona = (user: (typeof initialUsers)[0]) => {
    loginUser(user);
    const dest = getDashboardUrl(user.role);
    addToast({
      title: `Signed In as ${user.name}`,
      description: `Active Role: ${user.role.toUpperCase()} • Directing to dashboard...`,
      type: "success",
    });
    setIsRoleModalOpen(false);
    router.push(dest);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid login credentials.");
      }

      loginUser(data.user);
      const dest = getDashboardUrl(data.user.role);
      addToast({
        title: `Welcome, ${data.user.name}!`,
        description: `Signed in as ${data.user.role.toUpperCase()}. Opening dashboard...`,
        type: "success",
      });
      setIsRoleModalOpen(false);
      router.push(dest);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword,
          role: signUpRole,
          department: signUpDept,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed.");
      }

      loginUser(data.user);
      const dest = getDashboardUrl(data.user.role);
      addToast({
        title: `Account Created: ${data.user.name}`,
        description: `Role registered: ${data.user.role.toUpperCase()}. Redirecting to your dashboard...`,
        type: "success",
      });
      setIsRoleModalOpen(false);
      router.push(dest);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-teal-800">
                SBM Hospitals & MNSRI Access
              </span>
            </div>
            <h2 className="text-xl font-black text-[#0F172A] mt-0.5">
              {authModalTab === "signin" && "Sign In to Your Workspace"}
              {authModalTab === "signup" && "Create New Hospital Account"}
              {authModalTab === "demo" && "Instant 1-Click Demo Personas"}
            </h2>
          </div>
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-100/60 px-6 pt-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setErrorMessage("");
              setAuthModalTab("signin");
            }}
            className={`pb-2.5 px-4 rounded-t-xl transition-all flex items-center space-x-2 cursor-pointer ${
              authModalTab === "signin"
                ? "bg-white text-teal-700 border-t-2 border-teal-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setErrorMessage("");
              setAuthModalTab("signup");
            }}
            className={`pb-2.5 px-4 rounded-t-xl transition-all flex items-center space-x-2 cursor-pointer ${
              authModalTab === "signup"
                ? "bg-white text-teal-700 border-t-2 border-teal-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setErrorMessage("");
              setAuthModalTab("demo");
            }}
            className={`pb-2.5 px-4 rounded-t-xl transition-all flex items-center space-x-2 cursor-pointer ${
              authModalTab === "demo"
                ? "bg-white text-teal-700 border-t-2 border-teal-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>1-Click Demo Personas</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {authModalTab === "signin" && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. priya.sharma@sbm-hospitals.in"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <span className="text-[11px] text-teal-700 font-semibold">
                    Demo default: demo123
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-slate-900 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In & Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>Want to test without typing? </span>
                <button
                  type="button"
                  onClick={() => setAuthModalTab("demo")}
                  className="text-teal-700 font-bold hover:underline cursor-pointer"
                >
                  Use 1-Click Demo Personas
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {authModalTab === "signup" && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="e.g. Dr. Gaurav Singh"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="gaurav@sbm-hospitals.in"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Department / Village (Optional)
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={signUpDept}
                      onChange={(e) => setSignUpDept(e.target.value)}
                      placeholder="e.g. Neurology or Shivgarh"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#0F172A]">
                  Select Your Hospital Role:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(
                    [
                      {
                        role: "doctor" as const,
                        label: "Doctor / Clinician",
                        desc: "EMR, diagnosis, e-prescriptions & ICU admission",
                        icon: Stethoscope,
                        color: "border-teal-500 bg-teal-50/70 text-teal-800",
                      },
                      {
                        role: "admin" as const,
                        label: "Hospital Administrator",
                        desc: "Bed census, analytics, audit logs & RBAC",
                        icon: BarChart3,
                        color: "border-amber-500 bg-amber-50/70 text-amber-800",
                      },
                      {
                        role: "receptionist" as const,
                        label: "Reception & Triage",
                        desc: "Inbound referrals, walk-in check-in & tokens",
                        icon: Users,
                        color: "border-teal-500 bg-teal-50/70 text-teal-800",
                      },
                      {
                        role: "nurse" as const,
                        label: "AMMA Health Worker",
                        desc: "Rural triage, FAST stroke screening & referral QR",
                        icon: Activity,
                        color: "border-emerald-500 bg-emerald-50/70 text-emerald-800",
                      },
                      {
                        role: "researcher" as const,
                        label: "Neuroscience Researcher",
                        desc: "Clinical trials, neuroplasticity & Lancet drafts",
                        icon: FlaskConical,
                        color: "border-indigo-500 bg-indigo-50/70 text-indigo-800",
                      },
                      {
                        role: "patient" as const,
                        label: "Patient / Family User",
                        desc: "OPD token status, visit history & follow-ups",
                        icon: Heart,
                        color: "border-teal-500 bg-teal-50/70 text-teal-800",
                      },
                    ]
                  ).map((r) => {
                    const isSelected = signUpRole === r.role;
                    const Icon = r.icon;
                    return (
                      <div
                        key={r.role}
                        onClick={() => setSignUpRole(r.role)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start space-x-2.5 ${
                          isSelected
                            ? `${r.color} ring-2 ring-teal-500/30 font-semibold`
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? "bg-white" : "bg-slate-100"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold leading-tight">
                            {r.label}
                          </div>
                          <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            {r.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setAuthModalTab("signin")}
                  className="text-teal-700 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: 1-CLICK DEMO PERSONAS */}
          {authModalTab === "demo" && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-500 mb-2">
                Click any persona below to immediately log in and jump straight to their dedicated dashboard:
              </p>

              {initialUsers.map((u) => {
                const config = roleConfigs[u.role];
                const Icon = config.icon;
                const isSelected = currentUser.id === u.id;

                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectDemoPersona(u)}
                    className={`group cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/20"
                        : "bg-white border-slate-200 hover:border-teal-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {u.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.color}`}
                          >
                            {config.badge}
                          </span>
                          {isSelected && (
                            <span className="flex items-center text-[10px] text-teal-600 font-bold">
                              <CheckCircle className="w-3 h-3 mr-0.5" /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {config.desc}
                        </p>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {u.email} • {u.department}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <span className="text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform flex items-center">
                        Launch <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Enterprise Role-Based Access Control (RBAC) simulated.</span>
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="px-3 py-1.5 rounded-lg bg-slate-200/80 text-slate-700 hover:bg-slate-300 font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
