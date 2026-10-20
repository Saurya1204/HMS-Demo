"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { AdminKPIs, AuditLog } from "@/types";
import {
  BarChart3,
  Building,
  BedDouble,
  Users,
  Brain,
  ShieldAlert,
  RotateCcw,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Activity,
  FileSpreadsheet,
  AlertTriangle,
  Stethoscope,
  Sparkles,
} from "lucide-react";

export default function AdminPage() {
  const { kpis, refreshKPIs, triggerSeed, isSeeding, addToast, globalRefreshKey, currentUser, switchRole } = useApp();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const url =
        selectedModule === "All"
          ? "/api/admin"
          : `/api/admin?module=${encodeURIComponent(selectedModule)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setLogs(json.data.logs || []);
      }
    } catch (e) {
      console.warn("Failed to fetch admin data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    refreshKPIs();
  }, [selectedModule, globalRefreshKey]);

  const handleExportCensus = () => {
    addToast({
      title: "Hospital Census Exported",
      description: "Daily Clinical & Telemetry Census report compiled for printing.",
      type: "success",
    });
    window.print();
  };

  const modules = ["All", "AMMA", "Reception", "Doctor", "BedBoard", "MNSRI", "Admin"];

  const isAdminAuthorized = currentUser.role === "admin";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Role-Based Access Banner */}
      {!isAdminAuthorized ? (
        <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-yellow-900 shadow-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-yellow-700 shrink-0" />
            <div>
              <span className="font-bold">Role Notification:</span> Currently viewing as{" "}
              <strong>{currentUser.name}</strong> ({currentUser.role}). Master administrative controls belong to Hospital Admin.
            </div>
          </div>
          <button
            type="button"
            onClick={() => switchRole("admin")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
          >
            Switch to Col. R. Singh (Hospital Admin)
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
          <span className="text-[11px] font-semibold text-green-700">Hospital Administration & Audit Ledger Active</span>
        </div>
      )}

      {/* Demo Scenario Explainer Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shrink-0">
            6
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 font-mono">
                DEMO SCENARIO 6: EXECUTIVE DASHBOARD & AUDIT LEDGER
              </span>
              <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">
                Complete Oversight
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Leadership monitors hospital census, rural intake velocity, and real-time audit logs
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
              Every single clinical action taken across AMMA Clinic, Reception Desk, Doctor Chart, Bed Board, and MNSRI Research is logged below with actor stamps and telemetry.
            </p>
          </div>
        </div>

        {/* 1-Click Presentation Action */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={async () => {
              await triggerSeed();
              window.location.href = "/clinic";
            }}
            disabled={isSeeding}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-all hover:scale-102 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>⚡ 1-Click: Reset Platform & Start Tour</span>
          </button>
        </div>
      </div>

      {/* Header and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Executive Admin Panel & Operations Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Hospital Operations Director: Col. R. Singh (Retd.) • SBM Hospitals & MNSRI
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleExportCensus}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Export Census</span>
          </button>

          <button
            type="button"
            onClick={() => triggerSeed()}
            disabled={isSeeding}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSeeding ? "animate-spin text-blue-400" : ""}`} />
            <span>{isSeeding ? "Resetting..." : "Re-Seed Data"}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1: Inpatients (Blue) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase font-mono text-slate-400">Total Ward Beds</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {kpis?.totalBeds || 12}
          </div>
          <span className="text-[11px] text-blue-700 font-semibold">Across 4 Hospital Wards</span>
        </div>

        {/* KPI 2: Bed Occupancy (Blue/Green) */}
        <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase font-mono text-blue-700">Bed Occupancy</span>
          <div className="text-2xl font-black text-blue-900 mt-1">
            {kpis?.occupancyPercentage || 38}%
          </div>
          <span className="text-[11px] text-green-700 font-semibold">
            {kpis?.availableBeds || 5} Beds Free
          </span>
        </div>

        {/* KPI 3: AMMA Referrals (Green) */}
        <div className="p-4 rounded-2xl bg-white border border-green-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase font-mono text-green-700">AMMA Referrals</span>
          <div className="text-2xl font-black text-green-700 mt-1">
            {kpis?.activeAmmaReferrals || 2}
          </div>
          <span className="text-[11px] text-slate-500">Inbound Rural Intake</span>
        </div>

        {/* KPI 4: Critical Patients (Red Alert) */}
        <div className="p-4 rounded-2xl bg-white border border-red-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase font-mono text-red-700">Critical Code Stroke</span>
          <div className="text-2xl font-black text-red-700 mt-1">
            {kpis?.criticalPatients || 1}
          </div>
          <span className="text-[11px] text-red-600 font-bold animate-pulse">
            Golden Hour Protocol
          </span>
        </div>

        {/* KPI 5: Research Trials (Yellow/Blue) */}
        <div className="p-4 rounded-2xl bg-white border border-yellow-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase font-mono text-yellow-800">MNSRI Trials</span>
          <div className="text-2xl font-black text-yellow-800 mt-1">
            {kpis?.ongoingResearchProjects || 2}
          </div>
          <span className="text-[11px] text-slate-500">Active Stroke Studies</span>
        </div>

        {/* KPI 6: Daily OPD Volume (Blue) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase font-mono text-slate-400">Daily OPD Volume</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {kpis?.dailyOpdVolume || 48}
          </div>
          <span className="text-[11px] text-green-700 font-semibold">Consultations Completed</span>
        </div>
      </div>

      {/* Audit Log Ledger */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Cross-Platform Live Audit Trail ({logs.length} Events)
            </h2>
            <p className="text-xs text-slate-500">
              Immutable audit ledger tracking user actions across AMMA Clinic, Reception, Doctor Chart, Bed Board, and Research.
            </p>
          </div>

          {/* Module Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {modules.map((m) => {
              const isSelected = selectedModule === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedModule(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-mono font-bold text-slate-500">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Actor / Staff</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logs.map((log) => {
                let moduleBadge = "bg-blue-100 text-blue-800 border-blue-200";
                if (log.module === "AMMA") moduleBadge = "bg-green-100 text-green-800 border-green-200";
                if (log.module === "Doctor") moduleBadge = "bg-blue-100 text-blue-800 border-blue-200";
                if (log.module === "BedBoard") moduleBadge = "bg-yellow-100 text-yellow-800 border-yellow-300";
                if (log.module === "MNSRI") moduleBadge = "bg-purple-100 text-purple-800 border-purple-200";

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${moduleBadge}`}>
                        {log.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 font-sans">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-sans">
                      {log.actor}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-sans max-w-sm">
                      {log.details}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
