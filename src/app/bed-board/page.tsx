"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Bed, Patient, WardType } from "@/types";
import { BedAssignModal } from "@/components/BedAssignModal";
import {
  BedDouble,
  Activity,
  UserCheck,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Building,
  Filter,
  LogOut,
  ArrowRightLeft,
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

export default function BedBoardPage() {
  const { addToast, triggerGlobalRefresh, globalRefreshKey, currentUser, switchRole } = useApp();

  const [beds, setBeds] = useState<Bed[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState<string>("All");

  // Modal State
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [bRes, pRes] = await Promise.all([
        fetch("/api/beds"),
        fetch("/api/patients"),
      ]);
      const bJson = await bRes.json();
      const pJson = await pRes.json();

      if (bJson.success) setBeds(bJson.data || []);
      if (pJson.success) setPatients(pJson.data || []);
    } catch (e) {
      console.warn("Failed to fetch beds data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [globalRefreshKey]);

  const wards: WardType[] = [
    "Stroke ICU",
    "Neuro Recovery",
    "General Male",
    "General Female",
  ];

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === "occupied").length;
  const availableBeds = beds.filter((b) => b.status === "available").length;
  const maintenanceBeds = beds.filter((b) => b.status === "maintenance").length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const filteredBeds =
    selectedWard === "All" ? beds : beds.filter((b) => b.wardName === selectedWard);

  const handleBedClick = (bed: Bed) => {
    setSelectedBed(bed);
    setIsModalOpen(true);
  };

  const handleAssign = async (
    bedId: string,
    patientId: string,
    doctor: string,
    diagnosis: string
  ) => {
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
        title: "Bed Allocation Confirmed",
        description: json.message,
        type: "success",
      });
      triggerGlobalRefresh();
      await fetchData();
    }
  };

  const handleDischarge = async (bedId: string) => {
    const res = await fetch(`/api/beds/${bedId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "discharge" }),
    });
    const json = await res.json();
    if (json.success) {
      addToast({
        title: "Patient Discharged",
        description: json.message,
        type: "success",
      });
      triggerGlobalRefresh();
      await fetchData();
    }
  };

  const handleTransfer = async (fromBedId: string, toBedId: string) => {
    const res = await fetch(`/api/beds/${fromBedId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "transfer", toBedId }),
    });
    const json = await res.json();
    if (json.success) {
      addToast({
        title: "Bed Transfer Completed",
        description: json.message,
        type: "success",
      });
      triggerGlobalRefresh();
      await fetchData();
    }
  };

  const handleStatusChange = async (
    bedId: string,
    newStatus: "available" | "maintenance"
  ) => {
    const res = await fetch(`/api/beds/${bedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const json = await res.json();
    if (json.success) {
      addToast({
        title: "Bed Status Updated",
        description: `Bed marked as ${newStatus}.`,
        type: "info",
      });
      triggerGlobalRefresh();
      await fetchData();
    }
  };

  const isBedAuthorized =
    currentUser.role === "admin" ||
    currentUser.role === "doctor" ||
    currentUser.role === "receptionist";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Role-Based Access Banner */}
      {!isBedAuthorized ? (
        <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-yellow-900 shadow-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-yellow-700 shrink-0" />
            <div>
              <span className="font-bold">Role Notification:</span> Logged in as{" "}
              <strong>{currentUser.name}</strong> ({currentUser.role}). Hospital Admin, Doctor, or Receptionist can reassign beds.
            </div>
          </div>
          <button
            type="button"
            onClick={() => switchRole("admin")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
          >
            Switch to Col. R. Singh (Admin)
          </button>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between text-xs text-green-900">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>
              Authorized Access: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
            </span>
          </div>
          <span className="text-[11px] font-semibold text-green-700">Live Bed Management Active</span>
        </div>
      )}

      {/* Demo Scenario Explainer Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
            4
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 font-mono">
                DEMO SCENARIO 4: INPATIENT BED BOARD & TELEMETRY
              </span>
              <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                Live Capacity
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Visual bed matrix across Stroke ICU, Neuro Recovery, and General Wards
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
              Green beds are available for instant admission. Red beds show occupied inpatients with telemetry monitors. Yellow indicates beds undergoing sanitization.
            </p>
          </div>
        </div>

        {/* 1-Click Presentation Action */}
        <button
          type="button"
          onClick={() => {
            setSelectedWard("Stroke ICU");
            const firstStrokeBed = beds.find((b) => b.wardName === "Stroke ICU");
            if (firstStrokeBed) handleBedClick(firstStrokeBed);
          }}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>⚡ 1-Click: Filter ICU & Inspect Bed</span>
        </button>
      </div>

      {/* KPI Cards: White cards with Blue, Green, Yellow, and Red indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Total Ward Beds</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalBeds}</div>
          <span className="text-[11px] text-slate-500">Across 4 Hospital Wards</span>
        </div>

        {/* Available: Green */}
        <div className="p-4 rounded-2xl bg-white border border-green-200 shadow-xs">
          <span className="text-[10px] text-green-700 font-bold uppercase font-mono">Available Beds</span>
          <div className="text-2xl font-black text-green-700 mt-1">{availableBeds}</div>
          <span className="text-[11px] text-green-600">Ready for Admission</span>
        </div>

        {/* Occupied: Red */}
        <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-xs">
          <span className="text-[10px] text-red-700 font-bold uppercase font-mono">Occupied Beds</span>
          <div className="text-2xl font-black text-red-700 mt-1">{occupiedBeds}</div>
          <span className="text-[11px] text-red-600">Active Inpatients</span>
        </div>

        {/* Cleaning/Maintenance: Yellow */}
        <div className="p-4 rounded-2xl bg-white border border-yellow-200 shadow-xs">
          <span className="text-[10px] text-yellow-800 font-bold uppercase font-mono">Sanitizing / Maint.</span>
          <div className="text-2xl font-black text-yellow-800 mt-1">{maintenanceBeds}</div>
          <span className="text-[11px] text-yellow-700">Cleaning Protocol</span>
        </div>

        {/* Occupancy Rate: Blue */}
        <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-xs">
          <span className="text-[10px] text-blue-700 font-bold uppercase font-mono">Occupancy Rate</span>
          <div className="text-2xl font-black text-blue-900 mt-1">{occupancyRate}%</div>
          <span className="text-[11px] text-blue-600">Bed Turnaround Velocity</span>
        </div>
      </div>

      {/* Ward Filter Buttons & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          {["All", ...wards].map((w) => {
            const isSelected = selectedWard === w;
            return (
              <button
                key={w}
                type="button"
                onClick={() => setSelectedWard(w)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={fetchData}
          className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 transition-all cursor-pointer self-start sm:self-auto shadow-xs"
          title="Refresh bed statuses"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
        </button>
      </div>

      {/* Bed Grid: High-contrast, clear indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === "occupied";
          const isMaintenance = bed.status === "maintenance";
          const isAvailable = bed.status === "available";

          let borderStyle = "border-green-300 bg-white hover:border-green-500";
          let badge = (
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200 text-[10px] font-bold">
              Available
            </span>
          );

          if (isOccupied) {
            borderStyle = "border-red-300 bg-white hover:border-red-500 shadow-xs";
            badge = (
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                Occupied
              </span>
            );
          } else if (isMaintenance) {
            borderStyle = "border-yellow-300 bg-white hover:border-yellow-500";
            badge = (
              <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 text-[10px] font-bold">
                Cleaning
              </span>
            );
          }

          return (
            <div
              key={bed.id}
              onClick={() => handleBedClick(bed)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${borderStyle}`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                    <BedDouble className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900">
                      {bed.bedNumber}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {bed.wardName}
                    </div>
                  </div>
                </div>
                {badge}
              </div>

              {/* Occupied Patient Details or Available Prompter */}
              <div className="mt-3 min-h-[60px] flex flex-col justify-center">
                {isOccupied ? (
                  <div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {bed.currentPatientName || "Admitted Patient"}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {bed.admittedDiagnosis || "Acute Stroke Monitoring"}
                    </div>
                    <div className="text-[10px] text-blue-700 font-medium mt-1">
                      Dr: {bed.assignedDoctor || "Dr. Priya Sharma"}
                    </div>
                  </div>
                ) : isMaintenance ? (
                  <div className="text-xs text-yellow-800 font-medium">
                    Bed undergoing terminal sanitization & sheet change.
                  </div>
                ) : (
                  <div className="text-xs text-green-700 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Click to admit patient</span>
                  </div>
                )}
              </div>

              {/* Telemetry pill */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono">
                  {bed.wardName === "Stroke ICU" ? (
                    <span className="text-green-700 font-bold flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                      Telemetry On
                    </span>
                  ) : (
                    "Standard Ward Bed"
                  )}
                </span>
                <span className="text-blue-600 font-bold">Manage Bed →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Assignment / Transfer / Discharge Modal */}
      <BedAssignModal
        bed={selectedBed}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        unassignedPatients={patients.filter((p) => p.status !== "Admitted_IPD")}
        availableBeds={beds.filter((b) => b.status === "available" && b.id !== selectedBed?.id)}
        onAssign={handleAssign}
        onDischarge={handleDischarge}
        onTransfer={handleTransfer}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
