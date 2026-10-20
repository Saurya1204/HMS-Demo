"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function DemoGuideRibbon() {
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useApp();

  const steps = [
    {
      num: 1,
      title: "1. Rural Intake (AMMA)",
      path: "/clinic",
      desc: "Village clinic triages patient & refers to main hospital",
      highlight: "Village Clinic",
    },
    {
      num: 2,
      title: "2. Reception Desk",
      path: "/reception",
      desc: "Hospital acknowledges referral & fast-tracks to doctor",
      highlight: "Reception Desk",
    },
    {
      num: 3,
      title: "3. Doctor EMR Chart",
      path: "/doctor",
      desc: "Neurologist evaluates vitals, prescribes & orders ICU bed",
      highlight: "Doctor EMR",
    },
    {
      num: 4,
      title: "4. Bed Management",
      path: "/bed-board",
      desc: "Stroke ICU bed assigned and telemetry activated",
      highlight: "Bed Board",
    },
    {
      num: 5,
      title: "5. MNSRI Research",
      path: "/research",
      desc: "Patient recovery feeds clinical trial & AI literature search",
      highlight: "Research Trials",
    },
    {
      num: 6,
      title: "6. Master Admin",
      path: "/admin",
      desc: "Executive view of hospital occupancy & live audit trail",
      highlight: "Admin KPIs",
    },
  ];

  const currentStepIndex = steps.findIndex((s) => s.path === pathname);
  const currentStep = currentStepIndex !== -1 ? steps[currentStepIndex] : null;
  const nextStep =
    currentStepIndex !== -1 && currentStepIndex < steps.length - 1
      ? steps[currentStepIndex + 1]
      : steps[0];

  const handleNextStep = () => {
    if (nextStep) {
      router.push(nextStep.path);
      addToast({
        title: `Step ${nextStep.num}: ${nextStep.title}`,
        description: nextStep.desc,
        type: "info",
      });
    }
  };

  return (
    <div className="bg-white border-b border-blue-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Presentation Mode Badge + Current Step */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>CLIENT DEMO FLOW</span>
            </div>

            {currentStep && (
              <div className="text-xs text-slate-700 flex items-center space-x-2">
                <span className="text-slate-500 hidden sm:inline">Current Step:</span>
                <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {currentStep.title}
                </span>
                <span className="text-slate-400 hidden sm:inline">•</span>
                <span className="text-slate-600 font-medium hidden md:inline text-xs">
                  {currentStep.desc}
                </span>
              </div>
            )}
          </div>

          {/* Right: Step Stepper Navigation + 1-Click Next Step */}
          <div className="flex items-center space-x-2">
            {/* Step Pills */}
            <div className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {steps.map((s, idx) => {
                const isActive = pathname === s.path;
                const isPassed = currentStepIndex > idx;
                return (
                  <Link
                    key={s.num}
                    href={s.path}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : isPassed
                        ? "text-green-700 font-bold hover:bg-slate-200/60"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <span>{s.num}.</span>
                    <span>{s.highlight}</span>
                    {isPassed && <CheckCircle2 className="w-3 h-3 text-green-600 ml-0.5" />}
                  </Link>
                );
              })}
            </div>

            {/* Next Step Action Button */}
            <button
              onClick={handleNextStep}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 cursor-pointer transition-all hover:scale-102 shrink-0"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
