"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { AiResearchExplorer } from "@/components/AiResearchExplorer";
import {
  Brain,
  FlaskConical,
  Award,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Users,
  Building2,
  FileText,
  AlertTriangle,
  Microscope,
  Calendar,
} from "lucide-react";

export default function PublicResearchPage() {
  const { switchRole } = useApp();

  const studies = [
    {
      code: "MNSRI-2025-01",
      title: "Neuroplasticity & Post-Stroke Motor Recovery Study",
      lead: "Dr. Arvind Verma, PhD (Director, MNSRI)",
      coLead: "Dr. Priya Sharma, MD (Neurology)",
      cohort: "120 Rural UP Patients (Sample Data)",
      status: "Cohort Enrollment Active",
      statusColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      desc: "Evaluating bilateral cortical excitability and motor restoration in acute ischaemic stroke survivors within 14 days of thrombolysis.",
      milestones: ["Ethics Approval (Done)", "Literature Synthesis (Done)", "Cohort Enrollment (Active)", "Lancet Submission (Drafted)"],
    },
    {
      code: "MNSRI-2025-02",
      title: "Rural Telestroke Thrombolysis Pathway Validation",
      lead: "Dr. Priya Sharma, MD",
      coLead: "Sunita Devi (ANM Outreach Lead)",
      cohort: "42 AMMA Digital Clinics",
      status: "Data Aggregation",
      statusColor: "bg-teal-100 text-teal-800 border-teal-200",
      desc: "Assessing golden-hour reduction and door-to-needle time improvements across peripheral health centers in Raebareli district.",
      milestones: ["Protocol Designed", "Tele-ECG Integrated", "Preliminary Findings"],
    },
    {
      code: "MNSRI-2024-04",
      title: "Cognitive Neuro-Rehabilitation & Motor Memory Restoration",
      lead: "Dr. Arvind Verma, PhD",
      coLead: "Rehabilitation Medicine Wing",
      cohort: "65 Outpatients",
      status: "Published",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      desc: "Longitudinal tracking of cognitive motor sequencing restoration following subcortical infarcts.",
      milestones: ["Full Analysis Complete", "Peer-Reviewed", "Published in AIAN"],
    },
  ];

  const publications = [
    {
      title: "Telestroke triage in rural Uttar Pradesh: Early observations from the AMMA clinic network",
      journal: "The Lancet Regional Health - Southeast Asia",
      status: "Under Review (Demo Draft)",
      authors: "Verma A., Sharma P., Sen A., Singh R.",
      year: "2025",
    },
    {
      title: "Motor cortex plasticity and early mobilising protocols following ischaemic stroke",
      journal: "Annals of Indian Academy of Neurology (AIAN)",
      status: "Published",
      authors: "Verma A., Sharma P.",
      year: "2024",
    },
    {
      title: "Decentralised point-of-care stroke screening tokens for rural referral systems",
      journal: "Journal of Stroke and Cerebrovascular Diseases",
      status: "Accepted Manuscript",
      authors: "Verma A., Devi S., Kumar R.",
      year: "2025",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#1E293B] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Breadcrumb & Intro */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <span>/</span>
            <span className="font-bold text-[#0F172A]">Neuroscience Research</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold mb-2">
                <Brain className="w-3.5 h-3.5" />
                <span>Maharajganj Neuroscience & Stroke Research Institute</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                Pioneering Neuroscience & Clinical Studies
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Dedicated to clinical trials, stroke biomarker research, and evidence-based neuro-rehabilitation protocols bridging rural Uttar Pradesh to global neuroscience.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  switchRole("researcher");
                  window.location.href = "/research-portal";
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 flex items-center space-x-2 transition-all cursor-pointer"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Open Internal Research Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Research Notice Banner */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong>Research tool only — Not for autonomous clinical diagnosis.</strong> All clinical trial protocols, participant cohorts, and sample publications represent synthetic demonstration data.
          </div>
        </div>

        {/* Institute Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Microscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Translational Clinical Trials</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              MNSRI investigates interventions directly at the bedside in SBM Stroke ICU and Neuro Recovery wards, accelerating therapeutic validation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Rural Epidemiology Cohort</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Leveraging data from 42 AMMA village clinics to identify regional risk factors, dietary correlations, and stroke epidemiology in rural UP.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Academic Dissemination</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Collaborating with national and international medical boards to publish open-access findings in peer-reviewed stroke journals.
            </p>
          </div>
        </div>

        {/* Clinical Studies Spotlight */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Active Research Initiatives & Clinical Studies</h2>
              <p className="text-xs text-slate-500 mt-0.5">Approved clinical trials conducted under MNSRI Institutional Ethics Committee</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              Demo Protocols
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studies.map((st, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {st.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.statusColor}`}>
                      {st.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A] leading-snug">{st.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{st.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <div>Principal Investigator: <strong className="text-slate-800">{st.lead}</strong></div>
                    <div>Target Cohort: <span className="font-semibold text-slate-700">{st.cohort}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/research-portal"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                  >
                    <span>View Milestones</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[10px] text-slate-400">Institutional Review #2024</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column: Publications Showcase + AI Literature Search Tool */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Publications List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Recent Publication Submissions & Pre-Prints</h2>
                <p className="text-xs text-slate-500">Peer-reviewed manuscripts from the MNSRI research group</p>
              </div>
            </div>

            <div className="space-y-3">
              {publications.map((pub, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#0F172A] leading-snug">{pub.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 shrink-0">
                      {pub.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {pub.authors} • <em>{pub.journal}</em> ({pub.year})
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between">
              <div>
                <strong className="block">Are you a researcher or faculty member?</strong>
                <span className="text-slate-600">Access full milestone management and manuscript submission drafts.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  switchRole("researcher");
                  window.location.href = "/research-portal";
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
              >
                Sign In as Researcher
              </button>
            </div>
          </div>

          {/* Public AI Research Explorer */}
          <div className="lg:col-span-5 space-y-4">
            <AiResearchExplorer />
          </div>
        </div>
      </div>
    </div>
  );
}
