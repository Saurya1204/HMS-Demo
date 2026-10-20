"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Activity,
  HeartPulse,
  PhoneCall,
  QrCode,
  ShieldCheck,
  Stethoscope,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Sparkles,
} from "lucide-react";
import { FastAssessmentGuide } from "@/components/FastAssessmentGuide";

export default function AmmaClinicPage() {
  const { kpis, addToast } = useApp();
  const [fastActive, setFastActive] = useState(false);
  const [quickVillage, setQuickVillage] = useState("Bachhrawan Center");

  const centers = [
    {
      name: "AMMA Digital Health Post - Bachhrawan",
      location: "Raebareli Highway, Bachhrawan Block",
      nurse: "Sunita Devi (ANM Lead)",
      patientsToday: 38,
      status: "Active & Connected",
      distance: "18 km to SBM Main",
    },
    {
      name: "AMMA Digital Health Post - Shivgarh",
      location: "Near Shivgarh Rural Haat",
      nurse: "Rekha Yadav (Staff Nurse)",
      patientsToday: 29,
      status: "Active & Connected",
      distance: "24 km to SBM Main",
    },
    {
      name: "AMMA Digital Health Post - Lalganj",
      location: "Community Center, Lalganj",
      nurse: "Pooja Verma (ANM)",
      patientsToday: 44,
      status: "Active & Connected",
      distance: "32 km to SBM Main",
    },
    {
      name: "AMMA Digital Health Post - Maharajganj Rural",
      location: "Outreach Center, Ward 4",
      nurse: "Anjali Sahu (Community Incharge)",
      patientsToday: 51,
      status: "Active & Connected",
      distance: "6 km to SBM Main",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span>Grassroots Rural Tele-Healthcare Mission</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            AMMA Digital Clinic & Rural Outreach
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Bridging peripheral villages of Maharajganj and Raebareli with SBM Hospitals and MNSRI.
            Equipped with rapid vitals telemetry, acute stroke FAST screening, digital QR health tokens,
            and immediate tertiary hospital dispatch.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/clinic"
              className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-600/30 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Launch Staff Intake Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/appointments"
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
            >
              Book OPD Appointment
            </Link>

            <a
              href="tel:108"
              className="px-5 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-red-600/30"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>108 Stroke Ambulance</span>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Connected Clinics
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            42 Villages
          </div>
          <div className="text-xs text-teal-600 font-medium mt-1">
            Across Maharajganj & Raebareli
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Active Referrals
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 mt-1">
            {kpis?.activeAmmaReferrals || 4} En Route
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Monitored in Reception Queue
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Avg Door-to-Needle Time
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
            41.2 mins
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Down from 115 mins via FAST
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Monthly Rural Triage
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            1,420+
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Free Point-of-Care Vitals
          </div>
        </div>
      </div>

      {/* Workflow Explanation: 4 Step Continuum */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How the AMMA Rural Outreach Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            From peripheral village point-of-care to tertiary neuro-resuscitation at SBM Hospitals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-extrabold text-base">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Village Intake & Triage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Patient arrives at village health post. ANM records blood pressure, pulse, SpO2, and executes FAST acute stroke assessment.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-extrabold text-base">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Digital QR Token
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              System generates a tamper-evident, privacy-preserving QR token (e.g. AMMA-TK-9102) with zero unencrypted personal data.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-extrabold text-base">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Hospital Reception Alert
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              SBM Hospital Reception automatically reflects the incoming patient without delay, preparing the OPD queue or emergency CT scanner.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-extrabold text-base">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Doctor Consultation & Bed
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Neurologist evaluates patient using pre-populated vitals, prescribes medication, and immediately orders Stroke ICU or ward bed if needed.
            </p>
          </div>
        </div>
      </div>

      {/* Network of Centers */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Active AMMA Digital Clinics Network
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sample peripheral clinics actively sending real-time referrals into the platform.
            </p>
          </div>

          <Link
            href="/clinic"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1.5 self-start"
          >
            <span>Open Intake Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {centers.map((center, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{center.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{center.location}</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {center.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Incharge
                  </div>
                  <div className="font-semibold text-slate-800">{center.nurse}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Today
                  </div>
                  <div className="font-semibold text-slate-800">{center.patientsToday} visits</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Distance
                  </div>
                  <div className="font-semibold text-slate-800">{center.distance}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAST Tool Trigger */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-amber-800 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Acute Stroke Protocol (FAST)</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Learn or Verify FAST Stroke Warning Symptoms
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Face drooping, Arm weakness, Slurred speech, Time to call 108. Early recognition saves brain tissue.
          </p>
        </div>

        <button
          onClick={() => setFastActive(!fastActive)}
          className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          {fastActive ? "Close FAST Guide" : "Open FAST Screening Guide"}
        </button>
      </div>

      {fastActive && (
        <div className="animate-in fade-in duration-200">
          <FastAssessmentGuide />
        </div>
      )}
    </div>
  );
}
