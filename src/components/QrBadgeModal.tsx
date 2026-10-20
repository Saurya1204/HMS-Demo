"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Patient } from "@/types";
import {
  X,
  Printer,
  QrCode,
  CheckCircle2,
  Activity,
  AlertCircle,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface QrBadgeModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QrBadgeModal({ patient, isOpen, onClose }: QrBadgeModalProps) {
  const badgeRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !patient) return null;

  const handlePrint = () => {
    window.print();
  };

  const isCritical = patient.urgency === "Critical";
  const isUrgent = patient.urgency === "Urgent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Digital Clinic Triage Token Slip & QR Badge
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Badge Area */}
        <div
          ref={badgeRef}
          className="mt-4 p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-blue-300 relative overflow-hidden"
        >
          {/* Top Organization Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-blue-700 font-mono tracking-wider">
                AMMA Digital Clinic • Rural Triage Center
              </div>
              <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                SBM HOSPITALS & MNSRI NETWORK
              </div>
              <div className="text-xs text-slate-600 flex items-center mt-0.5">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {patient.village || "Bachhrawan Sub-Center, Raebareli"}
              </div>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-1 ${
                isCritical
                  ? "bg-red-600 text-white animate-pulse shadow-sm"
                  : isUrgent
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  : "bg-green-100 text-green-800 border border-green-300"
              }`}
            >
              {isCritical && <AlertCircle className="w-3.5 h-3.5 mr-0.5" />}
              <span>{patient.urgency} Triage</span>
            </div>
          </div>

          {/* Middle: QR Code + Patient Info */}
          <div className="mt-4 flex items-center space-x-4">
            {/* Real Dynamic QR Code */}
            <div className="w-28 h-28 bg-white p-2 rounded-xl shrink-0 flex flex-col items-center justify-center shadow-sm border border-slate-300">
              <QRCodeSVG
                value={`https://sbmhospitals.in/referral-token/${patient.tokenQr}`}
                size={88}
                level="M"
              />
              <span className="text-[8px] font-mono text-slate-700 font-bold mt-1">
                {patient.tokenQr}
              </span>
            </div>

            {/* Patient Details */}
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold text-slate-900 truncate">
                {patient.name}
              </div>
              <div className="text-xs text-slate-600 font-medium">
                {patient.age} Yrs • {patient.gender} • {patient.contact}
              </div>

              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                  {patient.tokenQr}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {patient.patientId}
                </span>
              </div>

              <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {new Date(patient.createdAt || Date.now()).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  IST
                </span>
              </div>
            </div>
          </div>

          {/* Vitals Summary Strip */}
          <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-4 gap-2 text-center">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[9px] uppercase font-bold text-slate-500">BP (mmHg)</div>
              <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
                {patient.vitals?.bp || "120/80"}
              </div>
            </div>

            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[9px] uppercase font-bold text-slate-500">SpO2 (%)</div>
              <div className="text-xs font-bold text-green-700 font-mono mt-0.5">
                {patient.vitals?.spo2 || 98}%
              </div>
            </div>

            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[9px] uppercase font-bold text-slate-500">Pulse</div>
              <div className="text-xs font-bold text-blue-700 font-mono mt-0.5">
                {patient.vitals?.pulse || 76} bpm
              </div>
            </div>

            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[9px] uppercase font-bold text-slate-500">Temp</div>
              <div className="text-xs font-bold text-yellow-700 font-mono mt-0.5">
                {patient.vitals?.temp || 98.6}°F
              </div>
            </div>
          </div>

          {/* Critical FAST badge */}
          {patient.fastAssessment && (
            <div className="mt-3 p-2 rounded-xl bg-red-100 border border-red-300 text-xs text-red-900 font-semibold flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-red-600" />
                <span>FAST Stroke Protocol: Face [✓] Arm [✓] Speech [✓]</span>
              </div>
              <span className="text-[11px] font-bold text-red-700">Golden Window Active</span>
            </div>
          )}

          <div className="mt-3 pt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200">
            <span className="flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mr-1" />
              Verified by Sunita Devi (ANM)
            </span>
            <span className="font-semibold text-blue-700">Direct SBM Inbound Sync</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Slip</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                window.location.href = "/reception";
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <span>Next Step: Go to Reception</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
