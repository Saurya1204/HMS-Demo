"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Patient, UrgencyLevel } from "@/types";
import { FastAssessmentGuide } from "@/components/FastAssessmentGuide";
import { QrBadgeModal } from "@/components/QrBadgeModal";
import {
  Stethoscope,
  Send,
  QrCode,
  Activity,
  HeartPulse,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  Building2,
  FileCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function AmmaClinicPage() {
  const { addToast, triggerGlobalRefresh, globalRefreshKey } = useApp();

  // Intake Form State
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [contact, setContact] = useState("");
  const [village, setVillage] = useState("Bachhrawan Sub-Center, Raebareli");
  const [bp, setBp] = useState("130/85");
  const [spo2, setSpo2] = useState<number | "">(97);
  const [pulse, setPulse] = useState<number | "">(82);
  const [temp, setTemp] = useState<number | "">(98.6);
  const [urgency, setUrgency] = useState<UrgencyLevel>("Routine");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // FAST Assessment State
  const [faceDroop, setFaceDroop] = useState(false);
  const [armWeakness, setArmWeakness] = useState(false);
  const [slurredSpeech, setSlurredSpeech] = useState(false);
  const [timeHours, setTimeHours] = useState(2.0);

  // Submissions & Modal
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPatient, setGeneratedPatient] = useState<Patient | null>(null);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  // Live sidebar list of AMMA clinic referrals
  const [clinicQueue, setClinicQueue] = useState<Patient[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);

  // Auto-elevate urgency if FAST criteria detected
  useEffect(() => {
    if (faceDroop || armWeakness || slurredSpeech) {
      setUrgency("Critical");
    }
  }, [faceDroop, armWeakness, slurredSpeech]);

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/referrals");
      const json = await res.json();
      if (json.success) {
        setClinicQueue(json.data || []);
      }
    } catch (e) {
      console.warn("Failed to fetch AMMA queue:", e);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [globalRefreshKey]);

  const symptomOptions = [
    "Sudden facial numbness/droop",
    "Unilateral arm/leg weakness",
    "Dysarthria / Slurred speech",
    "Loss of balance or severe vertigo",
    "Acute thunderclap headache",
    "Resting tremor / Parkinsonism",
  ];

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !contact) {
      addToast({
        title: "Missing Required Fields",
        description: "Please complete patient name, age, and contact number.",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        age: Number(age),
        gender,
        contact,
        village,
        urgency,
        vitals: {
          bp: bp || "120/80",
          spo2: Number(spo2) || 98,
          pulse: Number(pulse) || 75,
          temp: Number(temp) || 98.6,
        },
        symptoms: selectedSymptoms,
        fastAssessment: {
          faceDroop,
          armWeakness,
          slurredSpeech,
          timeToActHours: timeHours,
        },
        notes: notes || "Referred from AMMA Digital Clinic for tertiary stroke/neuro evaluation.",
      };

      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success && json.data) {
        setGeneratedPatient(json.data);
        setIsBadgeModalOpen(true);

        addToast({
          title: `Referral Transmitted to SBM Reception`,
          description: `Token ${json.data.tokenQr} created for ${json.data.name}. Reception desk notified.`,
          type: json.data.urgency === "Critical" ? "stroke-alert" : "success",
        });

        triggerGlobalRefresh();
        await fetchQueue();

        setName("");
        setAge("");
        setContact("");
        setSelectedSymptoms([]);
        setFaceDroop(false);
        setArmWeakness(false);
        setSlurredSpeech(false);
        setNotes("");
        setUrgency("Routine");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectSimulate = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: "Devendra Nath Pandey",
        age: 64,
        gender: "Male",
        contact: "+91 94512 89012",
        village: "Bachhrawan Rural, Raebareli",
        urgency: "Critical",
        vitals: {
          bp: "174/102",
          spo2: 94,
          pulse: 96,
          temp: 98.8,
        },
        symptoms: [
          "Sudden facial numbness/droop",
          "Unilateral arm/leg weakness",
          "Dysarthria / Slurred speech",
        ],
        fastAssessment: {
          faceDroop: true,
          armWeakness: true,
          slurredSpeech: true,
          timeToActHours: 1.5,
        },
        notes: "Acute stroke symptoms developed 90 mins ago while having breakfast. Urgent SBM CT & Thrombolysis requested.",
      };

      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setGeneratedPatient(json.data);
        setIsBadgeModalOpen(true);
        addToast({
          title: "Referral Sent to SBM Hospital",
          description: `Token ${json.data.tokenQr} created for Devendra Pandey. SBM Reception pre-alerted!`,
          type: "stroke-alert",
        });
        triggerGlobalRefresh();
        await fetchQueue();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Client Demo Banner (White card, Blue & Green accents) */}
      <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-lg shrink-0">
            1
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
                DEMO SCENARIO 1: RURAL INTAKE & REFERRAL
              </span>
              <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                Rural Center
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Rural Health Worker tests acute stroke in village Bachhrawan
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Staff enter vitals & stroke symptoms. One click generates a scannable QR badge and transmits the record to SBM Hospital before the ambulance arrives.
            </p>
          </div>
        </div>

        {/* 1-Click Presentation Trigger */}
        <button
          type="button"
          onClick={handleDirectSimulate}
          disabled={isSubmitting}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{isSubmitting ? "Sending..." : "⚡ 1-Click: Simulate Rural Referral"}</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            AMMA Digital Clinic Intake & Triage
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bachhrawan Sub-Center (Raebareli) • ANM Staff: Sunita Devi
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <form
            onSubmit={handleIntakeSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Patient Intake & Demographics
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Staff: Sunita Devi (ANM)
              </span>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rameshwar Pal"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Age (Yrs) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                  placeholder="62"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+91 94501 88219"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Village
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Bachhrawan, Raebareli"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Vitals */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center space-x-1">
                <HeartPulse className="w-4 h-4 text-blue-600" />
                <span>Recorded Vital Signs</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">BP (mmHg)</div>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="130/85"
                    className="w-full bg-transparent font-bold text-slate-900 font-mono mt-0.5 focus:outline-none"
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Pulse (bpm)</div>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value ? Number(e.target.value) : "")}
                    placeholder="82"
                    className="w-full bg-transparent font-bold text-blue-700 font-mono mt-0.5 focus:outline-none"
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">SpO2 (%)</div>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value ? Number(e.target.value) : "")}
                    placeholder="97"
                    className="w-full bg-transparent font-bold text-green-700 font-mono mt-0.5 focus:outline-none"
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Temp (°F)</div>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value ? Number(e.target.value) : "")}
                    placeholder="98.6"
                    className="w-full bg-transparent font-bold text-yellow-700 font-mono mt-0.5 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* FAST Stroke Screening Guide */}
            <div>
              <FastAssessmentGuide
                faceDroop={faceDroop}
                armWeakness={armWeakness}
                slurredSpeech={slurredSpeech}
                timeHours={timeHours}
                onToggleFace={() => setFaceDroop((prev) => !prev)}
                onToggleArm={() => setArmWeakness((prev) => !prev)}
                onToggleSpeech={() => setSlurredSpeech((prev) => !prev)}
                onChangeTime={setTimeHours}
              />
            </div>

            {/* Symptoms Checklist */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Symptoms Checklist
              </label>
              <div className="flex flex-wrap gap-1.5">
                {symptomOptions.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Triage Urgency
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(["Routine", "Urgent", "Critical"] as UrgencyLevel[]).map((level) => {
                  const isSelected = urgency === level;
                  let color = "bg-green-600 text-white";
                  if (level === "Urgent") color = "bg-yellow-500 text-slate-950 font-extrabold";
                  if (level === "Critical") color = "bg-red-600 text-white font-extrabold animate-pulse";

                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`p-2.5 rounded-xl border text-xs font-bold uppercase transition-all cursor-pointer text-center ${
                        isSelected
                          ? `${color} border-transparent shadow-xs`
                          : "border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      {level === "Critical" && "🚨 "}
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center space-x-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Transmitting..." : "Generate Token & Refer Patient"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Outbound Referrals Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Referrals Sent to Hospital ({clinicQueue.length})
                </h4>
              </div>
              <button
                type="button"
                onClick={fetchQueue}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                title="Refresh Queue"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoadingQueue ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Loading clinic referrals...
              </div>
            ) : clinicQueue.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No active referrals yet.
              </div>
            ) : (
              <div className="mt-3 space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
                {clinicQueue.map((pat) => {
                  const isCrit = pat.urgency === "Critical";
                  return (
                    <div
                      key={pat.id}
                      className={`p-3.5 rounded-xl border transition-all text-xs ${
                        isCrit
                          ? "bg-red-50/70 border-red-300 hover:border-red-400"
                          : "bg-slate-50 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                            <span>{pat.name}</span>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded-full ${
                                isCrit
                                  ? "bg-red-600 text-white font-extrabold"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {pat.urgency}
                            </span>
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {pat.age} Yrs • {pat.gender} • {pat.village}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setGeneratedPatient(pat);
                            setIsBadgeModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer shadow-xs"
                          title="View QR Token"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-600 border-t border-slate-200/60 pt-2">
                        <span className="font-bold text-blue-700">
                          {pat.tokenQr}
                        </span>
                        <span>
                          BP: {pat.vitals?.bp} | SpO2: {pat.vitals?.spo2}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Token Modal */}
      <QrBadgeModal
        patient={generatedPatient}
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />
    </div>
  );
}
