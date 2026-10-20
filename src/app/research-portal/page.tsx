"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ResearchProject, Milestone, Publication } from "@/types";
import { AiResearchExplorer } from "@/components/AiResearchExplorer";
import {
  Brain,
  FlaskConical,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
  FileText,
  Send,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Layers,
} from "lucide-react";

export default function ResearchPortalPage() {
  const { addToast, triggerGlobalRefresh, globalRefreshKey, currentUser, switchRole } = useApp();

  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // New manuscript draft submission form state
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftAuthors, setDraftAuthors] = useState("Verma A., Sharma P., Sen A.");
  const [draftJournal, setDraftJournal] = useState("The Lancet Regional Health - Southeast Asia");
  const [draftStatus, setDraftStatus] = useState<"Draft" | "Under Review" | "Approved">("Under Review");
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/research");
      const json = await res.json();
      if (json.success && json.data) {
        setProjects(json.data);
        if (!selectedProjectId && json.data.length > 0) {
          setSelectedProjectId(json.data[0].id || json.data[0].projectCode);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch research projects:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [globalRefreshKey]);

  const activeProject =
    projects.find(
      (p) => p.id === selectedProjectId || p.projectCode === selectedProjectId
    ) || projects[0];

  const handleMilestoneToggle = async (milestone: Milestone) => {
    if (!activeProject) return;
    const nextStatus =
      milestone.status === "Pending"
        ? "In_Progress"
        : milestone.status === "In_Progress"
        ? "Completed"
        : "In_Progress";

    try {
      const res = await fetch("/api/research/milestones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProject.projectCode || activeProject.id,
          milestoneId: milestone.id,
          status: nextStatus,
        }),
      });
      const json = await res.json();
      if (json.success) {
        addToast({
          title: "Milestone Updated",
          description: `Milestone "${milestone.title}" updated to ${nextStatus}. Progress recalculated.`,
          type: "success",
        });
        triggerGlobalRefresh();
        await fetchProjects();
      } else {
        // Fallback to /api/research endpoint
        const fallbackRes = await fetch("/api/research", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: activeProject.projectCode || activeProject.id,
            milestoneId: milestone.id,
            status: nextStatus,
          }),
        });
        const fallbackJson = await fallbackRes.json();
        if (fallbackJson.success) {
          addToast({
            title: "Milestone Updated",
            description: `Milestone "${milestone.title}" updated to ${nextStatus}.`,
            type: "success",
          });
          triggerGlobalRefresh();
          await fetchProjects();
        }
      }
    } catch {
      addToast({
        title: "Update Failed",
        description: "Could not update milestone status.",
        type: "error",
      });
    }
  };

  const handleAddPublication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle || !activeProject) return;

    setIsSubmittingDraft(true);
    try {
      const newPub: Omit<Publication, "id"> = {
        title: draftTitle,
        authors: draftAuthors,
        journal: draftJournal,
        status: draftStatus,
        date: "2026-10-20",
      };

      const res = await fetch("/api/research/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProject.projectCode || activeProject.id,
          publication: newPub,
        }),
      });

      const json = await res.json();
      if (json.success) {
        addToast({
          title: "Manuscript Draft Registered",
          description: `"${draftTitle}" submitted under ${draftJournal}.`,
          type: "success",
        });
        setIsDraftModalOpen(false);
        setDraftTitle("");
        triggerGlobalRefresh();
        await fetchProjects();
      } else {
        // Try /api/research fallback
        await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: activeProject.projectCode || activeProject.id,
            publication: newPub,
          }),
        });
        addToast({
          title: "Manuscript Draft Registered",
          description: `"${draftTitle}" registered under ${draftJournal}.`,
          type: "success",
        });
        setIsDraftModalOpen(false);
        setDraftTitle("");
        triggerGlobalRefresh();
        await fetchProjects();
      }
    } catch {
      addToast({
        title: "Submission Failed",
        description: "Could not submit manuscript draft.",
        type: "error",
      });
    } finally {
      setIsSubmittingDraft(false);
    }
  };

  const isResearchAuthorized =
    currentUser.role === "researcher" || currentUser.role === "admin";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Role-Based Access Banner */}
      {!isResearchAuthorized ? (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold">Role Access Notice:</span> Currently viewing as{" "}
              <strong>{currentUser.name}</strong> ({currentUser.role}). Clinical trials are managed by MNSRI Research Directors.
            </div>
          </div>
          <button
            type="button"
            onClick={() => switchRole("researcher")}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-all"
          >
            Switch to Dr. Arvind Verma (Researcher)
          </button>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Authorized Access: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700">MNSRI Clinical Trials Terminal Active</span>
        </div>
      )}

      {/* Mandatory Safety Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <div>
          <strong>Research tool only — Not for autonomous clinical diagnosis.</strong> All trial metrics, ethics clearances, and patient enrollments represent synthetic demonstration data.
        </div>
      </div>

      {/* Header and Project Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tight">
                MNSRI Neuroscience Research Portal
              </h1>
              <p className="text-xs text-slate-500">
                Maharajganj Neuroscience & Stroke Research Institute • Clinical Trial Tracking & Publication Management
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchProjects()}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            title="Refresh Projects"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDraftModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Publication Draft</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Projects / Milestones / Publications; Right AI Literature Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Project Details, Milestones, Publications */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Project Banner */}
          {activeProject ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {activeProject.projectCode || "MNSRI-2025-01"}
                  </span>
                  <h2 className="text-lg font-bold text-[#0F172A] mt-1.5">
                    {activeProject.title}
                  </h2>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Lead: <strong>{activeProject.leadInvestigator}</strong> • Co-Investigators: Dr. Priya Sharma, MD
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-700 font-mono">
                    {activeProject.progress || 60}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Study Progress
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${activeProject.progress || 60}%` }}
                />
              </div>

              {/* Description & Metadata */}
              <div className="p-3.5 rounded-xl bg-[#F4F8FA] border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Study Objective:</strong> {activeProject.description}
                <div className="mt-2 text-[11px] text-slate-500 flex flex-wrap gap-4">
                  <span>Enrolled Cohort: <strong>{activeProject.patientCount || 42} / 120 Patients</strong> (Demo Data)</span>
                  <span>Ethics Approval: <strong>MNSRI-IEC-2024-098 (Approved)</strong></span>
                  <span>Primary Endpoint: <strong>90-Day Modified Rankin Scale (mRS)</strong></span>
                </div>
              </div>

              {/* 5-Phase Milestone Stepper */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>5-Phase Study Milestones (Click to toggle status)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">Auto-recalculates progress</span>
                </div>

                <div className="space-y-2">
                  {activeProject.milestones?.map((m: Milestone, idx: number) => {
                    const isCompleted = m.status === "Completed";
                    const isInProgress = m.status === "In_Progress";

                    return (
                      <div
                        key={m.id || idx}
                        onClick={() => handleMilestoneToggle(m)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all hover:border-indigo-400 ${
                          isCompleted
                            ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                            : isInProgress
                            ? "bg-indigo-50/50 border-indigo-200 text-indigo-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCompleted
                                ? "bg-emerald-600 text-white"
                                : isInProgress
                                ? "bg-indigo-600 text-white animate-pulse"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {isCompleted ? "✓" : idx + 1}
                          </div>
                          <div>
                            <div className="font-bold">{m.title}</div>
                            <div className="text-[11px] text-slate-500">
                              Target Date: <span className="font-mono">{m.dueDate || "2025-10-30"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : isInProgress
                                ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            {isCompleted ? "Completed" : isInProgress ? "In Progress" : "Upcoming"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Publications & Manuscripts Section */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Associated Publications & Drafts</span>
                  </h3>
                  <button
                    onClick={() => setIsDraftModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Draft
                  </button>
                </div>

                <div className="space-y-2">
                  {activeProject.publications && activeProject.publications.length > 0 ? (
                    activeProject.publications.map((pub: Publication, idx: number) => (
                      <div
                        key={pub.id || idx}
                        className="p-3 rounded-xl bg-[#F4F8FA] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{pub.title}</div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {pub.authors} • <em>{pub.journal}</em>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              pub.status === "Published"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : pub.status === "Approved"
                                ? "bg-teal-100 text-teal-800 border-teal-300"
                                : pub.status === "Under Review"
                                ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                                : "bg-slate-100 text-slate-700 border-slate-300"
                            }`}
                          >
                            {pub.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 py-3 text-center">
                      No publication drafts yet. Click "+ Add Draft" to register manuscript.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              No research projects loaded. Click refresh or seed demo data.
            </div>
          )}
        </div>

        {/* Right Column (4 cols): AI Research Explorer & Topic Search */}
        <div className="lg:col-span-4 space-y-6">
          <AiResearchExplorer />
        </div>
      </div>

      {/* Manuscript Draft Submission Modal */}
      {isDraftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Submit Research Manuscript Draft
                </h3>
              </div>
              <button
                onClick={() => setIsDraftModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPublication} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Manuscript Title *
                </label>
                <input
                  type="text"
                  required
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="e.g. Cognitive recovery following hyperacute stroke tele-triage"
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Contributing Authors
                </label>
                <input
                  type="text"
                  required
                  value={draftAuthors}
                  onChange={(e) => setDraftAuthors(e.target.value)}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Journal
                </label>
                <select
                  value={draftJournal}
                  onChange={(e) => setDraftJournal(e.target.value)}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  <option value="The Lancet Regional Health - Southeast Asia">
                    The Lancet Regional Health - Southeast Asia
                  </option>
                  <option value="Annals of Indian Academy of Neurology (AIAN)">
                    Annals of Indian Academy of Neurology (AIAN)
                  </option>
                  <option value="Stroke (American Heart Association)">
                    Stroke (American Heart Association)
                  </option>
                  <option value="Journal of Stroke and Cerebrovascular Diseases">
                    Journal of Stroke and Cerebrovascular Diseases
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Draft Submission Status
                </label>
                <select
                  value={draftStatus}
                  onChange={(e) => setDraftStatus(e.target.value as any)}
                  className="w-full bg-[#F4F8FA] border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Draft">Draft (Internal Review)</option>
                  <option value="Under Review">Under Review (Submitted to Editorial Board)</option>
                  <option value="Approved">Approved for Publication</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDraft}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  {isSubmittingDraft ? "Submitting..." : "Register Manuscript"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
