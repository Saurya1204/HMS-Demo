"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  AlertCircle,
  X,
} from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = "border-slate-300 bg-white text-slate-900";
        let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;

        if (toast.type === "success") {
          borderClass = "border-green-300 bg-green-50 text-green-950 shadow-sm";
          icon = <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />;
        } else if (toast.type === "error") {
          borderClass = "border-red-300 bg-red-50 text-red-950 shadow-sm";
          icon = <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
        } else if (toast.type === "warning") {
          borderClass = "border-yellow-300 bg-yellow-50 text-yellow-950 shadow-sm";
          icon = <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />;
        } else if (toast.type === "stroke-alert") {
          borderClass = "border-red-500 bg-red-50 text-red-950 shadow-lg ring-2 ring-red-400 critical-pulse";
          icon = <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-md transition-all duration-300 flex items-start space-x-3 ${borderClass}`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold tracking-wide">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-700 mt-0.5 leading-relaxed break-words">
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-800 p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
