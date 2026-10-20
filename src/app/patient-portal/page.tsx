"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { QRCodeSVG } from "qrcode.react";
import {
  User,
  Calendar,
  FileText,
  Pill,
  HeartPulse,
  Activity,
  BedDouble,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Search,
  Download,
} from "lucide-react";
import { Patient, Encounter, Appointment, Bed } from "@/types";

export default function PatientPortalPage() {
  const { addToast } = useApp();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("pat-01");
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "prescriptions" | "vitals">("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [patRes, encRes, aptRes] = await Promise.all([
          fetch("/api/patients"),
          fetch("/api/encounters"),
          fetch("/api/appointments"),
        ]);
        const patJson = await patRes.json();
        const encJson = await encRes.json();
        const aptJson = await aptRes.json();

        if (patJson.success && patJson.data.length > 0) {
          setPatients(patJson.data);
          const current = patJson.data.find((p: any) => p.id === selectedPatientId) || patJson.data[0];
          setActivePatient(current);
          setSelectedPatientId(current.id);
        }

        if (encJson.success && encJson.data) {
          setEncounters(encJson.data);
        }

        if (aptJson.success && aptJson.data) {
          setAppointments(aptJson.data);
        }
      } catch (e) {
        console.warn("Failed to load patient portal data", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    const found = patients.find((p) => p.id === id);
    if (found) {
      setActivePatient(found);
      addToast({
        title: `Switched Patient View: ${found.name}`,
        description: `ID: ${found.patientId} • Age: ${found.age}y`,
        type: "info",
      });
    }
  };

  const patientEncounters = encounters.filter(
    (e) =>
      activePatient &&
      (e.patientId === activePatient.id || e.patientId === activePatient.patientId || e.patientName === activePatient.name)
  );

  const patientAppointments = appointments.filter(
    (a) =>
      activePatient &&
      (a.patientName.toLowerCase() === activePatient.name.toLowerCase() ||
        a.contact === activePatient.contact)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Secure Patient Portal & Digital Health Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome to Your SBM Health Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Access verified clinical encounter notes, active prescriptions, outpatient appointment slots, and scannable QR tokens.
          </p>
        </div>

        {/* Quick Demo Switcher */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          <div className="text-xs font-bold text-slate-600">Select Demo Patient:</div>
          <select
            value={selectedPatientId}
            onChange={(e) => handleSelectPatient(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.patientId}) - {p.age}y
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading || !activePatient ? (
        <div className="p-12 text-center text-slate-500">Loading patient profile...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Patient Profile & QR Badge */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              {/* Profile Card */}
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-teal-100 text-teal-700 font-extrabold text-2xl flex items-center justify-center border-2 border-teal-200 shadow-sm">
                  {activePatient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{activePatient.name}</h2>
                  <div className="font-mono text-xs font-bold text-teal-700 mt-0.5">
                    {activePatient.patientId}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {activePatient.age} Years • {activePatient.gender} • {activePatient.village || "Maharajganj"}
                  </div>
                </div>
              </div>

              {/* QR Token */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                <div className="p-3 bg-white rounded-xl shadow-xs inline-block border border-slate-200">
                  <QRCodeSVG
                    value={`https://sbmhospitals.in/patient/${activePatient.patientId}?token=${activePatient.tokenQr}`}
                    size={130}
                    level="M"
                  />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-slate-800">
                    {activePatient.tokenQr}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Scannable at Reception, OPD & Cath Lab
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Care Status:</span>
                  <span className="font-bold text-teal-700">{activePatient.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Source:</span>
                  <span className="font-bold text-slate-800">{activePatient.source}</span>
                </div>
                {activePatient.assignedWard && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Inpatient Ward:</span>
                    <span className="font-bold text-amber-700">
                      {activePatient.assignedWard} ({activePatient.assignedBedNumber})
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Link
                  href="/appointments"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book New OPD Visit</span>
                </Link>

                <button
                  onClick={() =>
                    addToast({
                      title: "Digital Health Summary Downloaded",
                      description: `Exported verified summary for ${activePatient.name}.`,
                      type: "success",
                    })
                  }
                  className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Records (PDF)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tabs Navigation */}
            <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
              {[
                { id: "overview", label: "Health Overview", icon: Activity },
                { id: "appointments", label: "Appointments", icon: Calendar },
                { id: "prescriptions", label: "Prescriptions & Rx", icon: Pill },
                { id: "vitals", label: "Recorded Vitals", icon: HeartPulse },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-teal-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Vitals Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">
                      Blood Pressure
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">
                      {activePatient.vitals.bp}
                    </div>
                    <div className="text-[10px] text-slate-400">mmHg</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">
                      Oxygen SpO2
                    </div>
                    <div className="text-xl font-extrabold text-teal-600 mt-1">
                      {activePatient.vitals.spo2}%
                    </div>
                    <div className="text-[10px] text-teal-700">Pulse Oximeter</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">
                      Pulse Rate
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">
                      {activePatient.vitals.pulse}
                    </div>
                    <div className="text-[10px] text-slate-400">BPM</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-[11px] text-slate-500 font-semibold uppercase">
                      Temperature
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 mt-1">
                      {activePatient.vitals.temp || 98.6}°F
                    </div>
                    <div className="text-[10px] text-slate-400">Oral/Axillary</div>
                  </div>
                </div>

                {/* Latest Clinical Encounter */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Latest Clinical Encounter Record
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      Attending: Dr. Priya Sharma
                    </span>
                  </div>

                  {patientEncounters.length > 0 ? (
                    patientEncounters.slice(0, 1).map((enc) => (
                      <div key={enc.id} className="space-y-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-1">
                          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide">
                            Primary Diagnosis
                          </span>
                          <div className="text-sm font-extrabold text-slate-900">
                            {enc.diagnosis}
                          </div>
                          {enc.icdCodes && enc.icdCodes.length > 0 && (
                            <div className="text-[11px] font-mono text-teal-700 font-semibold">
                              ICD: {enc.icdCodes.join(", ")}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-slate-700">Clinical Notes:</span>
                          <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                            {enc.clinicalNotes || "Routine neurological evaluation completed."}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1 text-xs">
                      <div className="font-bold text-slate-800">
                        Primary Reason: {activePatient.symptoms.join(", ") || "General Evaluation"}
                      </div>
                      <div className="text-slate-500">
                        {activePatient.notes || "No full encounter notes recorded yet. Pending OPD consultation."}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: APPOINTMENTS */}
            {activeTab === "appointments" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200">
                  Your OPD Appointments
                </h3>

                {patientAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {patientAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {apt.department}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-mono text-[10px] font-bold">
                              {apt.tokenNumber}
                            </span>
                          </div>
                          <div className="text-slate-500">
                            Consultant: {apt.doctorName}
                          </div>
                          <div className="text-slate-600 font-medium">
                            Date: {apt.date} at {apt.slot}
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-center">
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-3">
                    <p>No active scheduled appointments for this profile.</p>
                    <Link
                      href="/appointments"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book OPD Appointment</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PRESCRIPTIONS */}
            {activeTab === "prescriptions" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200">
                  Active Digital Prescriptions
                </h3>

                {patientEncounters.some((e) => e.prescriptions.length > 0) ? (
                  <div className="space-y-3">
                    {patientEncounters.flatMap((e) => e.prescriptions).map((rx, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
                            <Pill className="w-4 h-4 text-teal-600" />
                            <span>{rx.medicine}</span>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">
                            {rx.frequency}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600 text-[11px]">
                          <div>Dosage: <span className="font-bold text-slate-800">{rx.dosage}</span></div>
                          <div>Duration: <span className="font-bold text-slate-800">{rx.duration}</span></div>
                          <div>Instructions: <span className="font-bold text-slate-800">{rx.instructions || "After meals"}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No active prescriptions recorded yet for this encounter.
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: VITALS */}
            {activeTab === "vitals" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200">
                  Vitals & Stroke Triage History
                </h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Recorded Intake Vitals</span>
                    <span className="text-slate-500 text-[11px]">{new Date(activePatient.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                    <div>BP: <span className="font-bold">{activePatient.vitals.bp}</span></div>
                    <div>SpO2: <span className="font-bold">{activePatient.vitals.spo2}%</span></div>
                    <div>Pulse: <span className="font-bold">{activePatient.vitals.pulse} bpm</span></div>
                    <div>Temp: <span className="font-bold">{activePatient.vitals.temp || 98.6}°F</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
