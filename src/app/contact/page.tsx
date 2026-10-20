"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Building2,
  Clock,
  Mail,
  MapPin,
  PhoneCall,
  Send,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function ContactPage() {
  const { addToast } = useApp();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;
    setIsSending(true);
    setTimeout(() => {
      addToast({
        title: "Inquiry Submitted Successfully",
        description: `Thank you ${name}. Our patient liaison team will contact you shortly.`,
        type: "success",
      });
      setName("");
      setContact("");
      setMessage("");
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Maharajganj & Raebareli, Uttar Pradesh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Emergency Contacts & Hospital Campus
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            24/7 dedicated acute stroke line, reception admissions desk, and peripheral AMMA rural health center coordination.
          </p>
        </div>
      </div>

      {/* Critical Emergency Red Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-red-50 border-2 border-red-400 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <PhoneCall className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-700 font-mono bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300">
                CRITICAL CODE STROKE EMERGENCY HOTLINE
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            </div>
            <h3 className="text-2xl font-black text-red-950 mt-1">
              Dial 108 • 24x7 Acute Resuscitation
            </h3>
            <p className="text-xs text-red-900 mt-1 max-w-xl leading-relaxed">
              If a patient displays sudden facial drooping, arm weakness, or slurred speech, call 108 immediately. The acute stroke code team prepares the CT scanner and IV thrombolysis ahead of ambulance arrival.
            </p>
          </div>
        </div>

        <a
          href="tel:108"
          className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0"
        >
          <PhoneCall className="w-5 h-5" />
          <span>Call 108 Now</span>
        </a>
      </div>

      {/* 3 Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Reception */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Central Reception & OPD
          </h3>
          <p className="text-xs text-slate-500">
            Hospital admissions, OPD queue verification, and bed allocation inquiries.
          </p>
          <div className="pt-2 text-xs font-mono font-bold text-blue-700">
            📞 +91 535 220 1080
          </div>
          <div className="text-[11px] text-slate-400">
            Hours: 24/7 Central Triage
          </div>
        </div>

        {/* Card 2: AMMA Clinic Outreach */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            AMMA Rural Clinics Liaison
          </h3>
          <p className="text-xs text-slate-500">
            Peripheral village clinic network, ANM telemedicine support, and rural transport.
          </p>
          <div className="pt-2 text-xs font-mono font-bold text-green-700">
            📞 +91 535 220 1090
          </div>
          <div className="text-[11px] text-slate-400">
            Hours: 8:00 AM – 8:00 PM Daily
          </div>
        </div>

        {/* Card 3: MNSRI Research */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-800 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            MNSRI Research Institute
          </h3>
          <p className="text-xs text-slate-500">
            Clinical trials coordination, academic partnerships, and Lancet publication queries.
          </p>
          <div className="pt-2 text-xs font-mono font-bold text-yellow-800">
            ✉️ research@mnsri.edu.in
          </div>
          <div className="text-[11px] text-slate-400">
            Hours: Mon – Sat, 9:00 AM – 5:00 PM
          </div>
        </div>
      </div>

      {/* Campus Map & Quick Inquiry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Campus Addresses */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-slate-900">
            Facility Locations
          </h2>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>SBM Hospitals Main Campus</span>
              </div>
              <p className="text-slate-600">
                Highway 30B, Raebareli - Maharajganj Corridor, Uttar Pradesh 229125
              </p>
              <div className="text-[11px] text-slate-400">
                Landmark: Near Maharajganj Central Junction
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-green-600" />
                <span>AMMA Digital Clinic Hub</span>
              </div>
              <p className="text-slate-600">
                Community Health Center Compound, Bachhrawan, Raebareli, UP 229301
              </p>
              <div className="text-[11px] text-slate-400">
                Hub for 42 peripheral village telemedicine points
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-yellow-600" />
                <span>MNSRI Neuroscience Wing</span>
              </div>
              <p className="text-slate-600">
                Academic Block C, SBM Hospital Medical Complex, Maharajganj, UP
              </p>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Send an Online Inquiry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill out this form for non-emergency healthcare inquiries or appointment questions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mobile / Email *
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+91 94500 00000"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="General Inquiry">General Hospital Inquiry</option>
                <option value="OPD Schedule">OPD Doctor Schedule</option>
                <option value="AMMA Rural Clinic">AMMA Rural Clinic Location</option>
                <option value="MNSRI Clinical Trials">MNSRI Research Clinical Trials</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Message / Question
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our clinical team help you?"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? "Submitting..." : "Send Message"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
