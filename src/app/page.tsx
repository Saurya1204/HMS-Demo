"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  FileText,
  Ambulance,
  Microscope,
  Award,
  Layers,
  ShieldCheck,
  Zap,
  Radio,
  Play,
  Pause,
  RefreshCw,
  Heart,
  ChevronDown,
} from "lucide-react";
import { UserRole } from "@/types";

export default function HomePage() {
  const { kpis, switchRole, addToast, loginUser } = useApp();

  // ---------------- HERO CAROUSEL STATE ----------------
  const [heroSlide, setHeroSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // ---------------- SPECIALTIES CAROUSEL / FILTER ----------------
  const [specialtyPage, setSpecialtyPage] = useState(0);

  // ---------------- ROLE WORKSPACE FILTER ----------------
  const [workspaceFilter, setWorkspaceFilter] = useState<
    "all" | "clinical" | "rural" | "research" | "patient"
  >("all");

  // ---------------- LIVE AMMA OUTPOST ROTATOR ----------------
  const [activeOutpostIdx, setActiveOutpostIdx] = useState(0);

  // ---------------- CARE PATHWAYS INTERACTIVE TIMELINE ----------------
  const [activePathwayStep, setActivePathwayStep] = useState(0);

  // ---------------- RESEARCH TAB STATE ----------------
  const [activeResearchTab, setActiveResearchTab] = useState<
    "trial" | "manuscript" | "ai"
  >("trial");

  // Quick OPD Slot Booking State
  const [opdName, setOpdName] = useState("");
  const [opdContact, setOpdContact] = useState("");
  const [opdDept, setOpdDept] = useState("Neurology & Stroke");
  const [opdDate, setOpdDate] = useState("Tomorrow Morning, 10:00 AM");
  const [isSubmittingOpd, setIsSubmittingOpd] = useState(false);

  // Quick Enquiry Form State
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [enquirySubject, setEnquirySubject] = useState(
    "General Healthcare Services"
  );
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  // Auto-advance Hero Carousel every 6 seconds unless paused on hover
  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHeroPaused]);

  // Auto-rotate Live AMMA outposts every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOutpostIdx((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
          description: `Appointment token #${
            data.data?.tokenNumber || "APPT-101"
          } generated for ${opdName}.`,
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

  // ---------------- HERO SLIDES DATA ----------------
  const heroSlides = [
    {
      id: 0,
      badge: "Maharajganj – Raebareli, UP • Integrated Healthcare Platform Demo",
      tagline: "ADVANCED CLINICAL CARE & HYPERACUTE STROKE",
      title: "Advanced Clinical Care.",
      highlight: "Pioneering Neuroscience Research.",
      color: "text-teal-700",
      description:
        "“Connecting hospital services, community healthcare, and neuroscience research through one integrated digital platform.”",
      stats: [
        { label: "Stroke ICU & Wards", val: "150+ Beds" },
        { label: "Emergency Response", val: "24/7 Code Stroke" },
        { label: "Regional Outreach", val: "42 AMMA Clinics" },
      ],
      primaryCta: {
        label: "Book an Appointment",
        href: "/appointments",
        icon: Calendar,
      },
      secondaryCta: {
        label: "Explore Our Services",
        href: "/services",
        icon: Stethoscope,
      },
      tertiaryCta: {
        label: "Launch AMMA Demo",
        href: "/clinic",
        icon: Sparkles,
      },
      cards: [
        {
          title: "Bed Occupancy",
          val: `${kpis?.occupancyPercentage || 44}%`,
          sub: `${kpis?.availableBeds || 10} Beds Available`,
          footer: "Stroke ICU & Neuro Wards",
          icon: BedDouble,
          borderColor: "border-teal-200",
          textColor: "text-teal-800",
          iconColor: "text-teal-600",
          floatClass: "animate-float-1",
          livePill: "Telemetry Synchronized",
        },
        {
          title: "Critical Stroke Unit",
          val: `${kpis?.criticalPatients || 3}`,
          sub: "Active Golden Hour",
          footer: "Protocol Engaged",
          icon: HeartPulse,
          borderColor: "border-red-200",
          textColor: "text-red-600",
          iconColor: "text-red-600",
          floatClass: "animate-float-2",
          livePill: "Code Stroke 108",
        },
        {
          title: "AMMA Clinic Intake",
          val: `${kpis?.activeAmmaReferrals || 2}`,
          sub: "Inbound Referrals",
          footer: "42 Connected Clinics",
          icon: Activity,
          borderColor: "border-emerald-200",
          textColor: "text-emerald-800",
          iconColor: "text-emerald-600",
          floatClass: "animate-float-3",
          livePill: "Live Outposts",
        },
        {
          title: "MNSRI Research",
          val: `${kpis?.ongoingResearchProjects || 3}`,
          sub: "Active Clinical Trials",
          footer: "Lancet Paper In Review",
          icon: Brain,
          borderColor: "border-indigo-200",
          textColor: "text-indigo-800",
          iconColor: "text-indigo-600",
          floatClass: "animate-float-4",
          livePill: "Neuroplasticity",
        },
      ],
    },
    {
      id: 1,
      badge: "Rural Community Health Network • 42 Connected Village Outposts",
      tagline: "GRASSROOTS POINT-OF-CARE TELESTROKE",
      title: "AMMA Digital Rural Clinics.",
      highlight: "Grassroots Triage to Tertiary Care.",
      color: "text-emerald-700",
      description:
        "“Equipping Auxiliary Nurse Midwives with tablet-based FAST neurological screening, point-of-care vitals, and privacy-preserving QR referrals.”",
      stats: [
        { label: "Connected Outposts", val: "42 Villages" },
        { label: "Median Triage Time", val: "< 12 Mins" },
        { label: "Population Covered", val: "180,000+ Rural" },
      ],
      primaryCta: {
        label: "Launch AMMA Rural Intake",
        href: "/clinic",
        icon: Activity,
      },
      secondaryCta: {
        label: "View FAST Stroke Protocol",
        href: "/amma-clinic",
        icon: Sparkles,
      },
      tertiaryCta: {
        label: "Reception Triage Queue",
        href: "/reception",
        icon: Users,
      },
      cards: [
        {
          title: "Outpost Telemetry",
          val: "Mohanlalganj #03",
          sub: "FAST Positive (Arm + Speech)",
          footer: "Dispatched to Emergency Bay",
          icon: Activity,
          borderColor: "border-emerald-200",
          textColor: "text-emerald-800",
          iconColor: "text-emerald-600",
          floatClass: "animate-float-1",
          livePill: "Inbound Transit",
        },
        {
          title: "Offline-First Sync",
          val: "100%",
          sub: "Zero Patient Data Loss",
          footer: "Encrypted QR Token Handover",
          icon: ShieldCheck,
          borderColor: "border-teal-200",
          textColor: "text-teal-800",
          iconColor: "text-teal-600",
          floatClass: "animate-float-2",
          livePill: "Encrypted Token",
        },
        {
          title: "Transit Velocity",
          val: "26 Mins",
          sub: "Ambulance Golden Window",
          footer: "Regional Baseline: 74 Mins",
          icon: Ambulance,
          borderColor: "border-amber-200",
          textColor: "text-amber-800",
          iconColor: "text-amber-600",
          floatClass: "animate-float-3",
          livePill: "Rapid Transport",
        },
        {
          title: "Rural Lives Impacted",
          val: "1,420+",
          sub: "Screened in 6 Months",
          footer: "Hypertension & Stroke Care",
          icon: Heart,
          borderColor: "border-emerald-200",
          textColor: "text-emerald-800",
          iconColor: "text-emerald-600",
          floatClass: "animate-float-4",
          livePill: "Community Reach",
        },
      ],
    },
    {
      id: 2,
      badge: "Translational Medical Science • MNSRI Research Institute",
      tagline: "TRANSLATIONAL NEUROSCIENCE & PEER-REVIEWED TRIALS",
      title: "Pioneering Neuroplasticity.",
      highlight: "Frontline Trauma to Global Trials.",
      color: "text-indigo-700",
      description:
        "“Translating hyperacute stroke clinical encounters into peer-reviewed research, 5-phase clinical trial registries, and AI evidence synthesis.”",
      stats: [
        { label: "Active Clinical Trials", val: "3 Studies" },
        { label: "Lancet Manuscript", val: "In Review" },
        { label: "AI Evidence Corpus", val: "4,500+ Papers" },
      ],
      primaryCta: {
        label: "Open Research Portal",
        href: "/research-portal",
        icon: FlaskConical,
      },
      secondaryCta: {
        label: "Launch AI Research Explorer",
        href: "/research",
        icon: Brain,
      },
      tertiaryCta: {
        label: "Doctor EMR Console",
        href: "/doctor",
        icon: Stethoscope,
      },
      cards: [
        {
          title: "Trial NCT-2026-088",
          val: "94% Accrual",
          sub: "Phase II Neuroplasticity",
          footer: "128 / 150 Patients Enrolled",
          icon: FlaskConical,
          borderColor: "border-indigo-200",
          textColor: "text-indigo-800",
          iconColor: "text-indigo-600",
          floatClass: "animate-float-1",
          livePill: "Phase II Active",
        },
        {
          title: "Lancet Publication",
          val: "Draft V4.2",
          sub: "Under Peer Review",
          footer: "Regional Health Southeast Asia",
          icon: FileText,
          borderColor: "border-teal-200",
          textColor: "text-teal-800",
          iconColor: "text-teal-600",
          floatClass: "animate-float-2",
          livePill: "Manuscript",
        },
        {
          title: "AI Evidence Engine",
          val: "4,500+",
          sub: "Clinical Papers Indexed",
          footer: "Instant Semantic Search",
          icon: Brain,
          borderColor: "border-indigo-200",
          textColor: "text-indigo-800",
          iconColor: "text-indigo-600",
          floatClass: "animate-float-3",
          livePill: "Semantic AI",
        },
        {
          title: "Translational Triad",
          val: "Hospital + MNSRI",
          sub: "Rural Outreach Synchronized",
          footer: "Closed-Loop Healthcare Model",
          icon: Sparkles,
          borderColor: "border-amber-200",
          textColor: "text-amber-800",
          iconColor: "text-amber-600",
          floatClass: "animate-float-4",
          livePill: "Integrated Triad",
        },
      ],
    },
  ];

  const currentHero = heroSlides[heroSlide];

  // ---------------- LIVE TELEMETRY TICKER ITEMS ----------------
  const tickerItems = [
    {
      icon: Ambulance,
      tag: "CODE STROKE 108",
      color: "bg-red-500 text-white",
      text: "Ambulance dispatched to Shivgarh corridor with FAST-positive patient (ETA 8 mins)",
    },
    {
      icon: BedDouble,
      tag: "STROKE ICU",
      color: "bg-teal-500 text-white",
      text: "Bed #04 assigned to post-thrombolysis patient (Telemetry vitals streaming)",
    },
    {
      icon: Activity,
      tag: "AMMA CLINIC",
      color: "bg-emerald-500 text-white",
      text: "Outpost #03 (Mohanlalganj) generated referral AMMA-TK-8841 (Reception alerted)",
    },
    {
      icon: Brain,
      tag: "MNSRI TRIAL",
      color: "bg-indigo-500 text-white",
      text: "Neuroplasticity Phase-II Study reached 94% patient cohort milestone",
    },
    {
      icon: Zap,
      tag: "HYPERACUTE METRIC",
      color: "bg-amber-500 text-white",
      text: "Median Door-to-Needle time clocked at 34 minutes (National guideline: < 60 mins)",
    },
    {
      icon: Stethoscope,
      tag: "OPD CONSULTATION",
      color: "bg-teal-500 text-white",
      text: "Dr. Priya Sharma actively reviewing Digital EMR token #OPD-2026-04",
    },
  ];

  // ---------------- ROLE WORKSPACES DATA ----------------
  const roleWorkspaces = [
    {
      title: "Hospital Administrator",
      roleName: "Col. R. Singh (Retd.)",
      role: "admin" as const,
      category: "research",
      desc: "Comprehensive operational analytics, ward census, bed management, user RBAC, and immutable audit logs.",
      href: "/admin",
      icon: BarChart3,
      badge: "Administrator",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      statusPill: "Executive Command",
    },
    {
      title: "Doctor Clinical EMR",
      roleName: "Dr. Priya Sharma, MD",
      role: "doctor" as const,
      category: "clinical",
      desc: "Live clinical consultation queue, vitals chart, ICD-10 diagnostic coding, e-Prescriptions, and inpatient admission.",
      href: "/doctor",
      icon: Stethoscope,
      badge: "Attending Clinician",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
      statusPill: "Clinical EMR Active",
    },
    {
      title: "Reception & Triage Desk",
      roleName: "Rajesh Kumar",
      role: "receptionist" as const,
      category: "clinical",
      desc: "Inbound rural referrals from AMMA clinics, patient check-in, OPD token generation, and live triage queue.",
      href: "/reception",
      icon: Users,
      badge: "Hospital Reception",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
      statusPill: "Live Queue Terminal",
    },
    {
      title: "AMMA Digital Rural Clinic",
      roleName: "Sunita Devi (ANM)",
      role: "nurse" as const,
      category: "rural",
      desc: "Rural peripheral clinic intake, FAST stroke triage, vitals screening, and tertiary QR referral generation.",
      href: "/clinic",
      icon: Activity,
      badge: "Peripheral Health Worker",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      statusPill: "42 Village Outposts",
    },
    {
      title: "MNSRI Neuroscience Research",
      roleName: "Dr. Arvind Verma, PhD",
      role: "researcher" as const,
      category: "research",
      desc: "Neuroplasticity clinical study management, 5-phase milestone tracking, Lancet manuscript drafts, and AI research explorer.",
      href: "/research-portal",
      icon: FlaskConical,
      badge: "Research Director",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      statusPill: "3 Active Trials",
    },
    {
      title: "Patient & Family Portal",
      roleName: "Ramesh Patel (Patient)",
      role: "patient" as const,
      category: "patient",
      desc: "Access digital appointment tokens, visit summaries, prescribed medications, and doctor follow-up advice.",
      href: "/patient-portal",
      icon: HeartPulse,
      badge: "Patient Portal",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
      statusPill: "Patient Self-Service",
    },
  ];

  const filteredWorkspaces = roleWorkspaces.filter((ws) => {
    if (workspaceFilter === "all") return true;
    return ws.category === workspaceFilter;
  });

  // ---------------- CLINICAL SPECIALTIES DATA ----------------
  const keySpecialties = [
    {
      title: "Neurology & Acute Stroke Care",
      desc: "Dedicated 24/7 hyperacute stroke response unit with telestroke triage, rapid neuro-imaging, and acute clinical pathways.",
      icon: Brain,
      badge: "Tertiary Center",
      color: "border-teal-200 bg-teal-50/50",
      iconColor: "text-teal-700 bg-teal-100",
      metric: "Door-to-Needle < 40m",
    },
    {
      title: "Inpatient Bed & ICU Management",
      desc: "Specialized Stroke ICU, Neuro-Recovery Wards, and General Medical units with real-time telemetry bed tracking.",
      icon: BedDouble,
      badge: "150-Bed Capacity",
      color: "border-slate-200 bg-white",
      iconColor: "text-slate-800 bg-slate-100",
      metric: "100% Telemetry Monitored",
    },
    {
      title: "AMMA Digital Rural Outreach",
      desc: "Hub-and-spoke community clinic network connecting peripheral villages across Maharajganj and Raebareli.",
      icon: Activity,
      badge: "42 Village Outposts",
      color: "border-emerald-200 bg-emerald-50/50",
      iconColor: "text-emerald-700 bg-emerald-100",
      metric: "Encrypted QR Referrals",
    },
    {
      title: "Neuro-Rehabilitation & Recovery",
      desc: "Multi-disciplinary physical, speech, and cognitive rehabilitation tailored for post-stroke recovery and motor restoration.",
      icon: HeartPulse,
      badge: "MNSRI Integrated",
      color: "border-indigo-200 bg-indigo-50/50",
      iconColor: "text-indigo-700 bg-indigo-100",
      metric: "5-Phase Recovery Protocol",
    },
    {
      title: "24/7 Emergency & Code Stroke",
      desc: "Rapid-response emergency triage protocol coordinated with regional ambulance networks for immediate golden-hour care.",
      icon: Ambulance,
      badge: "24/7 Readiness",
      color: "border-red-200 bg-red-50/40",
      iconColor: "text-red-700 bg-red-100",
      metric: "108 Code Stroke Link",
    },
    {
      title: "Diagnostic Imaging & Labs",
      desc: "Comprehensive neuro-imaging, automated clinical biochemistry, and rapid microbiology testing for accurate diagnosis.",
      icon: Microscope,
      badge: "Advanced Diagnostics",
      color: "border-slate-200 bg-white",
      iconColor: "text-teal-700 bg-teal-100",
      metric: "30-Min Fast-Track CT",
    },
  ];

  // ---------------- AMMA LIVE OUTPOST FEEDS ----------------
  const ammaOutposts = [
    {
      name: "Mohanlalganj Outpost #03",
      location: "Mohanlalganj Sector",
      status: "Urgent Triage",
      statusColor: "bg-red-100 text-red-800 border-red-300",
      vitals: "BP: 162/98 • SpO2: 95% • Pulse: 92",
      fast: "Face droop + Left Arm Weakness",
      token: "AMMA-TK-8841",
      action: "Dispatched to Emergency Stroke Bay",
    },
    {
      name: "Bachhrawan Center #07",
      location: "Bachhrawan Highway",
      status: "Routine OPD",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      vitals: "BP: 130/84 • SpO2: 98% • Pulse: 76",
      fast: "FAST Negative (Chronic Migraine)",
      token: "AMMA-TK-8842",
      action: "Arrived at Central Reception Queue",
    },
    {
      name: "Shivgarh Sub-Center #12",
      location: "Shivgarh Rural Block",
      status: "Stroke Code",
      statusColor: "bg-red-100 text-red-800 border-red-300",
      vitals: "BP: 174/104 • SpO2: 94% • Pulse: 104",
      fast: "Slurred Speech + Dysarthria (Onset 90 min)",
      token: "AMMA-TK-8843",
      action: "Telestroke Telemetry Synchronized",
    },
    {
      name: "Dalmau River Outpost #18",
      location: "Dalmau Rural Outskirts",
      status: "Post-Stroke Check",
      statusColor: "bg-blue-100 text-blue-800 border-blue-300",
      vitals: "BP: 124/80 • SpO2: 99% • Pulse: 72",
      fast: "Motor Rehabilitation Assessment",
      token: "AMMA-TK-8844",
      action: "MNSRI Cohort Milestone Recorded",
    },
  ];

  // ---------------- CARE PATHWAYS DATA ----------------
  const carePathways = [
    {
      step: "01",
      title: "Community Intake",
      desc: "Patient visits rural AMMA Digital Clinic. Auxiliary Nurse Midwife (ANM) records vitals, conducts FAST assessment, and generates an encrypted scannable QR referral.",
      actor: "AMMA Clinic / Rural ANM",
      href: "/clinic",
      highlight: "Table-based FAST Triage in < 12 minutes",
      icon: Activity,
    },
    {
      step: "02",
      title: "Central Reception & Triage",
      desc: "Hospital reception scans referral QR code, confirms patient arrival, registers demographic file, and queues patient for OPD specialist without paperwork loss.",
      actor: "Central Reception Desk",
      href: "/reception",
      highlight: "Zero-wait referral token verification",
      icon: Users,
    },
    {
      step: "03",
      title: "Clinical Consultation & EMR",
      desc: "Attending neurologist reviews vitals, confirms ICD-10 diagnostic coding, issues e-Prescriptions, orders neuroimaging, and fast-tracks ICU bed allocation.",
      actor: "Doctor EMR Console",
      href: "/doctor",
      highlight: "1-Click digital prescription & admission",
      icon: Stethoscope,
    },
    {
      step: "04",
      title: "Inpatient Bed Allocation",
      desc: "Nurse or administrator allocates patient to available Stroke ICU or Neuro-Recovery bed with real-time status updates and telemetry sync.",
      actor: "Inpatient Bed Board",
      href: "/bed-board",
      highlight: "Dynamic ward census & occupancy meters",
      icon: BedDouble,
    },
    {
      step: "05",
      title: "Research & Rehabilitation",
      desc: "De-identified clinical data informs MNSRI neuroplasticity trials, recovery tracking, and peer-reviewed study milestones published in global journals.",
      actor: "MNSRI Research Portal",
      href: "/research-portal",
      highlight: "Translational research & Lancet studies",
      icon: FlaskConical,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#1E293B]">
      {/* ========================================================
          1. HERO CAROUSEL SECTION (Rich, Animated, Interactive)
         ======================================================== */}
      <section
        onMouseEnter={() => setIsHeroPaused(true)}
        onMouseLeave={() => setIsHeroPaused(false)}
        className="bg-white border-b border-slate-200 pt-8 pb-14 relative overflow-hidden transition-colors"
      >
        {/* Subtle decorative background gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Carousel Top Controls: Slide Pills & Auto-Play Status */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
              <span className="text-xs font-black tracking-wider uppercase text-slate-700">
                Pillars of SBM Hospitals & MNSRI
              </span>
              <span className="text-xs font-mono text-slate-400">
                (Slide {heroSlide + 1} of {heroSlides.length})
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Slide indicators / tabs */}
              <div className="flex items-center space-x-1.5">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setHeroSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      heroSlide === idx
                        ? "w-8 bg-teal-600"
                        : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    title={`Jump to Slide ${idx + 1}`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center space-x-1 pl-2">
                <button
                  onClick={() =>
                    setHeroSlide((prev) =>
                      prev === 0 ? heroSlides.length - 1 : prev - 1
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                  aria-label="Previous slide"
                  title="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setHeroSlide((prev) => (prev + 1) % heroSlides.length)
                  }
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors"
                  aria-label="Next slide"
                  title="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Pause / Play Indicator */}
              <button
                onClick={() => setIsHeroPaused(!isHeroPaused)}
                className="hidden sm:flex items-center space-x-1 text-[11px] font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 rounded bg-slate-50 border border-slate-200"
                title={isHeroPaused ? "Resume auto-rotation" : "Pause auto-rotation"}
              >
                {isHeroPaused ? (
                  <>
                    <Play className="w-3 h-3 text-teal-600" />
                    <span>Paused</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-slate-400" />
                    <span>Auto-Play</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Carousel Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headline, Supporting Text, CTAs */}
            <div className="lg:col-span-7 space-y-5 text-left animate-in fade-in duration-300">
              {/* Institutional Location Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                <span>{currentHero.badge}</span>
              </div>

              {/* Exact Required Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.12]">
                {currentHero.title}{" "}
                <span className={currentHero.color}>
                  {currentHero.highlight}
                </span>
              </h1>

              {/* Exact Required Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {currentHero.description}
              </p>

              {/* Key Quick Highlight Pills */}
              <div className="grid grid-cols-3 gap-2 py-1 max-w-xl">
                {currentHero.stats.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left"
                  >
                    <div className="text-xs font-bold text-slate-900 font-mono">
                      {s.val}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Required Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={currentHero.primaryCta.href}
                  className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md shadow-teal-600/20 flex items-center space-x-2 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <currentHero.primaryCta.icon className="w-4 h-4" />
                  <span>{currentHero.primaryCta.label}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href={currentHero.secondaryCta.href}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <currentHero.secondaryCta.icon className="w-4 h-4 text-teal-700" />
                  <span>{currentHero.secondaryCta.label}</span>
                </Link>

                <Link
                  href={currentHero.tertiaryCta.href}
                  className="px-4 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-sm flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <currentHero.tertiaryCta.icon className="w-4 h-4 text-emerald-600" />
                  <span>{currentHero.tertiaryCta.label}</span>
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

            {/* Right Column: Moving Dynamic Telemetry Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {currentHero.cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl bg-white border ${card.borderColor} shadow-xs hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-default ${card.floatClass}`}
                  >
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
                      <span className="truncate pr-1">{card.title}</span>
                      <Icon className={`w-4 h-4 ${card.iconColor} shrink-0`} />
                    </div>

                    <div
                      className={`text-2xl sm:text-3xl font-black mt-2 font-mono ${card.textColor}`}
                    >
                      {card.val}
                    </div>

                    <div className="text-xs font-bold text-slate-700 mt-1 truncate">
                      {card.sub}
                    </div>

                    <div className="text-[11px] text-slate-400 mt-1 truncate">
                      {card.footer}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-400">Status</span>
                      <span className="font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        {card.livePill}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. CONTINUOUS MOVING LIVE TELEMETRY TICKER (Marquee)
         ======================================================== */}
      <div className="bg-[#0F172A] text-white border-y border-slate-800 py-3 overflow-hidden shadow-inner relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          {/* Ticker Fixed Header Badge */}
          <div className="flex items-center space-x-2 bg-teal-600/90 text-white px-3 py-1 rounded-lg text-xs font-extrabold uppercase shrink-0 mr-4 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Live Telemetry</span>
          </div>

          {/* Marquee Track (Smooth Hardware Accelerated) */}
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-marquee whitespace-nowrap space-x-6 text-xs text-slate-200">
              {/* Loop items twice for seamless infinite continuous scroll */}
              {[...tickerItems, ...tickerItems].map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 cursor-pointer transition-colors"
                  >
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded ${item.color}`}
                    >
                      {item.tag}
                    </span>
                    <ItemIcon className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-slate-300 font-medium">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. ROLE-BASED WORKSPACES LAUNCHER (Interactive Filter Cards)
         ======================================================== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-3xl mx-auto">
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

          {/* Interactive Workspace Category Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-4">
            {(
              [
                { id: "all", label: "All Workspaces (6)" },
                { id: "clinical", label: "Clinical & Hospital (2)" },
                { id: "rural", label: "Rural AMMA Outreach (1)" },
                { id: "research", label: "Leadership & Research (2)" },
                { id: "patient", label: "Patient & Family (1)" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setWorkspaceFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  workspaceFilter === tab.id
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Moving Workspace Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredWorkspaces.map((ws, idx) => {
            const Icon = ws.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ws.badgeColor}`}
                      >
                        {ws.badge}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] group-hover:text-teal-700 transition-colors">
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

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Role Terminal:</span>
                    <span className="font-semibold text-slate-600">
                      {ws.statusPill}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
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
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          4. SECTION 1: INSTITUTIONAL & RESEARCH OVERVIEW
         ======================================================== */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Section 1 • Institutional Overview</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight leading-tight">
                SBM Hospitals & MNSRI: Serving Maharajganj & Raebareli
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Founded to bridge the critical gap between grassroots rural healthcare and advanced neurological intervention, <strong>SBM Hospitals</strong> operates as a state-of-the-art tertiary care center in southern Uttar Pradesh.
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Integrated directly on-campus, the <strong>Maharajganj Neuroscience & Stroke Research Institute (MNSRI)</strong> translates frontline clinical stroke encounters into pioneering neuroplasticity research, peer-reviewed clinical studies, and community health interventions.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F4F8FA] border border-slate-200">
                  <div className="text-2xl font-black text-[#0F172A] font-mono">
                    150+ Beds
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Stroke ICU & Wards
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F4F8FA] border border-slate-200">
                  <div className="text-2xl font-black text-teal-700 font-mono">
                    42 Clinics
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    AMMA Digital Outposts
                  </div>
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

            {/* Right Card: Institutional Triad Visual */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-[#0F172A] text-white space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    Pioneering Triad
                  </span>
                  <Award className="w-5 h-5 text-teal-400" />
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Hospital + Rural Clinics + Neuroscience Research
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Unlike conventional standalone hospitals, SBM Hospitals & MNSRI operates a closed-loop digital ecosystem where rural village screenings directly inform tertiary specialist care and clinical trials.
                </p>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center space-x-3 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Hyperacute Stroke Golden Hour:</strong> Rapid telestroke triage from village clinics to Stroke ICU.</span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Digital Identity & Tokenization:</strong> Opaque QR referral tokens protecting rural patient privacy.</span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Translational Science:</strong> Real-time clinical study milestones published in global journals.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SECTION 2: CLINICAL CAPABILITIES & SPECIALTIES
             (Interactive Moving Carousel / Grid)
         ======================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
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

          {/* Specialty Slider Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSpecialtyPage((prev) => Math.max(0, prev - 1))}
              disabled={specialtyPage === 0}
              className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 cursor-pointer transition-colors shadow-xs"
              aria-label="Previous specialties"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-600 px-2 font-mono">
              {specialtyPage + 1} / 2
            </span>
            <button
              onClick={() => setSpecialtyPage((prev) => Math.min(1, prev + 1))}
              disabled={specialtyPage === 1}
              className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 cursor-pointer transition-colors shadow-xs"
              aria-label="Next specialties"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Interactive Specialty Cards with Dynamic Hover Lifting */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keySpecialties
            .slice(specialtyPage * 3, specialtyPage * 3 + 3)
            .map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border ${spec.color} shadow-xs flex flex-col justify-between space-y-4 hover:shadow-xl hover:border-teal-400 transition-all duration-300 transform hover:-translate-y-1.5 group`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${spec.iconColor} group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                        {spec.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0F172A] group-hover:text-teal-700 transition-colors">
                        {spec.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {spec.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="text-[11px] font-bold text-teal-700">
                      {spec.metric}
                    </div>
                    <Link
                      href="/appointments"
                      onClick={() => setOpdDept(spec.title)}
                      className="text-xs font-bold text-slate-800 hover:text-teal-700 flex items-center space-x-1"
                    >
                      <span>Book Slot</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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

      {/* ========================================================
          6. SECTION 3: AMMA DIGITAL CLINIC & RURAL OUTREACH
             (With Interactive Moving Village Outpost Cards)
         ======================================================== */}
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
                <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#F4F8FA] border border-slate-200 hover:border-emerald-300 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">
                      Point-of-Care Vitals & FAST Stroke Screening
                    </h4>
                    <p className="text-slate-500 mt-0.5">
                      Capture Blood Pressure, Pulse, SpO2, and immediate Face-Arm-Speech indicators.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#F4F8FA] border border-slate-200 hover:border-teal-300 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">
                      Privacy-Preserving QR Referral Token
                    </h4>
                    <p className="text-slate-500 mt-0.5">
                      Generates an opaque scannable token with no raw sensitive medical data exposed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 rounded-xl bg-[#F4F8FA] border border-slate-200 hover:border-indigo-300 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A]">
                      Immediate Real-Time Transmission to Hospital Reception
                    </h4>
                    <p className="text-slate-500 mt-0.5">
                      SBM Reception and Emergency desk receive the inbound referral notification within milliseconds.
                    </p>
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

            {/* Right Card: Interactive Moving AMMA Village Outposts Feed */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-[#F4F8FA] border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Live Rural Outpost Telemetry
                    </span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    42 Outposts
                  </span>
                </div>

                {/* Moving Outpost Cards Rotator */}
                <div className="space-y-2.5 text-xs">
                  {ammaOutposts.map((outpost, idx) => {
                    const isActive = activeOutpostIdx === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveOutpostIdx(idx)}
                        className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20"
                            : "bg-white/80 border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-900">{outpost.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({outpost.location})
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${outpost.statusColor}`}
                          >
                            {outpost.status}
                          </span>
                        </div>

                        <div className="text-slate-600 font-mono text-[11px] mt-1.5">
                          {outpost.vitals}
                        </div>

                        <div className="text-[11px] text-slate-500 mt-1">
                          Assessment: <strong>{outpost.fast}</strong>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-teal-700 font-semibold font-mono">
                            {outpost.token}
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {outpost.action}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-[11px] text-slate-500 italic text-center pt-1">
                  *Click any outpost card above to inspect real-time rural vitals and referral telemetry.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. SECTION 4: OPD APPOINTMENT BOOKING FORM
         ======================================================== */}
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
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Quick OPD Slot Reservation
                  </h3>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  Instant Token
                </span>
              </div>

              <form onSubmit={handleQuickOpdBooking} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={opdName}
                      onChange={(e) => setOpdName(e.target.value)}
                      placeholder="e.g. Ram Charan Mishra"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Contact Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={opdContact}
                      onChange={(e) => setOpdContact(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Clinical Department
                    </label>
                    <select
                      value={opdDept}
                      onChange={(e) => setOpdDept(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="Neurology (Dr. Priya Sharma)">
                        Neurology (Dr. Priya Sharma)
                      </option>
                      <option value="Acute Stroke Intervention">
                        Acute Stroke Intervention
                      </option>
                      <option value="General Medicine & Vitals">
                        General Medicine & Vitals
                      </option>
                      <option value="Neuro-Rehabilitation">
                        Neuro-Rehabilitation
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Preferred Slot
                    </label>
                    <select
                      value={opdDate}
                      onChange={(e) => setOpdDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="Tomorrow Morning, 10:00 AM">
                        Tomorrow Morning, 10:00 AM
                      </option>
                      <option value="Tomorrow Morning, 11:30 AM">
                        Tomorrow Morning, 11:30 AM
                      </option>
                      <option value="Tomorrow Afternoon, 01:30 PM">
                        Tomorrow Afternoon, 01:30 PM
                      </option>
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

      {/* ========================================================
          8. SECTION 5: NEUROSCIENCE & STROKE RESEARCH (MNSRI)
             (With Interactive Study & Milestone Tabs)
         ======================================================== */}
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

            {/* Interactive Research Navigation Tabs */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setActiveResearchTab("trial")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeResearchTab === "trial"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Featured Clinical Trial (Phase II)
              </button>
              <button
                onClick={() => setActiveResearchTab("manuscript")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeResearchTab === "manuscript"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Lancet Neurology Publication Draft
              </button>
              <button
                onClick={() => setActiveResearchTab("ai")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeResearchTab === "ai"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                AI Research Evidence Explorer
              </button>
            </div>
          </div>

          {/* Mandatory Research Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="font-semibold">
              <strong>Research tool only — Not for autonomous clinical diagnosis.</strong> All clinical trial protocols and sample publications represent synthetic demonstration data.
            </div>
          </div>

          {/* Interactive Featured Study Container */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A] text-white space-y-6 shadow-xl">
            {activeResearchTab === "trial" && (
              <>
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
                      Target: 120 Cohort Patients (94% Accrued)
                    </span>
                  </div>
                </div>

                {/* 5-Phase Milestone Stepper with Animated Progress */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    <span>Clinical Study Milestone Tracker</span>
                    <span className="text-emerald-400 font-mono">Phase 3 in Progress</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {[
                      {
                        name: "1. Literature Review",
                        status: "Completed",
                        date: "Jan 2025",
                        color: "bg-emerald-500",
                        pct: 100,
                      },
                      {
                        name: "2. Ethics Clearance",
                        status: "Completed",
                        date: "Feb 2025",
                        color: "bg-emerald-500",
                        pct: 100,
                      },
                      {
                        name: "3. Patient Cohort",
                        status: "In Progress",
                        date: "Apr 2025",
                        color: "bg-indigo-500 animate-pulse",
                        pct: 94,
                      },
                      {
                        name: "4. Data Analysis",
                        status: "Upcoming",
                        date: "Jun 2025",
                        color: "bg-slate-700",
                        pct: 0,
                      },
                      {
                        name: "5. Peer Review",
                        status: "Upcoming",
                        date: "Aug 2025",
                        color: "bg-slate-700",
                        pct: 0,
                      },
                    ].map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs hover:border-indigo-400 transition-colors"
                      >
                        <div className="flex items-center space-x-1.5 mb-1.5">
                          <span className={`w-2 h-2 rounded-full ${m.color}`} />
                          <span className="font-bold text-white text-[11px] truncate">
                            {m.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{m.status}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {m.date}
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              m.pct === 100 ? "bg-emerald-500" : "bg-indigo-500"
                            }`}
                            style={{ width: `${m.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeResearchTab === "manuscript" && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Lead Publication Under Review
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  “Telestroke-facilitated motor restoration in rural tertiary settings: A closed-loop cohort study across Maharajganj & Raebareli”
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Submitted to <strong>The Lancet Regional Health — Southeast Asia</strong>. Co-authored by Dr. Arvind Verma and Dr. Priya Sharma. The manuscript details how point-of-care FAST screening reduces median door-to-needle time from 74 mins to 34 mins.
                </p>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Target Publication: Q3 2026 • Citation Format: Lancet Reg Health Southeast Asia</span>
                  <span className="text-emerald-400 font-bold">Manuscript Draft Verified</span>
                </div>
              </div>
            )}

            {activeResearchTab === "ai" && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  MNSRI AI Evidence Synthesizer
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Interactive Neuroscience Literature Corpus
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Our embedded AI synthesizer scans 4,500+ indexed PubMed trials on acute ischemic stroke, mechanical thrombectomy, and citicoline neuroprotection to synthesize evidence summaries in seconds.
                </p>
                <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between">
                  <span>Try typing “citicoline neuroplasticity” or “door-to-needle thrombolysis” in the portal</span>
                  <Link
                    href="/research-portal"
                    className="text-white font-bold underline"
                  >
                    Launch Interactive AI Tool ➔
                  </Link>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Latest study milestone: <em>Patient cohort recruitment at 94% target</em> (128 of 150 patients enrolled).
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/research-portal"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md"
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

      {/* ========================================================
          9. SECTION 6: INTEGRATED 5-STEP CARE PATHWAY
             (Interactive Step Timeline & Spotlight Card)
         ======================================================== */}
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
            Click any step below to see how rural outreach, reception, doctor encounters, bed allocation, and research unify seamlessly.
          </p>
        </div>

        {/* Interactive Step Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {carePathways.map((path, idx) => {
            const isActive = activePathwayStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActivePathwayStep(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-teal-600 text-white border-teal-600 shadow-lg scale-[1.03]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-teal-300"
                }`}
              >
                <div
                  className={`text-xs font-black font-mono mb-1 ${
                    isActive ? "text-teal-200" : "text-teal-700"
                  }`}
                >
                  STEP {path.step}
                </div>
                <div className="font-bold text-xs truncate">{path.title}</div>
                <div
                  className={`text-[10px] mt-1 truncate ${
                    isActive ? "text-teal-100" : "text-slate-400"
                  }`}
                >
                  {path.actor}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pathway Spotlight Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-teal-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in duration-200">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono">
                STAGE {carePathways[activePathwayStep].step}
              </span>
              <span className="text-xs font-bold text-slate-400">•</span>
              <span className="text-xs font-bold text-teal-700">
                {carePathways[activePathwayStep].actor}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#0F172A]">
              {carePathways[activePathwayStep].title}
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {carePathways[activePathwayStep].desc}
            </p>

            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{carePathways[activePathwayStep].highlight}</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-2">
            <Link
              href={carePathways[activePathwayStep].href}
              className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <span>Launch Step Simulation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-[10px] text-slate-400">
              Interactive workspace ready
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          10. SECTION 7: PATIENT & COMMUNITY BENEFITS
         ======================================================== */}
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
            <div className="p-6 rounded-2xl bg-[#F4F8FA] border border-slate-200 space-y-3 hover:border-teal-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Golden-Hour Stroke Access
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rural patients receive immediate neurological triage at local AMMA outposts, eliminating critical transport delays and saving brain tissue.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F8FA] border border-slate-200 space-y-3 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Zero-Paperwork Referrals
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Digital QR tokens eliminate lost medical files and repeated doctor explanations. Patients arrive at tertiary reception pre-triaged.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F4F8FA] border border-slate-200 space-y-3 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Global Science Access
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Patients have voluntary access to state-of-the-art neuroplasticity rehabilitation protocols developed by MNSRI in academic partnership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          11. SECTION 8: CONTACT AND LOCATION INFORMATION
         ======================================================== */}
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
              Located centrally between Maharajganj and Raebareli, our integrated tertiary campus provides around-the-clock emergency care and specialized stroke intervention.
            </p>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-200">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Hospital Campus:</strong>
                  <span>NH-330A, Maharajganj – Raebareli Road, Uttar Pradesh, 229306</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-200">
                <PhoneCall className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">Hospital Telephone:</strong>
                  <span>Emergency Line: 108 • Reception: +91 535 220 4400</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md">
              <h3 className="text-base font-bold text-[#0F172A] pb-3 border-b border-slate-200">
                Send a General Inquiry / Feedback
              </h3>

              {enquirySubmitted ? (
                <div className="p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">
                    Message Dispatched Successfully
                  </h4>
                  <p className="text-xs text-slate-500">
                    Our administrative team will respond to your registered contact number.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      placeholder="Your Name *"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="tel"
                      required
                      value={enquiryPhone}
                      onChange={(e) => setEnquiryPhone(e.target.value)}
                      placeholder="Your Phone Number *"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <select
                    value={enquirySubject}
                    onChange={(e) => setEnquirySubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="General Healthcare Services">
                      General Healthcare Services
                    </option>
                    <option value="AMMA Rural Clinic Outreach">
                      AMMA Rural Clinic Outreach
                    </option>
                    <option value="MNSRI Neuroscience Clinical Trials">
                      MNSRI Neuroscience Clinical Trials
                    </option>
                    <option value="Inpatient Admission & Ward Census">
                      Inpatient Admission & Ward Census
                    </option>
                  </select>

                  <textarea
                    rows={3}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="Briefly state your query or institutional feedback..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Demo Enquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          12. COMPREHENSIVE FOOTER
         ======================================================== */}
      <footer className="bg-[#0F172A] text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-sm text-white">
                SBM HOSPITALS + MNSRI
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Maharajganj Neuroscience & Stroke Research Institute. Bridging community clinic triage with hyperacute clinical care and translational medical research.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">
              Quick Navigation
            </div>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <Link href="/" className="hover:text-white">
                  Hospital Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Clinical Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Institution
                </Link>
              </li>
              <li>
                <Link href="/amma-clinic" className="hover:text-white">
                  AMMA Digital Clinics
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-white">
                  MNSRI Research
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">
              Interactive Workspaces
            </div>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <Link href="/clinic" className="hover:text-white">
                  AMMA Peripheral Clinic Intake
                </Link>
              </li>
              <li>
                <Link href="/reception" className="hover:text-white">
                  Reception & OPD Triage
                </Link>
              </li>
              <li>
                <Link href="/doctor" className="hover:text-white">
                  Doctor Clinical EMR
                </Link>
              </li>
              <li>
                <Link href="/bed-board" className="hover:text-white">
                  Inpatient Bed Census
                </Link>
              </li>
              <li>
                <Link href="/research-portal" className="hover:text-white">
                  Neuroscience Research Trials
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white">
                  Administrative Ledger
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="font-bold text-white text-xs uppercase tracking-wider">
              Emergency & Campus
            </div>
            <p className="text-slate-400 text-[11px]">
              Emergency Stroke Unit: <strong>Dial 108</strong> (Simulated)
            </p>
            <p className="text-slate-400 text-[11px]">
              NH-330A, Maharajganj – Raebareli Road, Uttar Pradesh, 229306
            </p>
            <div className="pt-2 text-[10px] text-slate-500">
              © {new Date().getFullYear()} SBM Hospitals & MNSRI. All rights reserved. Client demonstration prototype.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
