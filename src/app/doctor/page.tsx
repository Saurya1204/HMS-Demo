"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Patient, Bed, PrescriptionItem } from "@/types";
import { BedAssignModal } from "@/components/BedAssignModal";
import {
  FileText,
  Stethoscope,
  Activity,
  HeartPulse,
  Pill,
  Plus,
  Trash2,
  CheckCircle2,
  BedDouble,
  Clock,
  AlertTriangle,
  User,
  FlaskConical,
  ChevronDown,
  Printer,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export default function DoctorChartPage() {
  const { addToast, triggerGlobalRefresh, globalRefreshKey, currentUser, switchRole } = useApp();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Encounter form state
  const [diagnosis, setDiagnosis] = useState("Acute Ischemic Infarction (MCA Territory)");
  const [selectedIcdCodes, setSelectedIcdCodes] = useState<string[]>([
    "I63.9 - Cerebral infarction, unspecified",
  ]);
  const [clinicalNotes, setClinicalNotes] = useState(
    "Patient presents with sudden right-sided hemiparesis and dysarthria. Onset within 3 hours. NIHSS score: 12. Fast-tracked for emergency neuroimaging and potential IV thrombolysis."
  );
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      medicine: "Aspirin 75mg + Clopidogrel 75mg",
      dosage: "1 tablet",
      frequency: "OD",
      duration: "30 days",
      instructions: "Take post meal",
    },
    {
      medicine: "Atorvastatin 40mg",
      dosage: "1 tablet",
      frequency: "OD",
      duration: "30 days",
      instructions: "At bedtime",
    },
    {
      medicine: "Citicoline 500mg",
      dosage: "1 tablet",
      frequency: "BD",
      duration: "15 days",
      instructions: "Neuroprotective adjunct",
    },
  ]);

  // New prescription inputs
  const [newMed, setNewMed] = useState("");
  const [newDose, setNewDose] = useState("1 tab");
  const [newFreq, setNewFreq] = useState("OD");
  const [newDur, setNewDur] = useState("14 days");

  // Lab orders
  const [selectedLabs, setSelectedLabs] = useState<string[]>([
    "NCCT Brain Plain (Emergency)",
    "MRI Brain + DWI Sequence",
    "Carotid & Vertebral Doppler",
    "Serum Electrolytes & Renal Panel",
  ]);

  // Bed selector modal state
  const [isBedModalOpen, setIsBedModalOpen] = useState(false);
  const [selectedBedToAssign, setSelectedBedToAssign] = useState<Bed | null>(null);

  const icdLibrary = [
    { code: "I63.9", label: "I63.9 - Cerebral infarction, unspecified" },
    { code: "G45.9", label: "G45.9 - Transient cerebral ischemic attack (TIA)" },
    { code: "I10", label: "I10 - Essential (primary) hypertension" },
    { code: "G20", label: "G20 - Parkinson's disease" },
    { code: "G40.9", label: "G40.9 - Epilepsy, unspecified" },
    { code: "G43.9", label: "G43.9 - Migraine with aura" },
    { code: "R55", label: "R55 - Syncope and collapse" },
    { code: "E11.9", label: "E11.9 - Type 2 diabetes mellitus" },
  ];

  const labLibrary = [
    "NCCT Brain Plain (Emergency)",
    "MRI Brain + DWI Sequence",
    "Carotid & Vertebral Doppler",
    "Cardiac Troponin I",
    "Serum Electrolytes & Renal Panel",
    "Lipid Profile & HbA1c",
    "Complete Hemogram & Platelet Count",
    "Prothrombin Time (PT / INR)",
  ];

  const fetchData = async () => {
    try {
      const [pRes, bRes] = await Promise.all([
        fetch("/api/patients"),
        fetch("/api/beds"),
      ]);
      const pJson = await pRes.json();
      const bJson = await bRes.json();

      if (pJson.success && pJson.data) {
        setPatients(pJson.data);
        if (!selectedPatientId && pJson.data.length > 0) {
          const waiting = pJson.data.find(
            (p: Patient) =>
              p.status === "Reception_Waiting" || p.status === "In_Consultation"
          );
          setSelectedPatientId(waiting ? waiting.id : pJson.data[0].id);
        }
      }
      if (bJson.success && bJson.data) {
        setBeds(bJson.data);
      }
    } catch (e) {
      console.warn("Failed to fetch doctor chart data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [globalRefreshKey]);

  const activePatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleToggleIcd = (label: string) => {
    setSelectedIcdCodes((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  const handleToggleLab = (lab: string) => {
    setSelectedLabs((prev) =>
      prev.includes(lab) ? prev.filter((l) => l !== lab) : [...prev, lab]
    );
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.trim()) return;
    setPrescriptions((prev) => [
      ...prev,
      {
        medicine: newMed,
        dosage: newDose,
        frequency: newFreq,
        duration: newDur,
        instructions: "Take post meals with warm water",
      },
    ]);
    setNewMed("");
  };

  const handleRemovePrescription = (index: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveEncounter = async () => {
    if (!activePatient) return;
    try {
      const payload = {
        patientId: activePatient.id,
        patientName: activePatient.name,
        doctorId: "usr-01",
        doctorName: "Dr. Priya Sharma",
        type: "OPD",
        status: "Completed",
        vitals: activePatient.vitals,
        diagnosis,
        icdCodes: selectedIcdCodes,
        prescriptions,
        labOrders: selectedLabs,
        clinicalNotes,
      };

      const res = await fetch("/api/encounters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        addToast({
          title: "Clinical Encounter Saved",
          description: `Medical chart and ${prescriptions.length} prescriptions issued for ${activePatient.name}.`,
          type: "success",
        });
        triggerGlobalRefresh();
      }
    } catch {
      addToast({
        title: "Encounter Error",
        description: "Could not save clinical encounter.",
        type: "error",
      });
    }
  };

  const handleOpenBedAdmission = () => {
    const preferredBed =
      beds.find(
        (b) =>
          b.wardName === (activePatient?.urgency === "Critical" ? "Stroke ICU" : "Neuro Recovery") &&
          b.status === "available"
      ) || beds.find((b) => b.status === "available");

    if (preferredBed) {
      setSelectedBedToAssign(preferredBed);
      setIsBedModalOpen(true);
    } else {
      addToast({
        title: "No Available Beds",
        description: "All beds currently occupied in the ward grid. Please discharge or transfer an inpatient.",
        type: "warning",
      });
    }
  };

  const isDoctorAuthorized =
    currentUser.role === "doctor" || currentUser.role === "admin";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Role-Based Access Banner */}
      {!isDoctorAuthorized ? (
        <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-yellow-900 shadow-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-yellow-700 shrink-0" />
            <div>
              <span className="font-bold">Role Notification:</span> Currently viewing as{" "}
              <strong>{currentUser.name}</strong> ({currentUser.role}). Doctor credentials manage patient charts.
            </div>
          </div>
          <button
            type="button"
            onClick={() => switchRole("doctor")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
          >
            Switch to Dr. Priya Sharma (Doctor)
          </button>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between text-xs text-green-900">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>
              Authorized Access: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()} • {currentUser.department})
            </span>
          </div>
          <span className="text-[11px] font-semibold text-green-700">Digital EMR Terminal Active</span>
        </div>
      )}

      {/* Demo Scenario Explainer Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
            3
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 font-mono">
                DEMO SCENARIO 3: SPECIALIST DOCTOR CONSULTATION & EMR
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                Clinical Workflow
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Dr. Priya Sharma evaluates FAST stroke telemetry, issues Rx, and orders ICU admission
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
              Full diagnostic workspace with ICD-10 codification, pre-filled rural clinic vitals, emergency neuroimaging orders, and direct inpatient bed allocation.
            </p>
          </div>
        </div>

        {/* 1-Click Presentation Action */}
        <button
          type="button"
          onClick={async () => {
            await handleSaveEncounter();
            handleOpenBedAdmission();
          }}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>⚡ 1-Click: Save Rx & Admit to ICU Bed</span>
        </button>
      </div>

      {/* Patient Selector and Header */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Doctor EMR Consultation Desk
            </h1>
            <p className="text-xs text-slate-500">
              Attending Neurologist: Dr. Priya Sharma, MD (AIIMS)
            </p>
          </div>
        </div>

        {/* Patient Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-600">Select Patient:</label>
          <div className="relative">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.urgency} • {p.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Patient Details Banner */}
      {activePatient && (
        <div
          className={`p-5 rounded-2xl border transition-all ${
            activePatient.urgency === "Critical"
              ? "bg-red-50 border-red-300"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          {activePatient.urgency === "Critical" && (
            <div className="mb-3 p-2 rounded-lg bg-red-100 border border-red-300 flex items-center space-x-2 text-red-900 text-xs font-extrabold animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                CRITICAL STROKE ALERT: Onset &lt; 3.0 Hours. FAST Screening positive. Golden hour neuro-protection protocol active.
              </span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black text-slate-900">
                  {activePatient.name}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  MRN: {activePatient.patientId}
                </span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    activePatient.urgency === "Critical"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  }`}
                >
                  {activePatient.urgency}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {activePatient.age} Yrs • {activePatient.gender} • Village: {activePatient.village || "Raebareli"} • Token: {activePatient.tokenQr}
              </p>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[9px] text-slate-400 font-mono uppercase">BP</span>
                <div className={`font-bold font-mono ${activePatient.urgency === "Critical" ? "text-red-600" : "text-slate-900"}`}>
                  {activePatient.vitals?.bp}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[9px] text-slate-400 font-mono uppercase">SpO2</span>
                <div className="font-bold text-green-700 font-mono">
                  {activePatient.vitals?.spo2}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[9px] text-slate-400 font-mono uppercase">Pulse</span>
                <div className="font-bold text-blue-700 font-mono">
                  {activePatient.vitals?.pulse}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <span className="text-[9px] text-slate-400 font-mono uppercase">Temp</span>
                <div className="font-bold text-yellow-800 font-mono">
                  {activePatient.vitals?.temp || 98.6}°F
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2-Column EMR Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Diagnosis & Notes */}
        <div className="lg:col-span-6 space-y-6">
          {/* Primary Diagnosis */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Activity className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Primary Diagnosis & ICD-10 Classification
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clinical Diagnosis
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select ICD-10 Diagnostic Codes
              </label>
              <div className="flex flex-wrap gap-1.5">
                {icdLibrary.map((item) => {
                  const isChecked = selectedIcdCodes.includes(item.label);
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleToggleIcd(item.label)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                        isChecked
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {item.code}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Clinical Examination Notes */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Neurological Examination & Notes
              </h3>
            </div>

            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white leading-relaxed"
            />
          </div>

          {/* Diagnostic Orders */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <FlaskConical className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Emergency Diagnostic & Imaging Orders
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {labLibrary.map((lab) => {
                const isSelected = selectedLabs.includes(lab);
                return (
                  <button
                    key={lab}
                    type="button"
                    onClick={() => handleToggleLab(lab)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-blue-400 text-blue-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-[11px]">{lab}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Digital Prescriptions & Inpatient Admission */}
        <div className="lg:col-span-6 space-y-6">
          {/* Digital Prescription Table */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Pill className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Digital Prescription Items ({prescriptions.length})
                </h3>
              </div>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                e-Pharmacy Active
              </span>
            </div>

            <div className="space-y-2">
              {prescriptions.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{p.medicine}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Dose: {p.dosage} • Freq: {p.frequency} • Dur: {p.duration} ({p.instructions})
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePrescription(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Prescription Row */}
            <form onSubmit={handleAddPrescription} className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="font-bold text-slate-700">Add New Medication:</div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g. Mannitol 20%)"
                  value={newMed}
                  onChange={(e) => setNewMed(e.target.value)}
                  className="sm:col-span-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <input
                  type="text"
                  placeholder="Dose"
                  value={newDose}
                  onChange={(e) => setNewDose(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Rx</span>
                </button>
              </div>
            </form>
          </div>

          {/* Inpatient Admission & Bed Allocation Action */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <BedDouble className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Inpatient Admission & Bed Allocation
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              If the patient requires urgent hemodynamic monitoring, IV thrombolysis, or post-stroke neuro-recovery, assign an inpatient bed immediately.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenBedAdmission}
                className="flex-1 py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <BedDouble className="w-4 h-4" />
                <span>Admit to Stroke ICU / Ward Bed</span>
              </button>

              <button
                type="button"
                onClick={handleSaveEncounter}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Encounter & Rx</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bed Assignment Modal */}
      <BedAssignModal
        bed={selectedBedToAssign}
        isOpen={isBedModalOpen}
        onClose={() => setIsBedModalOpen(false)}
        unassignedPatients={patients.filter((p) => p.status !== "Admitted_IPD")}
        availableBeds={beds.filter((b) => b.status === "available")}
        onAssign={async (bedId, patientId, doctor, diag) => {
          const res = await fetch(`/api/beds/${bedId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "assign",
              patientId,
              doctor: "Dr. Priya Sharma",
              diagnosis: diag || diagnosis,
            }),
          });
          const json = await res.json();
          if (json.success) {
            addToast({
              title: "Patient Admitted to Inpatient Ward",
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
