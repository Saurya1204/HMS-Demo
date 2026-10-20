"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Activity,
  Award,
  Brain,
  Building2,
  CheckCircle2,
  HeartPulse,
  PhoneCall,
  ShieldAlert,
  Stethoscope,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  const { setIsRoleModalOpen } = useApp();

  const leadership = [
    {
      name: "Col. R. Singh (Retd.)",
      role: "Hospital Administrator & Operations Director",
      bio: "Spearheading administrative governance, multi-facility infrastructure, and operational excellence across Maharajganj and Raebareli.",
      badge: "Hospital Admin",
      badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    {
      name: "Dr. Priya Sharma, MD (AIIMS)",
      role: "Head of Neurology & Stroke Unit",
      bio: "Pioneering hyperacute stroke intervention, telestroke thrombolysis, and clinical outpatient neuro-care protocols.",
      badge: "Doctor Panel",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    },
    {
      name: "Dr. Arvind Verma, PhD",
      role: "Director, MNSRI Research Institute",
      bio: "Leading neuroplasticity clinical trials, biomarker discoveries, and ICMR/Lancet collaborative research publications.",
      badge: "Research Lead",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    },
    {
      name: "Sunita Devi (ANM)",
      role: "Field Lead, AMMA Rural Digital Clinics",
      bio: "Directing grassroots outreach, door-to-door FAST stroke screening, and rapid digital telemetry transfer for rural Raebareli.",
      badge: "AMMA Clinic",
      badgeColor: "bg-green-100 text-green-800 border-green-300",
    },
  ];

  const milestones = [
    {
      stat: "150+",
      label: "Hospital Beds",
      sub: "Stroke ICU, Neuro Recovery, & General Care",
    },
    {
      stat: "42",
      label: "AMMA Rural Clinics",
      sub: "Covering rural Raebareli & Maharajganj",
    },
    {
      stat: "< 45m",
      label: "Golden Hour Target",
      sub: "Rural triage to tertiary thrombolysis",
    },
    {
      stat: "8",
      label: "Active Clinical Trials",
      sub: "MNSRI Neuroscience & Neuroplasticity",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold">
            <Building2 className="w-4 h-4" />
            <span>Maharajganj & Raebareli Healthcare Ecosystem</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Bridging Rural Health & Advanced Neuroscience
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            <strong>SBM Hospitals</strong> and the <strong>Maharajganj Neuroscience & Stroke Research Institute (MNSRI)</strong> unite tertiary acute hospital infrastructure, peripheral rural telemedicine clinics, and world-class stroke research into one cohesive digital care network.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/services"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2"
            >
              <span>Explore Clinical Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-all flex items-center space-x-1.5"
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Login / Switch Role</span>
            </button>

            {/* Critical Alert Hotline Button */}
            <a
              href="tel:108"
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-500/20 transition-all flex items-center space-x-1.5"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Emergency Stroke 108</span>
            </a>
          </div>
        </div>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {milestones.map((m, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all"
          >
            <div className="text-2xl sm:text-3xl font-black text-blue-600">
              {m.stat}
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">{m.label}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Dual Mission Cards: SBM Hospitals + MNSRI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entity 1: SBM Hospitals */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Clinical Healthcare Entity
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              SBM Hospitals (Maharajganj & Raebareli)
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Provides comprehensive inpatient and outpatient healthcare services across Uttar Pradesh. Features fully equipped Stroke Intensive Care Units, specialized neurological recovery wards, digital prescription management, and 24/7 central emergency reception.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {[
              "Dedicated 12-Bed Acute Stroke ICU with Continuous Telemetry",
              "Integrated AMMA Digital Clinics for village-level FAST triage",
              "Instant Inpatient Bed Board & Real-Time Census Tracking",
              "Digital Prescription System with ICD-10 Diagnostic Records",
            ].map((feature, i) => (
              <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Entity 2: MNSRI */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              Neuroscience Research Entity
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              Maharajganj Neuroscience & Stroke Research Institute (MNSRI)
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              An academic research institution dedicated to pioneering neurological science in rural India. Conducting active clinical trials on post-stroke neuroplasticity, cognitive recovery, and AI-assisted clinical trial discovery.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {[
              "Clinical Trials Portal with Real-Time Milestone Tracking",
              "AI Evidence Synthesizer for PubMed / Cochrane Literature",
              "Peer-Reviewed Medical Publications (Lancet Regional Health)",
              "Translational Research Directly Benefiting Rural Patients",
            ].map((feature, i) => (
              <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Institutional Leadership & Clinical Team
          </h2>
          <p className="text-xs text-slate-500">
            Dedicated healthcare pioneers transforming healthcare delivery in Eastern UP.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leadership.map((person, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${person.badgeColor}`}
                >
                  {person.badge}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  {person.name}
                </h4>
                <div className="text-[11px] font-semibold text-blue-600">
                  {person.role}
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {person.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Call to Action */}
      <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-blue-900">
            Ready to experience the digital workflow?
          </h3>
          <p className="text-xs text-blue-700 mt-0.5">
            Log in as an Administrator, Doctor, Clinic Worker, or Patient to test all platform features.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsRoleModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          Select Role & Start Demo
        </button>
      </div>
    </div>
  );
}
