"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Activity,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  HeartPulse,
  PhoneCall,
  Search,
  ShieldAlert,
  Stethoscope,
  Users,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ServicesPage() {
  const { addToast, triggerGlobalRefresh, setIsRoleModalOpen } = useApp();

  // Booking Form State
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState<number | "">("");
  const [patientGender, setPatientGender] = useState<"Male" | "Female" | "Other">("Male");
  const [patientContact, setPatientContact] = useState("");
  const [department, setDepartment] = useState("Neurology & Stroke Unit");
  const [symptoms, setSymptoms] = useState("Headache and mild dizziness");
  const [isBooking, setIsBooking] = useState(false);

  // FAST tool state
  const [faceDroop, setFaceDroop] = useState(false);
  const [armWeakness, setArmWeakness] = useState(false);
  const [speechDifficulty, setSpeechDifficulty] = useState(false);

  const isFastPositive = faceDroop || armWeakness || speechDifficulty;

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientAge || !patientContact) {
      addToast({
        title: "Incomplete Details",
        description: "Please provide patient name, age, and contact number.",
        type: "warning",
      });
      return;
    }

    setIsBooking(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: patientName,
          age: Number(patientAge),
          gender: patientGender,
          contact: patientContact,
          source: "Direct",
          urgency: isFastPositive ? "Critical" : "Routine",
          status: "Reception_Waiting",
          vitals: { bp: "128/82", spo2: 98, pulse: 76, temp: 98.4 },
          symptoms: [symptoms],
          notes: `Public Portal Booking for ${department}. FAST Screened: ${isFastPositive ? "POSITIVE" : "Normal"}.`,
        }),
      });

      const json = await res.json();
      if (json.success) {
        addToast({
          title: "Appointment Booked Successfully!",
          description: `Token: ${json.data.tokenQr}. Patient added to Central Reception queue.`,
          type: "success",
        });
        setPatientName("");
        setPatientAge("");
        setPatientContact("");
        triggerGlobalRefresh();
      }
    } catch {
      addToast({
        title: "Booking Failed",
        description: "Could not book appointment. Please check network connection.",
        type: "error",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const servicesList = [
    {
      title: "Acute Stroke & Neurovascular Care",
      desc: "24/7 dedicated acute stroke resuscitation, IV thrombolysis, and continuous ICU hemodynamic monitoring.",
      icon: HeartPulse,
      badge: "Emergency 24x7",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      actionLink: "#fast-screen",
      actionText: "FAST Screening Tool",
    },
    {
      title: "AMMA Digital Rural Health Clinics",
      desc: "Point-of-care digital clinics in 42 villages offering telemedicine consultations, digital health tokens, and rapid triage.",
      icon: Activity,
      badge: "Rural Outreach",
      color: "text-green-700 bg-green-50 border-green-200",
      actionLink: "/clinic",
      actionText: "Open AMMA Clinic",
    },
    {
      title: "Specialist OPD Consultations",
      desc: "Daily outpatient clinics for Neurology, Stroke Rehabilitation, General Medicine, and Geriatric Care with Dr. Priya Sharma.",
      icon: Stethoscope,
      badge: "Outpatient",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      actionLink: "#book-consultation",
      actionText: "Book Appointment",
    },
    {
      title: "Inpatient & Stroke ICU Bed Management",
      desc: "Live telemetry bed grid across Stroke ICU, Neuro Recovery, and General Care wards with real-time occupancy updates.",
      icon: Building2,
      badge: "150 Beds",
      color: "text-yellow-800 bg-yellow-50 border-yellow-300",
      actionLink: "/bed-board",
      actionText: "View Bed Board",
    },
    {
      title: "Diagnostic Neuroimaging & Lab Services",
      desc: "Emergency Plain NCCT Brain, MRI Brain DWI sequences, Carotid Doppler, and full biochemical pathology panels.",
      icon: Brain,
      badge: "Diagnostics",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      actionLink: "/doctor",
      actionText: "Doctor Order Panel",
    },
    {
      title: "MNSRI Neuroscience Clinical Trials",
      desc: "Cutting-edge neuroplasticity research protocols and AI-assisted scientific literature synthesis directly linked to patient recovery.",
      icon: Sparkles,
      badge: "Research",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      actionLink: "/research",
      actionText: "MNSRI Portal",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Comprehensive Clinical & Rural Healthcare</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Healthcare Services & Patient Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Explore inpatient care, rural outreach clinics, diagnostic services, or book an OPD consultation directly with our clinical specialists.
          </p>
        </div>

        {/* Critical Alert Button */}
        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="tel:108"
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-500/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Emergency Stroke 108</span>
          </a>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {servicesList.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${srv.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${srv.color}`}>
                    {srv.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {srv.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={srv.actionLink}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>{srv.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column: Booking Form + FAST Self-Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Column 1: Public Appointment Booking */}
        <div
          id="book-consultation"
          className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-xs uppercase font-bold tracking-wider text-blue-700">
                Patient & Community Portal
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Book OPD Specialist Consultation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Appointments are immediately queued at the Hospital Central Reception with an automated digital token.
            </p>
          </div>

          <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  required
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : "")}
                  placeholder="48"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={patientContact}
                  onChange={(e) => setPatientContact(e.target.value)}
                  placeholder="+91 94500 12345"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="Neurology & Stroke Unit">Neurology & Stroke Unit (Dr. Priya)</option>
                  <option value="General Medicine">General Medicine Outpatient</option>
                  <option value="MNSRI Neuro-Rehab">MNSRI Neuroplasticity & Rehab</option>
                  <option value="Geriatric Stroke Follow-up">Geriatric Stroke Follow-up</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Reason for Visit / Symptoms
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe current symptoms or referral notes..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Token will be assigned instantly to Central Reception.
              </span>

              <button
                type="submit"
                disabled={isBooking}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{isBooking ? "Booking..." : "Confirm OPD Booking"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Column 2: FAST Stroke Self-Assessment Tool */}
        <div
          id="fast-screen"
          className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-red-600">
                Critical Health Screener
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              FAST Stroke Self-Assessment
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Check for signs of acute stroke. Time is brain: immediate medical intervention within 4.5 hours saves lives.
            </p>
          </div>

          <div className="space-y-3">
            {/* Check 1: Face */}
            <label
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                faceDroop
                  ? "bg-red-50 border-red-400 text-red-900"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={faceDroop}
                  onChange={(e) => setFaceDroop(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-red-600 rounded"
                />
                <div>
                  <div className="text-xs font-bold">F - Face Drooping</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Does one side of the face droop or feel numb when smiling?
                  </div>
                </div>
              </div>
            </label>

            {/* Check 2: Arm */}
            <label
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                armWeakness
                  ? "bg-red-50 border-red-400 text-red-900"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={armWeakness}
                  onChange={(e) => setArmWeakness(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-red-600 rounded"
                />
                <div>
                  <div className="text-xs font-bold">A - Arm Weakness</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Is one arm weak, heavy, or drifting downward when raised?
                  </div>
                </div>
              </div>
            </label>

            {/* Check 3: Speech */}
            <label
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                speechDifficulty
                  ? "bg-red-50 border-red-400 text-red-900"
                  : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={speechDifficulty}
                  onChange={(e) => setSpeechDifficulty(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-red-600 rounded"
                />
                <div>
                  <div className="text-xs font-bold">S - Speech Difficulty</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Is speech slurred, garbled, or hard to understand?
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Outcome Status */}
          {isFastPositive ? (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 space-y-3 animate-pulse">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span className="font-extrabold text-xs">
                  CRITICAL CODE STROKE ALERT: POSITIVE SIGNS DETECTED
                </span>
              </div>
              <p className="text-[11px] text-red-800 leading-relaxed">
                T - Time to Call 108 immediately. Do NOT drive yourself. The SBM Hospitals Acute Stroke Team will prepare the CT scanner and thrombolytic agent before arrival.
              </p>
              <a
                href="tel:108"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Emergency Stroke Hotline: 108</span>
              </a>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-900 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold">No acute FAST signs selected.</span>
                <p className="text-[11px] text-green-700 mt-0.5">
                  If symptoms persist, book a routine OPD consultation or visit your nearest AMMA Digital Clinic.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
