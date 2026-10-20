"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { QRCodeSVG } from "qrcode.react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowRight,
  ShieldAlert,
  Search,
} from "lucide-react";
import { Appointment } from "@/types";

export default function AppointmentsPage() {
  const { addToast, triggerGlobalRefresh } = useApp();

  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [contact, setContact] = useState("");
  const [department, setDepartment] = useState("Neurology & Stroke Unit");
  const [doctorName, setDoctorName] = useState("Dr. Priya Sharma");
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [slot, setSlot] = useState("10:30 AM");
  const [reason, setReason] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  const departments = [
    {
      name: "Neurology & Stroke Unit",
      doctors: ["Dr. Priya Sharma", "Dr. Arvind Verma"],
    },
    {
      name: "Neuro-Rehabilitation & Physiotherapy",
      doctors: ["Dr. Arvind Verma", "Dr. Priya Sharma"],
    },
    {
      name: "Diabetic Neuropathy & Stroke Prevention",
      doctors: ["Dr. Priya Sharma", "Dr. Rajeshwar Rao"],
    },
    {
      name: "General Medicine & Outpatient Triage",
      doctors: ["Dr. Rajeshwar Rao", "Dr. Priya Sharma"],
    },
  ];

  const timeSlots = [
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
  ];

  const fetchAppointments = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch("/api/appointments");
      const json = await res.json();
      if (json.success && json.data) {
        setRecentAppointments(json.data);
      }
    } catch {
      // Ignore in demo
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDepartmentChange = (dept: string) => {
    setDepartment(dept);
    const found = departments.find((d) => d.name === dept);
    if (found && found.doctors.length > 0) {
      setDoctorName(found.doctors[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !age || !contact) {
      addToast({
        title: "Required Fields Missing",
        description: "Please specify patient name, age, and phone number.",
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          patientAge: Number(age),
          patientGender: gender,
          contact,
          department,
          doctorName,
          date,
          slot,
          reason: reason || "Routine Consultation",
          status: "Scheduled",
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setConfirmedBooking(json.data);
        addToast({
          title: "Appointment Confirmed!",
          description: `Token: ${json.data.tokenNumber}. Saved in OPD central registry.`,
          type: "success",
        });
        triggerGlobalRefresh();
        fetchAppointments();
      } else {
        throw new Error(json.error || "Booking failed");
      }
    } catch (err: any) {
      addToast({
        title: "Appointment Failed",
        description: err.message || "Could not register appointment",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Digital OPD Appointment System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Book an Outpatient Consultation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Schedule specialist appointments at SBM Hospitals and MNSRI. Immediate digital QR confirmation with zero physical queue waiting.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/reception"
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs"
          >
            Staff Reception View
          </Link>
          <a
            href="tel:108"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-red-600/20"
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            <span>Emergency Stroke: 108</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Booking inputs */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Patient & Consultation Details
            </h2>
            <p className="text-xs text-slate-500">
              Fill in patient particulars to reserve your verified slot.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Age + Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Patient Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ram Charan Lal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                  placeholder="e.g. 58"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Contact Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+91 94500 00000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Department & Doctor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Clinical Specialty
                </label>
                <select
                  value={department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {departments.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Attending Doctor
                </label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {departments
                    .find((d) => d.name === department)
                    ?.doctors.map((doc) => (
                      <option key={doc} value={doc}>
                        {doc}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Preferred Time Slot
                </label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Reason for Visit / Primary Symptoms
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Mild headache, limb stiffness, post-stroke follow-up"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Emergency Checkbox */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span>Are there acute stroke signs (Face droop, arm weakness, slurred speech)?</span>
              </label>

              {isEmergency && (
                <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-900 text-xs space-y-1.5">
                  <div className="font-extrabold flex items-center space-x-1 text-red-700">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>EMERGENCY STROKE WARNING</span>
                  </div>
                  <p>
                    Do not wait for a scheduled OPD appointment! Acute stroke has a 4.5-hour thrombolysis window. Call 108 or proceed immediately to SBM Emergency Resuscitation.
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm OPD Appointment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Confirmed QR Ticket or Demo List */}
        <div className="lg:col-span-5 space-y-6">
          {confirmedBooking ? (
            <div className="bg-white border-2 border-teal-500 rounded-3xl p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs uppercase font-extrabold text-teal-700">
                    Appointment Confirmed
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {confirmedBooking.tokenNumber}
                </span>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                  <QRCodeSVG
                    value={`https://sbmhospitals.in/appointment/${confirmedBooking.tokenNumber}?pid=${encodeURIComponent(confirmedBooking.patientName)}`}
                    size={140}
                    level="M"
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-extrabold text-slate-900">
                    Token: {confirmedBooking.tokenNumber}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Present this QR at SBM Central Reception Desk
                  </div>
                </div>
              </div>

              {/* Summary Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900">
                    {confirmedBooking.patientName} ({confirmedBooking.patientAge}y/{confirmedBooking.patientGender})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Doctor:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.doctorName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Specialty:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-bold text-teal-700">
                    {confirmedBooking.date} • {confirmedBooking.slot}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => setConfirmedBooking(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                >
                  Book Another
                </button>
                <Link
                  href="/reception"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold text-center"
                >
                  View in Reception
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-teal-50 border border-teal-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center space-x-2 text-teal-900 font-bold text-sm">
                <QrCode className="w-5 h-5 text-teal-600" />
                <span>Instant Digital Token Generation</span>
              </div>
              <p className="text-xs text-teal-800 leading-relaxed">
                Upon confirming your booking, you receive a scannable token linked directly to our central admission queue. No physical paperwork needed.
              </p>
            </div>
          )}

          {/* Active Demo Bookings List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">
                Today's Scheduled OPD Slots
              </h3>
              <span className="text-xs font-bold text-teal-600">
                {recentAppointments.length} Booked
              </span>
            </div>

            {isLoadingList ? (
              <div className="text-xs text-slate-400 py-4 text-center">
                Loading appointments...
              </div>
            ) : recentAppointments.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">
                No appointments registered yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentAppointments.slice(0, 4).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{apt.patientName}</span>
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                        {apt.tokenNumber}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {apt.department} • {apt.doctorName}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                      <span>{apt.date} at {apt.slot}</span>
                      <span className="font-bold text-emerald-600">{apt.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
