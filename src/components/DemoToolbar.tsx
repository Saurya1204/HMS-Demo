"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Globe,
  Stethoscope,
  ClipboardList,
  FileText,
  BedDouble,
  Brain,
  BarChart3,
  RotateCcw,
  UserCheck,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export function DemoToolbar() {
  const pathname = usePathname();
  const { kpis, isSeeding, triggerSeed, setIsRoleModalOpen, currentUser } =
    useApp();
  const [isMinimized, setIsMinimized] = useState(false);

  const views = [
    {
      id: "public",
      name: "Public Portal",
      href: "/",
      icon: Globe,
      activeBg: "bg-teal-600 text-white font-bold shadow-xs",
      badge: null,
    },
    {
      id: "clinic",
      name: "AMMA Clinic",
      href: "/clinic",
      icon: Stethoscope,
      activeBg: "bg-teal-600 text-white font-bold shadow-xs",
      badge: kpis?.activeAmmaReferrals ? `${kpis.activeAmmaReferrals} new` : null,
      badgeColor: "bg-emerald-600 text-white",
    },
    {
      id: "reception",
      name: "Reception",
      href: "/reception",
      icon: ClipboardList,
      activeBg: "bg-teal-600 text-white font-bold shadow-xs",
      badge: kpis?.pendingReceptionActions ? `${kpis.pendingReceptionActions}` : null,
      badgeColor: "bg-amber-500 text-slate-950",
    },
    {
      id: "doctor",
      name: "Doctor",
      href: "/doctor",
      icon: FileText,
      activeBg: "bg-teal-600 text-white font-bold shadow-xs",
      badge: kpis?.criticalPatients ? `${kpis.criticalPatients} crit` : null,
      badgeColor: "bg-red-600 text-white animate-pulse",
    },
    {
      id: "bed-board",
      name: "Bed Board",
      href: "/bed-board",
      icon: BedDouble,
      activeBg: "bg-teal-600 text-white font-bold shadow-xs",
      badge: kpis?.availableBeds ? `${kpis.availableBeds} free` : null,
      badgeColor: "bg-emerald-600 text-white",
    },
    {
      id: "research",
      name: "MNSRI Research",
      href: "/research-portal",
      icon: Brain,
      activeBg: "bg-indigo-600 text-white font-bold shadow-xs",
      badge: kpis?.ongoingResearchProjects ? `${kpis.ongoingResearchProjects} trials` : null,
      badgeColor: "bg-indigo-800 text-white",
    },
    {
      id: "admin",
      name: "Admin Analytics",
      href: "/admin",
      icon: BarChart3,
      activeBg: "bg-slate-900 text-white font-bold shadow-xs",
      badge: kpis?.occupancyPercentage ? `${kpis.occupancyPercentage}%` : null,
      badgeColor: "bg-slate-700 text-white",
    },
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-teal-700 shadow-lg hover:bg-slate-50 transition-all text-xs font-bold cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
          <span>Show Demo Switcher</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 inset-x-0 z-50 pointer-events-none flex justify-center px-3">
      <div className="pointer-events-auto bg-white/95 border border-slate-300/80 shadow-2xl rounded-2xl p-1.5 backdrop-blur-md flex items-center space-x-1 max-w-full overflow-x-auto ring-1 ring-slate-900/5">
        {/* Switcher Label */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 border-r border-slate-200 text-left">
          <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center text-teal-800 font-extrabold text-xs">
            7x
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 leading-tight">
              Demo Switcher
            </div>
            <div className="text-xs font-extrabold text-slate-900">
              SBM + MNSRI
            </div>
          </div>
        </div>

        {/* 7 Destinations */}
        <div className="flex items-center space-x-1">
          {views.map((v) => {
            const Icon = v.icon;
            const isActive =
              pathname === v.href ||
              (v.href === "/research-portal" && pathname === "/research");

            return (
              <Link
                key={v.id}
                href={v.href}
                className={`relative px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 border shrink-0 ${
                  isActive
                    ? `${v.activeBg} border-transparent`
                    : "border-transparent text-slate-700 hover:text-teal-700 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-white" : "text-slate-500"
                  }`}
                />
                <span className="hidden sm:inline whitespace-nowrap">{v.name}</span>

                {v.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full leading-none hidden md:inline-block ${v.badgeColor}`}
                  >
                    {v.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        {/* Persona quick switch */}
        <button
          onClick={() => setIsRoleModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer shrink-0"
          title="Switch Staff Persona"
        >
          <UserCheck className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden md:inline">{currentUser.role}</span>
        </button>

        {/* Re-seed button */}
        <button
          onClick={() => triggerSeed()}
          disabled={isSeeding}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-teal-700 transition-all flex items-center space-x-1 text-xs cursor-pointer shrink-0"
          title="Reset Database to Default Seed State"
        >
          <RotateCcw
            className={`w-3.5 h-3.5 ${isSeeding ? "animate-spin text-teal-600" : ""}`}
          />
        </button>

        {/* Collapse */}
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          title="Minimize toolbar"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
