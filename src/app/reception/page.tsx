"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Patient, Bed, Appointment } from "@/types";
import { BedAssignModal } from "@/components/BedAssignModal";
import {
  ClipboardList,
  UserCheck,
  Building2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Plus,
  BedDouble,
  Stethoscope,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Search,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  Activity,
  Layers,
} from "lucide-react";

export default function ReceptionPage() {
  const {
    addToast,
    triggerGlobalRefresh,
    globalRefreshKey,
    currentUser,
    switchRole,
    kpis,
  } = useApp();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "inbound" | "appointments" | "queue" | "walkin"
  >("inbound");
  const [searchQuery, setSearchQuery] = useState("");
  const [queueFilter, setQueueFilter] = useState<string>("All");

  // Bed allocation modal state
  const [selectedBedToAssign, setSelectedBedToAssign] = useState<Bed | null>(
    null
  );
  const [isBedModalOpen, setIsBedModalOpen] = useState(false);

  // Walk-in form state
  const [walkinName, setWalkinName] = useState("");
  const [walkinAge, setWalkinAge] = useState<number | "">("");
  const [walkinGender, setWalkinGender] = useState<"Male" | "Female" | "Other">(
    "Male"
  );
  const [walkinContact, setWalkinContact] = useState("");
  const [walkinDept, setWalkinDept] = useState("Neurology & Stroke Unit");
  const [walkinSymptoms, setWalkinSymptoms] = useState(
    "Sudden headache and dizziness"
  );

  const fetchData = async () => {
    try {
      const [pRes, bRes, aRes] = await Promise.all([
        fetch("/api/patients"),
        fetch("/api/beds"),
        fetch("/api/appointments"),
      ]);
      const pJson = await pRes.json();
      const bJson = await bRes.json();
      const aJson = await aRes.json();

      if (pJson.success) setPatients(pJson.data || []);
      if (bJson.success) setBeds(bJson.data || []);
      if (aJson.success) setAppointments(aJson.data || []);
    } catch (e) {
      console.warn("Failed to fetch reception data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [globalRefreshKey]);

  // Inbound Referrals
  const inboundReferrals = patients.filter(
    (p) => p.source === "AMMA_Clinic" && p.status === "Referred_AMMA"
  );

  // Queue
  const activeQueue = patients.filter(
    (p) =>
      p.status === "Reception_Waiting" ||
      p.status === "In_Consultation" ||
      p.status === "Admitted_IPD" ||
      (p.source === "AMMA_Clinic" && p.status !== "Discharged")
  );

  const filteredQueue = activeQueue.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tokenQr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (queueFilter === "All") return true;
    if (queueFilter === "Waiting") return p.status === "Reception_Waiting";
    if (queueFilter === "In Consultation") return p.status === "In_Consultation";
    if (queueFilter === "Admitted") return p.status === "Admitted_IPD";
    return true;
  });

  // Action: Admit to OPD Queue
  const handleAdmitToOpd = async (patient: Patient) => {
    try {
      const res = await fetch("/api/patients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: patient.id,
          status: "Reception_Waiting",
          assignedDoctorName: "Dr. Priya Sharma",
        }),
      });
      const json = await res.json();
      if (json.success) {
        addToast({
          title: "Admitted to OPD Queue",
          description: `${patient.name} admitted to Dr. Priya Sharma's queue.`,
          type: "success",
        });
        triggerGlobalRefresh();
        await fetchData();
      }
    } catch {
      addToast({
        title: "Action Failed",
        description: "Could not update patient status.",
        type: "error",
      });
    }
  };

  // Action: Check in appointment
  const handleCheckInAppointment = async (apt: Appointment) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: apt.id,
          status: "Checked_In",
        }),
      });
      const json = await res.json();
      if (json.success) {
        // Also ensure patient exists in queue
        await fetch("/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: apt.patientName,
            age: apt.patientAge,
            gender: apt.patientGender,
            contact: apt.contact,
            source: "Direct",
            status: "Reception_Waiting",
            tokenQr: apt.tokenNumber,
            assignedDoctorName: apt.doctorName,
            symptoms: [apt.reason],
            notes: `Checked in from Appointment ${apt.tokenNumber}.`,
          }),
        });

        addToast({
          title: "Appointment Checked In",
          description: `${apt.patientName} moved to Live OPD Queue.`,
          type: "success",
        });
        triggerGlobalRefresh();
        await fetchData();
      }
    } catch {
      addToast({
        title: "Check-in Failed",
        description: "Could not check in appointment.",
        type: "error",
      });
    }
  };

  // Action: Fast-Track to Inpatient Bed
  const handleFastTrackIpd = (patient: Patient) => {
    const availableBed =
      beds.find((b) => b.wardName === "Stroke ICU" && b.status === "available") ||
      beds.find((b) => b.status === "available");

    if (availableBed) {
      setSelectedBedToAssign(availableBed);
      setIsBedModalOpen(true);
    } else {
      addToast({
        title: "No Available Beds",
        description:
          "All beds currently occupied in the ward grid. Please check Bed Board.",
        type: "warning",
      });
    }
  };

  // Submit direct walk-in registration
  const handleWalkinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName || !walkinAge || !walkinContact) return;

    try {
      const payload = {
        name: walkinName,
        age: Number(walkinAge),
        gender: walkinGender,
        contact: walkinContact,
        source: "Direct",
        urgency: "Routine",
        status: "Reception_Waiting",
        vitals: { bp: "124/80", spo2: 98, pulse: 74, temp: 98.4 },
        symptoms: [walkinSymptoms],
        notes: `Direct Walk-in registered at Central Reception for ${walkinDept}.`,
      };

      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        addToast({
          title: "Walk-In Registered Successfully",
          description: `${json.data.name} admitted to consultation queue with Token ${json.data.tokenQr}.`,
          type: "success",
        });
        setWalkinName("");
        setWalkinAge("");
        setWalkinContact("");
        setActiveTab("queue");
        triggerGlobalRefresh();
        await fetchData();
      }
    } catch {
      addToast({
        title: "Registration Failed",
        description: "Could not register walk-in patient.",
        type: "error",
      });
    }
  };

  const isReceptionAuthorized =
    currentUser.role === "receptionist" || currentUser.role === "admin";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Role-Based Access Banner */}
      {!isReceptionAuthorized ? (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold">Role Notification:</span> Currently viewing
              as <strong>{currentUser.name}</strong> ({currentUser.role}). Receptionist credentials manage this desk.
            </div>
          </div>
          <button
            type="button"
            onClick={() => switchRole("receptionist")}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
          >
            Switch to Rajesh Kumar (Receptionist)
          </button>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Authorized Access: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700">
            Central Reception Desk Active
          </span>
        </div>
      )}

      {/* Header and Live Counters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">
            Hospital Reception & Triage Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central Triage & Admission Desk • Incharge: Rajesh Kumar
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-teal-50 border border-teal-200 text-right">
            <div className="text-[10px] text-teal-800 uppercase font-mono font-bold">
              AMMA Inbound Waiting
            </div>
            <div className="text-lg font-bold text-teal-900 font-mono">
              {inboundReferrals.length} Patients
            </div>
          </div>

          <button
            type="button"
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-xs"
            title="Refresh reception data"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-teal-600" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* 5 Distinct Tabs as per Section 11 */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
            activeTab === "overview"
              ? "bg-teal-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("inbound")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeTab === "inbound"
              ? "bg-teal-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>Inbound Referrals</span>
          {inboundReferrals.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
              {inboundReferrals.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
            activeTab === "appointments"
              ? "bg-teal-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Appointments</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-700 font-mono font-bold">
            {appointments.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
            activeTab === "queue"
              ? "bg-teal-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <span>OPD Queue</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px] text-slate-700 font-mono font-bold">
            {activeQueue.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("walkin")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${
            activeTab === "walkin"
              ? "bg-teal-600 text-white shadow-xs"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Patient Registration</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                AMMA Referrals En Route
              </div>
              <div className="text-2xl font-extrabold text-teal-700 mt-1">
                {inboundReferrals.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Requires golden-hour triage
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Active OPD Queue
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {activeQueue.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Patients in consultation board
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Available Beds
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {beds.filter((b) => b.status === "available").length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Across 4 wards
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Today's Appointments
              </div>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1">
                {appointments.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Scheduled slots
              </div>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="p-6 rounded-3xl bg-teal-50 border border-teal-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Reception Fast-Track Actions
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Quickly process inbound acute stroke referrals or register walk-in patients.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab("inbound")}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
              >
                View {inboundReferrals.length} Inbound Referrals
              </button>
              <button
                onClick={() => setActiveTab("walkin")}
                className="px-4 py-2 rounded-xl bg-white border border-teal-300 text-teal-800 hover:bg-teal-100 text-xs font-bold"
              >
                + Register Walk-In
              </button>
              <Link
                href="/doctor"
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-bold"
              >
                Open Doctor EMR
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INBOUND REFERRALS FROM AMMA CLINIC */}
      {activeTab === "inbound" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <p>
              Displaying newly transmitted referrals from peripheral rural centers awaiting hospital admission.
            </p>
            <span className="font-mono font-bold text-teal-700">
              {inboundReferrals.length} Pending Arrival
            </span>
          </div>

          {inboundReferrals.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900">
                All Inbound Referrals Processed
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No pending referrals from AMMA Digital Clinics. Submissions from the AMMA module will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inboundReferrals.map((pat) => {
                const isCritical = pat.urgency === "Critical";
                return (
                  <div
                    key={pat.id}
                    className={`p-6 rounded-2xl border transition-all relative overflow-hidden bg-white ${
                      isCritical
                        ? "border-red-400 shadow-md ring-1 ring-red-400/30"
                        : "border-slate-200 shadow-xs hover:border-teal-300"
                    }`}
                  >
                    {isCritical && (
                      <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-300 flex items-center space-x-2 text-red-900 text-[11px] font-extrabold animate-pulse">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>CRITICAL CODE STROKE ALERT: Golden Hour Protocol Active</span>
                      </div>
                    )}

                    {/* Top strip with From AMMA Clinic badge */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                            From AMMA Clinic
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isCritical
                                ? "bg-red-600 text-white font-extrabold"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            }`}
                          >
                            {pat.urgency}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mt-2">
                          {pat.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {pat.age} Yrs • {pat.gender} • {pat.village}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                          {pat.tokenQr}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          {new Date(pat.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Vitals Grid */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono">BP</span>
                        <div
                          className={`font-bold font-mono ${
                            isCritical ? "text-red-600" : "text-slate-900"
                          }`}
                        >
                          {pat.vitals?.bp}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono">SpO2</span>
                        <div className="font-bold text-emerald-700 font-mono">
                          {pat.vitals?.spo2}%
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono">Pulse</span>
                        <div className="font-bold text-teal-700 font-mono">
                          {pat.vitals?.pulse}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-mono">Temp</span>
                        <div className="font-bold text-amber-800 font-mono">
                          {pat.vitals?.temp || 98.6}°
                        </div>
                      </div>
                    </div>

                    {/* Symptoms */}
                    <div className="mt-3">
                      <div className="text-[11px] text-slate-500 font-semibold">Symptoms:</div>
                      <div className="text-xs text-slate-700 mt-0.5 line-clamp-2">
                        {pat.symptoms.join(", ") || pat.notes}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
                      <button
                        type="button"
                        onClick={() => handleAdmitToOpd(pat)}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-all text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Admit to OPD Queue</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFastTrackIpd(pat)}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-red-500/20 cursor-pointer"
                      >
                        <BedDouble className="w-3.5 h-3.5" />
                        <span>Request IPD Admission</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: APPOINTMENTS */}
      {activeTab === "appointments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <p>Registered appointments awaiting check-in at reception.</p>
            <span className="font-bold text-teal-700">{appointments.length} Total</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Token & Patient</th>
                  <th className="py-3 px-4">Department & Doctor</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="font-mono text-[11px] text-teal-700">{apt.tokenNumber} • {apt.contact}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{apt.department}</div>
                      <div className="text-[11px] text-slate-500">{apt.doctorName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{apt.date}</div>
                      <div className="text-[11px] text-slate-500">{apt.slot}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {apt.reason}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          apt.status === "Checked_In"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-teal-100 text-teal-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {apt.status === "Scheduled" ? (
                        <button
                          onClick={() => handleCheckInAppointment(apt)}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                        >
                          Check In
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">Checked In</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: OPD QUEUE */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, token, MRN..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 shadow-xs"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center space-x-1">
              {["All", "Waiting", "In Consultation", "Admitted"].map((f) => (
                <button
                  key={f}
                  onClick={() => setQueueFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    queueFilter === f
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Patient & Token</th>
                    <th className="px-4 py-3">Source & Location</th>
                    <th className="px-4 py-3">Vitals</th>
                    <th className="px-4 py-3">Urgency</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Attending Staff</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQueue.map((pat) => {
                    let statusBadge = (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px]">
                        Waiting
                      </span>
                    );
                    if (pat.status === "In_Consultation") {
                      statusBadge = (
                        <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-bold text-[10px] animate-pulse">
                          In Consultation
                        </span>
                      );
                    } else if (pat.status === "Admitted_IPD") {
                      statusBadge = (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px]">
                          Admitted ({pat.assignedBedNumber || "IPD"})
                        </span>
                      );
                    }

                    return (
                      <tr key={pat.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900 text-sm">{pat.name}</div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {pat.tokenQr} • {pat.patientId}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                pat.source === "AMMA_Clinic"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : "bg-teal-100 text-teal-800 border-teal-200"
                              }`}
                            >
                              {pat.source === "AMMA_Clinic" ? "AMMA Clinic" : "Direct"}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            {pat.village || "Maharajganj Town"}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 font-mono text-[11px]">
                          <div className="font-bold text-slate-800">BP: {pat.vitals?.bp}</div>
                          <div className="text-slate-500">
                            SpO2: {pat.vitals?.spo2}% | P: {pat.vitals?.pulse}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              pat.urgency === "Critical"
                                ? "bg-red-600 text-white"
                                : pat.urgency === "Urgent"
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {pat.urgency}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">{statusBadge}</td>

                        <td className="px-4 py-3.5 text-slate-800 font-semibold">
                          {pat.assignedDoctorName || "Dr. Priya Sharma"}
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleFastTrackIpd(pat)}
                            className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 transition-colors text-xs font-bold cursor-pointer"
                          >
                            Assign Bed
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WALK-IN REGISTRATION FORM */}
      {activeTab === "walkin" && (
        <div className="max-w-xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <Plus className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">
              Direct Hospital Walk-In Registration
            </h3>
          </div>

          <form onSubmit={handleWalkinSubmit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                placeholder="e.g. Sitaram Verma"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  required
                  value={walkinAge}
                  onChange={(e) => setWalkinAge(e.target.value ? Number(e.target.value) : "")}
                  placeholder="54"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  value={walkinGender}
                  onChange={(e) => setWalkinGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={walkinContact}
                onChange={(e) => setWalkinContact(e.target.value)}
                placeholder="+91 91234 56789"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Admitting Department
              </label>
              <select
                value={walkinDept}
                onChange={(e) => setWalkinDept(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              >
                <option value="Neurology & Stroke Unit">Neurology & Stroke Unit</option>
                <option value="General Medicine">General Medicine</option>
                <option value="MNSRI Neuro-Rehab">MNSRI Neuro-Rehab Research</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Symptoms / Chief Complaints
              </label>
              <input
                type="text"
                value={walkinSymptoms}
                onChange={(e) => setWalkinSymptoms(e.target.value)}
                placeholder="Severe dizziness, limb weakness"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab("queue")}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-500/20"
              >
                Register & Admit to Queue
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bed Assignment Modal */}
      <BedAssignModal
        bed={selectedBedToAssign}
        isOpen={isBedModalOpen}
        onClose={() => setIsBedModalOpen(false)}
        unassignedPatients={patients.filter((p) => p.status !== "Admitted_IPD")}
        availableBeds={beds.filter((b) => b.status === "available")}
        onAssign={async (bedId, patientId, doctor, diagnosis) => {
          const res = await fetch(`/api/beds/${bedId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "assign",
              patientId,
              doctor,
              diagnosis,
            }),
          });
          const json = await res.json();
          if (json.success) {
            addToast({
              title: "Patient Admitted to Bed",
              description: json.message,
              type: "success",
            });
            triggerGlobalRefresh();
            await fetchData();
          }
        }}
        onDischarge={async () => {}}
        onTransfer={async () => {}}
        onStatusChange={async () => {}}
      />
    </div>
  );
}
