"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Activity,
  Brain,
  Stethoscope,
  Calendar,
  Users,
  ArrowRight,
  Sparkles,
  BedDouble,
  HeartPulse,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Building2,
  BarChart3,
  FlaskConical,
  Clock,
  Send,
  AlertTriangle,
  ChevronRight,
  FileText,
  Ambulance,
  Microscope,
  Award,
  Layers,
} from "lucide-react";

export default function HomePage() {
  const { kpis, switchRole, addToast } = useApp();

  // Quick OPD Slot Booking State
  const [opdName, setOpdName] = useState("");
  const [opdContact, setOpdContact] = useState("");
  const [opdDept, setOpdDept] = useState("Neurology & Stroke");
  const [opdDate, setOpdDate] = useState("Tomorrow Morning, 10:00 AM");
  const [isSubmittingOpd, setIsSubmittingOpd] = useState(false);

  // Quick Enquiry Form State
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [enquirySubject, setEnquirySubject] = useState("General Healthcare Services");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  const handleQuickOpdBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opdName || !opdContact) {
      addToast({
        title: "Required Fields Missing",
        description: "Please enter patient name and contact number.",
        type: "warning",
      });
      return;
    }

    setIsSubmittingOpd(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: opdName,
          patientContact: opdContact,
          department: opdDept,
          appointmentDate: opdDate,
          timeSlot: "10:00 AM - 11:00 AM",
          doctorName: "Dr. Priya Sharma, MD",
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({
          title: "Appointment Confirmed",
          description: `Appointment token #${data.data.tokenNumber || "APPT-101"} generated for ${opdName}.`,
          type: "success",
        });
        setOpdName("");
        setOpdContact("");
      } else {
        addToast({
          title: "Booking Simulated",
          description: `Slot reserved for ${opdName} (${opdDept}) at ${opdDate}.`,
          type: "success",
        });
      }
    } catch {
      addToast({
        title: "Appointment Recorded",
        description: `Demo appointment scheduled for ${opdName}.`,
        type: "success",
      });
    } finally {
      setIsSubmittingOpd(false);
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone) {
      addToast({
        title: "Incomplete Details",
        description: "Please provide your name and contact phone number.",
        type: "warning",
      });
      return;
    }
    setEnquirySubmitted(true);
    addToast({
      title: "Enquiry Received",
      description: `Thank you ${enquiryName}. Hospital reception has received your demo enquiry.`,
      type: "success",
    });
    setEnquiryName("");
    setEnquiryPhone("");
    setEnquiryMessage("");
    setTimeout(() => setEnquirySubmitted(false), 5000);
  };

  const roleWorkspaces = [
    {
      title: "Hospital Administrator",
      roleName: "Col. R. Singh (Retd.)",
      role: "admin" as const,
      desc: "Comprehensive operational analytics, ward census, bed management, user RBAC, and immutable audit logs.",
      href: "/admin",
      icon: BarChart3,
      badge: "Administrator",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    },
    {
      title: "Doctor Clinical EMR",
      roleName: "Dr. Priya Sharma, MD",
      role: "doctor" as const,
      desc: "Live clinical consultation queue, vitals chart, ICD-10 diagnostic coding, e-Prescriptions, and inpatient admission.",
      href: "/doctor",
      icon: Stethoscope,
      badge: "Attending Clinician",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    },
    {
      title: "Reception & Triage Desk",
      roleName: "Rajesh Kumar",
      role: "receptionist" as const,
      desc: "Inbound rural referrals from AMMA clinics, patient check-in, OPD token generation, and live triage queue.",
      href: "/reception",
      icon: Users,
      badge: "Hospital Reception",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    },
    {
      title: "AMMA Digital Rural Clinic",
      roleName: "Sunita Devi (ANM)",
      role: "nurse" as const,
      desc: "Rural peripheral clinic intake, FAST stroke triage, vitals screening, and tertiary QR referral generation.",
      href: "/clinic",
      icon: Activity,
      badge: "Peripheral Health Worker",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      title: "MNSRI Neuroscience Research",
      roleName: "Dr. Arvind Verma, PhD",
      role: "researcher" as const,
      desc: "Neuroplasticity clinical study management, 5-phase milestone tracking, Lancet manuscript drafts, and AI research explorer.",
      href: "/research-portal",
      icon: FlaskConical,
      badge: "Research Director",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    },
    {
      title: "Patient & Family Portal",
      roleName: "Ramesh Patel (Patient)",
      role: "patient" as const,
      desc: "Access digital appointment tokens, visit summaries, prescribed medications, and doctor follow-up advice.",
      href: "/patient-portal",
      icon: HeartPulse,
      badge: "Patient Portal",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    },
  ];

  const keySpecialties = [
    {
      title: "Neurology & Acute Stroke Care",
      desc: "Dedicated 24/7 hyperacute stroke response unit with telestroke triage, rapid neuro-imaging, and acute clinical pathways.",
      icon: Brain,
      badge: "Tertiary Center",
      color: "border-teal-200 bg-teal-50/50",
      iconColor: "text-teal-700 bg-teal-100",
    },
    {
      title: "Inpatient Bed & ICU Management",
      desc: "Specialized Stroke ICU, Neuro-Recovery Wards, and General Medical units with real-time telemetry bed tracking.",
      icon: BedDouble,
      badge: "150-Bed Capacity",
      color: "border-slate-200 bg-white",
      iconColor: "text-slate-800 bg-slate-100",
    },
    {
      title: "AMMA Digital Rural Outreach",
      desc: "Hub-and-spoke community clinic network connecting peripheral villages across Maharajganj and Raebareli.",
      icon: Activity,
      badge: "42 Village Outposts",
      color: "border-emerald-200 bg-emerald-50/50",
      iconColor: "text-emerald-700 bg-emerald-100",
    },
    {
      title: "Neuro-Rehabilitation & Recovery",
      desc: "Multi-disciplinary physical, speech, and cognitive rehabilitation tailored for post-stroke recovery and motor restoration.",
      icon: HeartPulse,
      badge: "MNSRI Integrated",
      color: "border-indigo-200 bg-indigo-50/50",
      iconColor: "text-indigo-700 bg-indigo-100",
    },
    {
      title: "24/7 Emergency & Code Stroke",
      desc: "Rapid-response emergency triage protocol coordinated with regional ambulance networks for immediate golden-hour care.",
      icon: Ambulance,
      badge: "24/7 Readiness",
      color: "border-red-200 bg-red-50/40",
      iconColor: "text-red-700 bg-red-100",
    },
    {
      title: "Diagnostic Imaging & Labs",
      desc: "Comprehensive neuro-imaging, automated clinical biochemistry, and rapid microbiology testing for accurate diagnosis.",
      icon: Microscope,
      badge: "Advanced Diagnostics",
      color: "border-slate-200 bg-white",
      iconColor: "text-teal-700 bg-teal-100",
    },
  ];

  const carePathways = [
    {
      step: "01",
      title: "Community Intake",
      desc: "Patient visits rural AMMA Digital Clinic. Health worker records vitals, conducts FAST assessment, and creates QR referral.",
      actor: "AMMA Clinic / Rural ANM",
      href: "/clinic",
    },
    {
      step: "02",
      title: "Central Reception & Triage",
      desc: "Hospital reception scans referral QR code, confirms patient arrival, registers demographic file, and queues for OPD.",
      actor: "Central Reception Desk",
      href: "/reception",
    },
    {
      step: "03",
      title: "Clinical Consultation",
      desc: "Attending doctor reviews vitals, records ICD-10 diagnosis, prescribes therapeutics, and orders inpatient admission if needed.",
      actor: "Doctor EMR Console",
      href: "/doctor",
    },
    {
      step: "04",
      title: "Bed Allocation & Inpatient Care",
      desc: "Nurse or administrator allocates patient to available Stroke ICU or Neuro-Recovery bed with real-time status updates.",
      actor: "Inpatient Bed Board",
      href: "/bed-board",
    },
    {
      step: "05",
      title: "Research & Rehabilitation",
      desc: "De-identified clinical data informs MNSRI neuroplasticity trials, recovery tracking, and peer-reviewed study milestones.",
      actor: "MNSRI Research Portal",
      href: "/research-portal",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#1E293B]">
      {/* 1. HERO SECTION (Exact specification) */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-16 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline, Supporting Text, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Institutional Location Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                <span>Maharajganj – Raebareli, Uttar Pradesh</span>
                <span className="text-teal-300">•</span>
                <span className="text-teal-900 font-extrabold">Integrated Healthcare Platform Demo</span>
              </div>

              {/* Exact Required Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.15]">
                Advanced Clinical Care.{" "}
                <span className="text-teal-700">Pioneering Neuroscience Research.</span>
              </h1>

              {/* Exact Required Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                “Connecting hospital services, community healthcare, and neuroscience research through one integrated digital platform.”
              </p>

              {/* Required CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/appointments"
                  className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md shadow-teal-600/20 flex items-center space-x-2 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/services"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4 text-teal-700" />
                  <span>Explore Our Services</span>
                </Link>

                <Link
                  href="/clinic"
                  className="px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-sm flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Launch AMMA Demo</span>
                </Link>
              </div>

              {/* Verification & Demo Notice */}
              <div className="pt-2 flex items-center space-x-2 text-xs text-slate-500">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  Interactive client demonstration prototype. Sample data and statistics are clearly labeled for demonstration purposes.
                </span>
              </div>
            </div>

            {/* Right Column: Key Operational Metric Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {/* Metric 1: Bed Occupancy */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-teal-300 transition-all">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Bed Occupancy</span>
                  <BedDouble className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-3xl font-black text-[#0F172A] mt-2 font-mono">
                  {kpis?.occupancyPercentage || 38}%
                </div>
                <div className="text-xs text-emerald-700 font-bold mt-1">
                  {kpis?.availableBeds || 5} Beds Available
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Stroke ICU & Wards</div>
              </div>

              {/* Metric 2: Critical Code Stroke */}
              <div className="p-5 rounded-2xl bg-white border border-red-200 shadow-xs hover:border-red-300 transition-all">
                <div className="flex items-center justify-between text-red-700 text-xs font-bold">
                  <span>Critical Stroke Unit</span>
                  <HeartPulse className="w-4 h-4 text-red-600 animate-pulse" />
                </div>
                <div className="text-3xl font-black text-red-600 mt-2 font-mono">
                  {kpis?.criticalPatients || 1}
                </div>
                <div className="text-xs text-red-700 font-bold mt-1">
                  Active Golden Hour
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Protocol Engaged</div>
              </div>

              {/* Metric 3: Rural Outreach */}
              <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs hover:border-emerald-300 transition-all">
                <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
                  <span>AMMA Clinic Intake</span>
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-emerald-800 mt-2 font-mono">
                  {kpis?.activeAmmaReferrals || 2}
                </div>
                <div className="text-xs text-emerald-700 font-bold mt-1">
                  Inbound Referrals
                </div>
                <div className="text-[11px] text-slate-400 mt-1">42 Connected Clinics</div>
              </div>

              {/* Metric 4: MNSRI Research Studies */}
              <div className="p-5 rounded-2xl bg-white border border-indigo-200 shadow-xs hover:border-indigo-300 transition-all">
                <div className="flex items-center justify-between text-indigo-800 text-xs font-bold">
                  <span>MNSRI Research</span>
                  <Brain className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-3xl font-black text-indigo-800 mt-2 font-mono">
                  {kpis?.ongoingResearchProjects || 2}
                </div>
                <div className="text-xs text-indigo-700 font-bold mt-1">
                  Active Clinical Trials
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Lancet Paper In Review</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROLE-BASED WORKSPACES LAUNCHER */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-extrabold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Role-Based Workspaces</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            One Integrated Platform. Tailored Workspaces.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Experience realistic end-to-end hospital workflows by entering as an Administrator, Doctor, Receptionist, Rural Clinic Worker, Researcher, or Patient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleWorkspaces.map((ws, idx) => {
            const Icon = ws.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-400 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-teal-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ws.badgeColor}`}>
                      {ws.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {ws.title}
                    </h3>
                    <div className="text-xs font-semibold text-teal-700 mt-0.5">
                      Demo Persona: {ws.roleName}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {ws.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      switchRole(ws.role);
                      window.location.href = ws.href;
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => switchRole(ws.role)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                    title="Switch active session"
                  >
                    Log In
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SECTION 1: HOSPITAL AND RESEARCH OVERVIEW */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Section 1 • Institutional Overview</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                SBM Hospitals & MNSRI: Serving Maharajganj & Raebareli
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Founded to bridge the critical gap between grassroots rural healthcare and advanced neurological intervention, <strong>SBM Hospitals</strong> operates as a state-of-the-art tertiary care center in southern Uttar Pradesh.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Integrated directly on-campus, the <strong>Maharajganj Neuroscience & Stroke Research Institute (MNSRI)</strong> translates frontline clinical stroke encounters into pioneering neuroplasticity research, peer-reviewed clinical studies, and community health interventions.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[#F4F8FA] border border-slate-200">
                  <div className="text-xl font-bold text-teal-800 font-mono">150+ Beds</div>
                  <div className="text-xs text-slate-500 font-medium">Stroke ICU & Wards</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F4F8FA] border border-slate-200">
                  <div className="text-xl font-bold text-indigo-800 font-mono">42 Clinics</div>
                  <div className="text-xs text-slate-500 font-medium">AMMA Digital Outposts</div>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center space-x-2 text-teal-700 hover:text-teal-800 font-bold text-sm"
                >
                  <span>Learn more about our institution and leadership</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-2xl bg-[#0F172A] text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    Pioneering Triad
                  </span>
                  <Award className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Hospital + Rural Clinics + Neuroscience Research
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unlike conventional standalone hospitals, SBM Hospitals & MNSRI operates a closed-loop digital ecosystem where rural village screenings directly inform tertiary specialist care and clinical trials.
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">
                      <strong>Hyperacute Stroke Golden Hour:</strong> Rapid telestroke triage from village clinics to Stroke ICU.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">
                      <strong>Digital Identity & Tokenization:</strong> Opaque QR referral tokens protecting rural patient privacy.
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">
                      <strong>Translational Science:</strong> Real-time clinical study milestones published in global journals.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: KEY SERVICES AND SPECIALTIES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-extrabold mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Section 2 • Clinical Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            Comprehensive Hospital Services & Specialties
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Explore primary, emergency, inpatient, and specialized neurological care available across SBM Hospitals and MNSRI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keySpecialties.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-2xl border ${spec.color} shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${spec.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {spec.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">{spec.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{spec.desc}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <Link
                    href="/appointments"
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1"
                  >
                    <span>Book Specialist</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/services"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/services"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-50 shadow-xs"
          >
            <span>View All Healthcare & Diagnostic Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. SECTION 3: AMMA DIGITAL CLINIC & RURAL HEALTHCARE OUTREACH */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <Activity className="w-3.5 h-3.5" />
                <span>Section 3 • Rural Outreach</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                AMMA Digital Clinics: Grassroots Triage to Tertiary Care
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                The <strong>AMMA Digital Clinic</strong> model empowers Auxiliary Nurse Midwives (ANMs) and rural health workers in peripheral villages with a tablet-based digital intake system. Patients presenting with stroke symptoms, acute hypertension, or distress receive instant FAST neurological screening.
              </p>
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#F4F8FA] border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">Point-of-Care Vitals & FAST Stroke Screening</h4>
                    <p className="text-slate-500 mt-0.5">Capture Blood Pressure, Pulse, SpO2, and immediate Face-Arm-Speech indicators.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#F4F8FA] border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">Privacy-Preserving QR Referral Token</h4>
                    <p className="text-slate-500 mt-0.5">Generates an opaque scannable token with no raw sensitive medical data exposed.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#F4F8FA] border border-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">Immediate Real-Time Transmission to Hospital Reception</h4>
                    <p className="text-slate-500 mt-0.5">SBM Reception and Emergency desk receive the inbound referral notification within milliseconds.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/clinic"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <Activity className="w-4 h-4" />
                  <span>Open AMMA Clinic Intake</span>
                </Link>
                <Link
                  href="/amma-clinic"
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:bg-slate-50"
                >
                  <span>Learn About AMMA Network</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-[#F4F8FA] border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase">Live AMMA Triage Simulation</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Outreach Hub
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-800">Mohanlalganj Outpost #03</span>
                      <span className="text-red-600 font-extrabold">Urgent Triage</span>
                    </div>
                    <div className="text-slate-500 mt-1">FAST Assessment: Right arm weakness + Dysarthria.</div>
                    <div className="text-[11px] text-teal-700 font-medium mt-1">Token: #AMMA-TK-8841 • Dispatched</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-800">Baccharawan Center #07</span>
                      <span className="text-emerald-700 font-extrabold">Routine OPD</span>
                    </div>
                    <div className="text-slate-500 mt-1">Hypertension follow-up & chronic headache check.</div>
                    <div className="text-[11px] text-teal-700 font-medium mt-1">Token: #AMMA-TK-8842 • Arrived</div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 italic text-center">
                  *Referrals created in AMMA Clinic persist to MongoDB and show instantly in Hospital Reception.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 4: OPD APPOINTMENT BOOKING */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-extrabold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Section 4 • OPD Appointments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Book an Outpatient Specialist Consultation
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Patients and family members can pre-book OPD consultation slots with our neurologists, cardiologists, and general physicians without waiting in line.
            </p>
            <div className="space-y-2 text-xs text-slate-600 pt-2">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Instant digital queue token generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>SMS confirmation & WhatsApp token pass</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Dedicated senior citizen & emergency fast-track</span>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/appointments"
                className="inline-flex items-center space-x-2 text-teal-700 hover:text-teal-800 font-bold text-sm"
              >
                <span>View OPD Doctor Schedule & Full Booking Page</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <h3 className="text-base font-bold text-[#0F172A]">Quick OPD Slot Reservation</h3>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  Instant Token
                </span>
              </div>

              <form onSubmit={handleQuickOpdBooking} className="mt-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      value={opdName}
                      onChange={(e) => setOpdName(e.target.value)}
                      placeholder="e.g. Ram Charan Mishra"
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={opdContact}
                      onChange={(e) => setOpdContact(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Clinical Department</label>
                    <select
                      value={opdDept}
                      onChange={(e) => setOpdDept(e.target.value)}
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-teal-600"
                    >
                      <option value="Neurology & Stroke">Neurology & Stroke (Dr. Priya Sharma)</option>
                      <option value="Neuro-Rehabilitation">Neuro-Rehabilitation (MNSRI)</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology & Vascular</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Preferred Slot</label>
                    <select
                      value={opdDate}
                      onChange={(e) => setOpdDate(e.target.value)}
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-teal-600"
                    >
                      <option value="Today (Urgent Fast-Track), 02:00 PM">Today (Urgent Fast-Track), 02:00 PM</option>
                      <option value="Tomorrow Morning, 10:00 AM">Tomorrow Morning, 10:00 AM</option>
                      <option value="Tomorrow Afternoon, 01:30 PM">Tomorrow Afternoon, 01:30 PM</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Consultation fee: ₹300 (Subsidized for rural UP residents)
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmittingOpd}
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                  >
                    {isSubmittingOpd ? "Generating..." : "Generate Digital Token"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION 5: NEUROSCIENCE & STROKE RESEARCH HIGHLIGHTS (MNSRI) */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-extrabold mb-2">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Section 5 • MNSRI Research Institute</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Neuroscience & Stroke Research Highlights
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Translating bedside stroke recovery discoveries into peer-reviewed neuroplasticity science.
            </p>
          </div>

          {/* Mandatory Research Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="font-semibold">
              <strong>Research tool only — Not for autonomous clinical diagnosis.</strong> All clinical trial protocols and sample publications represent synthetic demonstration data.
            </div>
          </div>

          {/* Featured Study Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A] text-white space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Featured Clinical Trial (MNSRI-2025-01)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Neuroplasticity & Post-Stroke Motor Recovery Study
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Principal Investigator: Dr. Arvind Verma, PhD • Co-PI: Dr. Priya Sharma, MD
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Target: 120 Cohort Patients
                </span>
              </div>
            </div>

            {/* 5-Phase Milestone Stepper */}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Clinical Study Milestone Tracker
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  { name: "1. Literature Review", status: "Completed", date: "Jan 2025", color: "bg-emerald-500" },
                  { name: "2. Ethics Clearance", status: "Completed", date: "Feb 2025", color: "bg-emerald-500" },
                  { name: "3. Patient Cohort", status: "In Progress", date: "Apr 2025", color: "bg-indigo-500" },
                  { name: "4. Data Analysis", status: "Upcoming", date: "Jun 2025", color: "bg-slate-700" },
                  { name: "5. Peer Review", status: "Upcoming", date: "Aug 2025", color: "bg-slate-700" },
                ].map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div className="flex items-center space-x-1.5 mb-1.5">
                      <span className={`w-2 h-2 rounded-full ${m.color}`} />
                      <span className="font-bold text-white text-[11px] truncate">{m.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{m.status}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{m.date}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Latest manuscript: <em>“Telestroke-facilitated motor restoration in rural tertiary settings”</em> (Under Review - The Lancet Regional Health).
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/research-portal"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Open Researcher Portal</span>
                </Link>
                <Link
                  href="/research"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Research Overview
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECTION 6: HOSPITAL FACILITIES AND CARE PATHWAYS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-extrabold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Section 6 • Care Pathways</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            Integrated 5-Step Patient Care Pathway
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            See how the platform unifies rural outreach, reception, doctor encounters, bed allocation, and research.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {carePathways.map((path, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-teal-300 transition-all"
            >
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-black text-xs flex items-center justify-center font-mono">
                  {path.step}
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]">{path.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{path.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[10px] font-semibold text-teal-700">{path.actor}</div>
                <Link
                  href={path.href}
                  className="mt-1 text-[11px] font-bold text-slate-800 hover:text-teal-700 flex items-center space-x-1"
                >
                  <span>Experience Step</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. SECTION 7: PATIENT AND COMMUNITY BENEFITS */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold mb-2">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Section 7 • Community Impact</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Patient & Community Benefits
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Delivering equitable, transparent, and high-quality healthcare to Uttar Pradesh families.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#F4F8FA] border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Golden-Hour Stroke Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rural patients receive immediate neurological triage at local AMMA outposts, eliminating critical transport delays and saving brain tissue.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F8FA] border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Zero-Paperwork Referrals</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Digital QR tokens eliminate lost medical files and repeated doctor explanations. Patients arrive at tertiary reception pre-triaged.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F8FA] border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Global Science Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients have voluntary access to state-of-the-art neuroplasticity rehabilitation protocols developed by MNSRI in academic partnership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SECTION 8: CONTACT AND LOCATION INFORMATION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-extrabold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Section 8 • Contact & Campus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
              Reach SBM Hospitals & MNSRI
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Located strategically on the Raebareli–Maharajganj highway to serve peri-urban and rural populations across the region.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-200">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Campus Address:</strong>
                  <div className="text-slate-500">SBM Hospitals & MNSRI Campus, NH-30 Raebareli–Maharajganj Highway, Raebareli District, Uttar Pradesh – 229103</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-200">
                <PhoneCall className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Emergency Stroke Hotline (Demo Simulation):</strong>
                  <div className="text-slate-500">Code Stroke Helpline: 108 • Tertiary ICU Desk: +91 535 220 9800</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-200">
                <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Operational Hours:</strong>
                  <div className="text-slate-500">Emergency & Stroke ICU: 24 Hours • OPD Consultations: 09:00 AM – 05:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
              <div className="pb-3 border-b border-slate-200">
                <h3 className="text-base font-bold text-[#0F172A]">Send an Institutional Enquiry</h3>
                <p className="text-xs text-slate-500 mt-0.5">Submit a message to hospital reception or research administration.</p>
              </div>

              {enquirySubmitted ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-[#0F172A]">Enquiry Dispatched</h4>
                  <p className="text-xs text-slate-500">Our reception desk will contact you via your provided phone number.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="mt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={enquiryName}
                        onChange={(e) => setEnquiryName(e.target.value)}
                        placeholder="e.g. Anand Swaroop"
                        className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={enquiryPhone}
                        onChange={(e) => setEnquiryPhone(e.target.value)}
                        placeholder="+91 98765 12345"
                        className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Enquiry Subject</label>
                    <select
                      value={enquirySubject}
                      onChange={(e) => setEnquirySubject(e.target.value)}
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-600"
                    >
                      <option value="General Healthcare Services">General Healthcare Services</option>
                      <option value="OPD Specialist Scheduling">OPD Specialist Scheduling</option>
                      <option value="AMMA Rural Clinic Outreach">AMMA Rural Clinic Outreach</option>
                      <option value="MNSRI Neuroscience Clinical Studies">MNSRI Neuroscience Clinical Studies</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Message (Optional)</label>
                    <textarea
                      rows={3}
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      placeholder="Enter details of your healthcare or research query..."
                      className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Enquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 11. SECTION 9: PROFESSIONAL FOOTER WITH QUICK LINKS AND POLICIES */}
      <footer className="bg-[#0F172A] text-white pt-12 pb-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
            {/* Col 1: Brand & Overview */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white tracking-tight">SBM HOSPITALS</span>
                  <span className="ml-1 text-[10px] px-1 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                    + MNSRI
                  </span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Maharajganj Neuroscience & Stroke Research Institute and SBM Tertiary Hospitals. Connecting community clinics to tertiary neurological excellence.
              </p>
              <div className="text-[11px] text-slate-500">
                Region: Maharajganj – Raebareli, Uttar Pradesh, India.
              </div>
            </div>

            {/* Col 2: Hospital Workspaces */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Hospital Operations
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><Link href="/clinic" className="hover:text-teal-400">AMMA Digital Clinic</Link></li>
                <li><Link href="/reception" className="hover:text-teal-400">Reception & Triage Queue</Link></li>
                <li><Link href="/doctor" className="hover:text-teal-400">Doctor Clinical EMR</Link></li>
                <li><Link href="/bed-board" className="hover:text-teal-400">Inpatient Bed Board</Link></li>
                <li><Link href="/patient-portal" className="hover:text-teal-400">Patient Demo Portal</Link></li>
              </ul>
            </div>

            {/* Col 3: Research & Admin */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Research & Governance
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><Link href="/research" className="hover:text-teal-400">MNSRI Neuroscience Overview</Link></li>
                <li><Link href="/research-portal" className="hover:text-teal-400">Research Milestones & Trials</Link></li>
                <li><Link href="/admin" className="hover:text-teal-400">Hospital Administration & KPIs</Link></li>
                <li><Link href="/admin/users" className="hover:text-teal-400">User Role Management (RBAC)</Link></li>
                <li><Link href="/admin/audit-logs" className="hover:text-teal-400">System Audit Trail</Link></li>
              </ul>
            </div>

            {/* Col 4: Public & Policies */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Information & Policies
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><Link href="/about" className="hover:text-teal-400">About SBM & MNSRI</Link></li>
                <li><Link href="/services" className="hover:text-teal-400">All Healthcare Services</Link></li>
                <li><Link href="/appointments" className="hover:text-teal-400">OPD Appointments</Link></li>
                <li><Link href="/contact" className="hover:text-teal-400">Contact & Location</Link></li>
                <li><Link href="/amma-clinic" className="hover:text-teal-400">Rural Outreach Network</Link></li>
              </ul>
            </div>
          </div>

          {/* Legal, Demo & Emergency Disclaimer */}
          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                © 2025 SBM Hospitals & Maharajganj Neuroscience & Stroke Research Institute (MNSRI). All rights reserved.
              </div>
              <div className="flex items-center space-x-4 text-slate-400">
                <span>Privacy Notice</span>
                <span>•</span>
                <span>Clinical Trial Guidelines</span>
                <span>•</span>
                <span>Demo Prototype</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Demonstration Notice:</strong> This software is a demonstration prototype designed to showcase integrated digital hospital and research workflows for SBM Hospitals and MNSRI. Sample patient profiles, clinical diagnosis codes, trial milestones, and emergency contact numbers are simulated demo content and must not be used for real autonomous medical diagnosis.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
