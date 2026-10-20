"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  FileText,
  Filter,
  Search,
  ArrowLeft,
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { AuditLog } from "@/types";

export default function AdminAuditLogsPage() {
  const { addToast } = useApp();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const modules = [
    "All",
    "AMMA",
    "Reception",
    "Doctor",
    "BedBoard",
    "MNSRI",
    "Admin",
    "Appointments",
  ];

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const url =
        moduleFilter === "All"
          ? "/api/admin/audit-logs"
          : `/api/admin/audit-logs?module=${encodeURIComponent(moduleFilter)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setLogs(json.data);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  const filteredLogs = logs.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      l.actor.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      (l.recordRef && l.recordRef.toLowerCase().includes(q))
    );
  });

  const getModuleColor = (mod: string) => {
    switch (mod) {
      case "AMMA":
        return "bg-green-100 text-green-800 border-green-200";
      case "Reception":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "Doctor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "BedBoard":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "MNSRI":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Appointments":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-teal-700 mb-1">
            <Link href="/admin" className="hover:underline flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Admin Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Master Audit & Operational History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable server-generated transaction log tracking every admission, triage, and prescription.
          </p>
        </div>

        {/* Navigation Pills */}
        <div className="flex items-center space-x-2">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1.5"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/users"
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users</span>
          </Link>
          <Link
            href="/admin/audit-logs"
            className="px-3.5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Logs</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Module Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {modules.map((m) => (
              <button
                key={m}
                onClick={() => setModuleFilter(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  moduleFilter === m
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by actor, action, or details..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Record Ref</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading audit events...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {log.actor}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getModuleColor(
                          log.module
                        )}`}
                      >
                        {log.module}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {log.action}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-teal-700 whitespace-nowrap">
                      {log.recordRef || "—"}
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-md truncate">
                      {log.details}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {log.outcome || "Success"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
