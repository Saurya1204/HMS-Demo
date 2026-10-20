"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Activity,
  PhoneCall,
  RotateCcw,
  Stethoscope,
  ChevronDown,
  Users,
  Menu,
  X,
  FlaskConical,
  BarChart3,
  Heart,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { UserRole } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    isLoggedIn,
    openAuthModal,
    logout,
    triggerSeed,
    isSeeding,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact public links as specified in Product Structure A & Section 5
  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About Us" },
    { href: "/amma-clinic", label: "AMMA Digital Clinic" },
    { href: "/research", label: "Research" },
    { href: "/appointments", label: "Appointments" },
    { href: "/contact", label: "Contact" },
  ];

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case "admin":
        return {
          label: "Admin Dashboard",
          href: "/admin",
          icon: BarChart3,
          badge: "Admin",
          badgeStyle: "bg-amber-100 text-amber-800 border-amber-300",
        };
      case "doctor":
        return {
          label: "Doctor EMR",
          href: "/doctor",
          icon: Stethoscope,
          badge: "Doctor",
          badgeStyle: "bg-teal-100 text-teal-800 border-teal-300",
        };
      case "receptionist":
        return {
          label: "Reception Desk",
          href: "/reception",
          icon: Users,
          badge: "Receptionist",
          badgeStyle: "bg-teal-100 text-teal-800 border-teal-300",
        };
      case "nurse":
        return {
          label: "AMMA Clinic",
          href: "/clinic",
          icon: Activity,
          badge: "AMMA Nurse",
          badgeStyle: "bg-emerald-100 text-emerald-800 border-emerald-300",
        };
      case "researcher":
        return {
          label: "Research Portal",
          href: "/research-portal",
          icon: FlaskConical,
          badge: "Researcher",
          badgeStyle: "bg-indigo-100 text-indigo-800 border-indigo-300",
        };
      case "patient":
      default:
        return {
          label: "Patient Portal",
          href: "/patient-portal",
          icon: Heart,
          badge: "User / Patient",
          badgeStyle: "bg-teal-100 text-teal-800 border-teal-300",
        };
    }
  };

  const roleInfo = getRoleInfo(currentUser.role);
  const RoleIcon = roleInfo.icon;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner: Emergency simulation notice */}
      <div className="bg-[#0F172A] text-white px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-100">
            SBM Hospitals & MNSRI
          </span>
          <span className="text-slate-400 hidden md:inline">
            • Maharajganj – Raebareli, Uttar Pradesh
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 bg-red-600/90 text-white px-2.5 py-0.5 rounded-full font-bold text-[11px]">
            <PhoneCall className="w-3 h-3" />
            <span>Emergency Code Stroke: 108 (Demo Simulation)</span>
          </div>

          <button
            onClick={() => triggerSeed()}
            disabled={isSeeding}
            className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
            title="Reset system to default seeded state"
          >
            <RotateCcw
              className={`w-3.5 h-3.5 ${
                isSeeding ? "animate-spin text-teal-400" : ""
              }`}
            />
            <span className="hidden md:inline">Reset Seed Data</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:bg-teal-700 transition-colors">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-extrabold text-[#0F172A] group-hover:text-teal-700 transition-colors tracking-tight">
                SBM HOSPITALS
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                + MNSRI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
              Maharajganj Neuroscience & Stroke Research Institute
            </p>
          </div>
        </Link>

        {/* Center: Public Links (Visible across public website) */}
        <nav className="hidden xl:flex items-center space-x-1">
          {publicLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-teal-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Auth State Driven */}
        <div className="hidden sm:flex items-center space-x-2">
          {!isLoggedIn ? (
            /* UNTOUCHED / LOGGED OUT: Show Sign In & Sign Up */
            <>
              <button
                type="button"
                onClick={() => openAuthModal("signin")}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-teal-700 font-bold text-xs transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all shadow-xs shadow-teal-600/20 cursor-pointer flex items-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </>
          ) : (
            /* AUTHENTICATED: Display Go to Dashboard, User Capsule, and Logout */
            <>
              {/* 1. Go to Dashboard Button */}
              <Link
                href={roleInfo.href}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-xs shadow-teal-600/20 transition-all cursor-pointer group"
              >
                <RoleIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Go to Dashboard</span>
              </Link>

              {/* 2. User Info Capsule / Role Switcher */}
              <button
                type="button"
                onClick={() => openAuthModal("demo")}
                className="flex items-center space-x-2 px-3 py-1 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 transition-all text-left shadow-xs cursor-pointer group"
                title="Click to Switch Role or View Credentials"
              >
                <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-900 leading-tight">
                    {currentUser.name.split(" ")[0]}
                  </div>
                  <div className="text-[9px] text-teal-700 uppercase font-extrabold">
                    {roleInfo.badge}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </button>

              {/* 3. Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-red-300 text-slate-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Sign out of current account"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Controls */}
        <div className="flex xl:hidden items-center space-x-2">
          {!isLoggedIn ? (
            <button
              type="button"
              onClick={() => openAuthModal("signin")}
              className="px-2.5 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs"
            >
              Sign In
            </button>
          ) : (
            <Link
              href={roleInfo.href}
              className="px-2.5 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center space-x-1"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
            Hospital Navigation
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-xs font-bold ${
                  pathname === link.href
                    ? "bg-teal-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 space-y-2">
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal("signin");
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-300 text-center text-xs font-bold text-slate-800"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal("signup");
                  }}
                  className="w-full py-2.5 rounded-xl bg-teal-600 text-white text-center text-xs font-bold"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <>
                <Link
                  href={roleInfo.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold text-center flex items-center justify-center space-x-1.5"
                >
                  <RoleIcon className="w-4 h-4" />
                  <span>Go to {roleInfo.label}</span>
                </Link>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-teal-700 font-semibold uppercase">
                      {roleInfo.badge}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal("demo");
                    }}
                    className="text-xs text-teal-700 font-bold underline"
                  >
                    Switch Role
                  </button>
                </div>

                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await handleLogout();
                  }}
                  className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold text-center flex items-center justify-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
