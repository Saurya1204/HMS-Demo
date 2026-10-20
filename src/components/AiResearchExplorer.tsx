"use client";

import React, { useState } from "react";
import {
  Brain,
  Search,
  Sparkles,
  AlertTriangle,
  FileText,
  Database,
  ExternalLink,
} from "lucide-react";

export function AiResearchExplorer() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const suggestedTopics = [
    "Neuroplasticity & rTMS",
    "Rural Tele-Stroke Window",
    "Microvascular Encephalopathy Biomarkers",
    "Endovascular Thrombectomy",
  ];

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/research?query=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data || []);
      }
    } catch (e) {
      console.warn("AI explorer search failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
      {/* Regulatory Compliance Banner (Yellow & Red warning) */}
      <div className="mb-5 p-3.5 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center space-x-2.5 text-yellow-900 text-xs font-medium">
        <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[11px] mr-1 text-yellow-800">
            RESEARCH INVESTIGATION TOOL ONLY:
          </span>
          Not cleared for autonomous clinical diagnosis or unmonitored pharmacotherapy decisions. All findings must be peer-verified.
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-wide">
              MNSRI Neuroscience AI Explorer & Literature Synthesizer
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Query indexed clinical trials, stroke registries, fMRI volumetric correlations, and ICMR translational data.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl self-start md:self-auto font-semibold">
          <Database className="w-3.5 h-3.5" />
          <span>MNSRI Vector Corpus: 12,480 Abstracts</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="mt-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search neuroplasticity, cortical remapping, thrombolysis windows, biomarkers..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? "Searching..." : "Search Evidence"}</span>
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-500 font-semibold mr-1">Suggested:</span>
          {suggestedTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => {
                setQuery(topic);
                handleSearch(topic);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-medium transition-all cursor-pointer"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {loading ? (
        <div className="mt-6 p-8 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mb-3"></div>
          <div className="text-xs font-bold text-slate-800">
            Synthesizing Literature & Trial Registries...
          </div>
        </div>
      ) : hasSearched && results.length > 0 ? (
        <div className="mt-6 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Evidence Syntheses & Trial Abstracts ({results.length})</span>
            <span className="text-xs font-bold text-green-700">Verified Study</span>
          </div>

          {results.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all shadow-xs group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      {item.trialType}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.sampleSize}
                    </span>
                    <span className="text-[10px] text-green-700 font-bold">
                      {item.relevance}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5 group-hover:text-blue-700 transition-colors">
                    {item.headline}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-1 font-mono">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Citation: {item.authors}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-700 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
                  title="View citation"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : hasSearched ? (
        <div className="mt-6 p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
          No specific trial matches found for &quot;{query}&quot;. Try searching for &quot;rTMS&quot; or &quot;thrombolysis&quot;.
        </div>
      ) : null}
    </div>
  );
}
