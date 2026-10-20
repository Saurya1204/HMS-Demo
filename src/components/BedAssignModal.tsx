"use client";

import React, { useState } from "react";
import { Bed, Patient } from "@/types";
import {
  X,
  BedDouble,
  UserCheck,
  CheckCircle,
  LogOut,
  ArrowRightLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface BedAssignModalProps {
  bed: Bed | null;
  isOpen: boolean;
  onClose: () => void;
  unassignedPatients: Patient[];
  availableBeds: Bed[];
  onAssign: (bedId: string, patientId: string, doctor: string, diagnosis: string) => Promise<void>;
  onDischarge: (bedId: string) => Promise<void>;
  onTransfer: (bedId: string, targetBedId: string, patientId?: string) => Promise<void>;
  onStatusChange: (bedId: string, status: "available" | "maintenance") => Promise<void>;
}

export function BedAssignModal({
  bed,
  isOpen,
  onClose,
  unassignedPatients,
  availableBeds,
  onAssign,
  onDischarge,
  onTransfer,
  onStatusChange,
}: BedAssignModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [attendingDoctor, setAttendingDoctor] = useState("Dr. Priya Sharma");
  const [diagnosis, setDiagnosis] = useState("");
  const [targetBedId, setTargetBedId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<"view" | "assign" | "transfer">("view");

  if (!isOpen || !bed) return null;

  const isAvailable = bed.status === "available";
  const isOccupied = bed.status === "occupied";
  const isMaintenance = bed.status === "maintenance" || bed.status === "cleaning";

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;
    setIsSubmitting(true);
    try {
      await onAssign(bed.id || bed.bedNumber, selectedPatientId, attendingDoctor, diagnosis);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDischargeSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onDischarge(bed.id || bed.bedNumber);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBedId) return;
    setIsSubmitting(true);
    try {
      await onTransfer(bed.id || bed.bedNumber, targetBedId, bed.currentPatientId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMakeAvailable = async () => {
    setIsSubmitting(true);
    try {
      await onStatusChange(bed.id || bed.bedNumber, "available");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                isAvailable
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : isOccupied
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-yellow-100 text-yellow-800 border border-yellow-300"
              }`}
            >
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900">Bed {bed.bedNumber}</h3>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isAvailable
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : isOccupied
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  }`}
                >
                  {bed.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">Ward: {bed.wardName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on bed status */}
        {isMaintenance ? (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-900 text-xs">
              <div className="flex items-center space-x-2 font-bold">
                <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0" />
                <span>Sanitization & Maintenance Required</span>
              </div>
              <p className="mt-1 text-slate-600">
                {bed.notes || "Terminal decontamination and linen change in progress."}
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMakeAvailable}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Mark Clean & Available</span>
              </button>
            </div>
          </div>
        ) : isAvailable || mode === "assign" ? (
          /* Available Bed: Assign Patient Form */
          <form onSubmit={handleAssignSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Patient for Admission
              </label>
              {unassignedPatients.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
                  No unallocated waiting patients found in queue. You can admit any walk-in or refer from AMMA clinic.
                </div>
              ) : (
                <select
                  value={selectedPatientId}
                  onChange={(e) => {
                    setSelectedPatientId(e.target.value);
                    const found = unassignedPatients.find((p) => p.id === e.target.value);
                    if (found) {
                      setDiagnosis(found.symptoms.join(", ") || "Acute Hospital Admission");
                    }
                  }}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="">-- Choose Patient from Queue --</option>
                  {unassignedPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}/{p.gender}) • {p.urgency} • [{p.tokenQr}]
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Attending Consultant
              </label>
              <select
                value={attendingDoctor}
                onChange={(e) => setAttendingDoctor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="Dr. Priya Sharma">Dr. Priya Sharma, MD DM (Neurology Lead)</option>
                <option value="Dr. Arvind Verma">Dr. Arvind Verma, DM (Director, MNSRI)</option>
                <option value="Dr. Anand Mishra">Dr. Anand Mishra, MD (Internal Medicine)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admitted Diagnosis & Clinical Protocol
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Ischemic Stroke / MCA Infarct"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedPatientId}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isSubmitting ? "Allocating..." : "Allocate Bed Now"}</span>
              </button>
            </div>
          </form>
        ) : mode === "transfer" ? (
          /* Transfer Bed Form */
          <form onSubmit={handleTransferSubmit} className="mt-5 space-y-4">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-semibold">
              Transferring patient <strong className="text-blue-950">{bed.currentPatientName}</strong> from Bed {bed.bedNumber} ({bed.wardName}).
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Available Bed
              </label>
              <select
                value={targetBedId}
                onChange={(e) => setTargetBedId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="">-- Choose Destination Bed --</option>
                {availableBeds
                  .filter((b) => b.id !== bed.id && b.bedNumber !== bed.bedNumber)
                  .map((b) => (
                    <option key={b.id || b.bedNumber} value={b.id || b.bedNumber}>
                      Bed {b.bedNumber} • {b.wardName} (Available)
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMode("view")}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !targetBedId}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Confirm Transfer</span>
              </button>
            </div>
          </form>
        ) : (
          /* Occupied Bed Summary */
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Current Occupant:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {bed.currentPatientName || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Demographics:</span>
                <span className="text-slate-800">
                  {bed.currentPatientAge} Yrs • {bed.currentPatientGender}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Admitted Diagnosis:</span>
                <span className="text-blue-700 font-bold">
                  {bed.admittedDiagnosis || "Acute Care"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Attending Consultant:</span>
                <span className="text-slate-800 font-semibold">
                  {bed.assignedDoctor || "Dr. Priya Sharma"}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setMode("transfer")}
                className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 transition-all text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <span>Transfer Bed</span>
              </button>

              <button
                type="button"
                onClick={handleDischargeSubmit}
                disabled={isSubmitting}
                className="p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition-all text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span>{isSubmitting ? "Processing..." : "Initiate Discharge"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
