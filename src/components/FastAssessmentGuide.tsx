"use client";

import React from "react";
import { AlertCircle, Clock, Zap } from "lucide-react";

interface FastAssessmentGuideProps {
  faceDroop?: boolean;
  armWeakness?: boolean;
  slurredSpeech?: boolean;
  timeHours?: number;
  onToggleFace?: () => void;
  onToggleArm?: () => void;
  onToggleSpeech?: () => void;
  onChangeTime?: (val: number) => void;
}

export function FastAssessmentGuide({
  faceDroop: propFace,
  armWeakness: propArm,
  slurredSpeech: propSpeech,
  timeHours: propTime,
  onToggleFace: propOnFace,
  onToggleArm: propOnArm,
  onToggleSpeech: propOnSpeech,
  onChangeTime: propOnTime,
}: FastAssessmentGuideProps) {
  const [internalFace, setInternalFace] = React.useState(false);
  const [internalArm, setInternalArm] = React.useState(false);
  const [internalSpeech, setInternalSpeech] = React.useState(false);
  const [internalTime, setInternalTime] = React.useState(2.0);

  const faceDroop = propFace !== undefined ? propFace : internalFace;
  const armWeakness = propArm !== undefined ? propArm : internalArm;
  const slurredSpeech = propSpeech !== undefined ? propSpeech : internalSpeech;
  const timeHours = propTime !== undefined ? propTime : internalTime;

  const onToggleFace = propOnFace || (() => setInternalFace(!internalFace));
  const onToggleArm = propOnArm || (() => setInternalArm(!internalArm));
  const onToggleSpeech = propOnSpeech || (() => setInternalSpeech(!internalSpeech));
  const onChangeTime = propOnTime || ((val: number) => setInternalTime(val));

  const positiveCount = [faceDroop, armWeakness, slurredSpeech].filter(Boolean).length;
  const isStrokeSuspected = positiveCount > 0;
  const isWithinGoldenWindow = timeHours <= 4.5;

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-red-600" />
          <h4 className="text-sm font-bold text-slate-900 tracking-wide">
            FAST Stroke Assessment Protocol
          </h4>
        </div>
        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
            isStrokeSuspected
              ? "bg-red-100 text-red-700 border border-red-300 font-extrabold"
              : "bg-green-100 text-green-800"
          }`}
        >
          {positiveCount}/3 Symptoms Positive
        </span>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Clinical screening protocol for acute cerebral ischemia. Any 1 positive marker triggers emergency Code Stroke.
      </p>

      {/* Checklist Grid */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* F - Face */}
        <button
          type="button"
          onClick={onToggleFace}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            faceDroop
              ? "bg-red-50 border-red-400 text-red-900 ring-2 ring-red-400/40"
              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              [ F ] Face Droop
            </span>
            <span
              className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                faceDroop ? "bg-red-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {faceDroop ? "✓" : ""}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Uneven smile, unilateral eyelid or corner of mouth sagging.
          </p>
        </button>

        {/* A - Arm */}
        <button
          type="button"
          onClick={onToggleArm}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            armWeakness
              ? "bg-red-50 border-red-400 text-red-900 ring-2 ring-red-400/40"
              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              [ A ] Arm Weakness
            </span>
            <span
              className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                armWeakness ? "bg-red-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {armWeakness ? "✓" : ""}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Pronator drift or inability to raise both arms equally for 10s.
          </p>
        </button>

        {/* S - Speech */}
        <button
          type="button"
          onClick={onToggleSpeech}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            slurredSpeech
              ? "bg-red-50 border-red-400 text-red-900 ring-2 ring-red-400/40"
              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">
              [ S ] Slurred Speech
            </span>
            <span
              className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] font-bold ${
                slurredSpeech ? "bg-red-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {slurredSpeech ? "✓" : ""}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Dysarthria, garbled words, or aphasia / comprehension loss.
          </p>
        </button>
      </div>

      {/* T - Time Window Slider */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">
              [ T ] Onset Time Window Elapsed
            </div>
            <div className="text-[11px] text-slate-500">
              Golden Window for IV-tPA Thrombolysis is &lt; 4.5 Hours.
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="0.5"
            max="12"
            step="0.5"
            value={timeHours}
            onChange={(e) => onChangeTime(parseFloat(e.target.value))}
            className="w-28 sm:w-36 accent-blue-600 cursor-pointer"
          />
          <div
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
              isWithinGoldenWindow
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-yellow-100 text-yellow-800 border border-yellow-300"
            }`}
          >
            {timeHours} hrs {isWithinGoldenWindow ? "(Golden Window OK)" : "(Extended)"}
          </div>
        </div>
      </div>

      {isStrokeSuspected && (
        <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-300 flex items-center space-x-2 text-red-800 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>
            Code Stroke High Probability. Triage level elevated to CRITICAL (RED ALERT).
          </span>
        </div>
      )}
    </div>
  );
}
