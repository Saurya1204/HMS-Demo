import { NextRequest, NextResponse } from "next/server";
import {
  addProjectPublication,
  getResearchProjects,
  updateProjectMilestone,
} from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (query) {
      // Simulated neuroscience literature search for MNSRI AI Explorer
      const lowerQ = query.toLowerCase();
      const mockEvidence = [
        {
          id: "ev-01",
          topic: "Cortical Plasticity in Ischemic Stroke",
          headline: "High-Frequency rTMS Promotes Motor Reorganization in MCA Infarcts",
          summary:
            "Repetitive transcranial magnetic stimulation applied over ipsilesional primary motor cortex (M1) upregulates BDNF and demonstrates 34% accelerated Fugl-Meyer motor score recovery compared to sham control (p < 0.01).",
          trialType: "Phase II Multi-Center RCT",
          sampleSize: "n = 120 patients",
          relevance: "98% Match",
          authors: "Verma A., et al. MNSRI Maharajganj Stroke Cohort (2025)",
        },
        {
          id: "ev-02",
          topic: "Rural Awadh Tele-Stroke Door-to-Needle Metrics",
          headline: "Pre-Hospital FAST Digital Triaging Cuts Thrombolysis Delay by 38 Minutes",
          summary:
            "Peripheral community digital clinics equipped with automated telemetry screening enabled emergency ambulance dispatch with pre-arrival CT slot booking, reducing median arrival-to-bolus window to 41.2 minutes.",
          trialType: "Prospective Observational Registry",
          sampleSize: "n = 280 encounters",
          relevance: "94% Match",
          authors: "Sharma P., Devi S., Singh R. (SBM Emergency Neuro Bulletin)",
        },
        {
          id: "ev-03",
          topic: "Biomarkers in Microvascular Encephalopathy",
          headline: "Serum Neurofilament Light (NfL) & S100B Correlation with Lacunar Load",
          summary:
            "Elevated plasma NfL (>18.4 pg/mL) within 72 hours of transient ischemic symptoms strongly correlates with subcortical diffusion restriction and predicts 90-day recurrent cognitive decrement.",
          trialType: "Translational Biomarker Cohort",
          sampleSize: "n = 410 subjects",
          relevance: "89% Match",
          authors: "MNSRI Computational Neurobiology Lab & SBM Pathology",
        },
        {
          id: "ev-04",
          topic: "Endovascular Thrombectomy in Extended Windows (6-24 Hours)",
          headline: "Perfusion-Mismatch Guided Mechanical Recanalization in Large Vessel Occlusion",
          summary:
            "CT perfusion mismatch with ischemic core volume < 70ml achieves modified Rankin Scale (mRS) 0-2 functional independence at 90 days in 49% of rural transfer candidates.",
          trialType: "Interventional Cohort Analysis",
          sampleSize: "n = 95 cases",
          relevance: "87% Match",
          authors: "Awadh Stroke Network & MNSRI Interventional Suite",
        },
      ].filter(
        (item) =>
          item.topic.toLowerCase().includes(lowerQ) ||
          item.headline.toLowerCase().includes(lowerQ) ||
          item.summary.toLowerCase().includes(lowerQ) ||
          query === "all"
      );

      return NextResponse.json({
        success: true,
        data: mockEvidence.length > 0 ? mockEvidence : mockEvidence.slice(0, 2),
      });
    }

    const projects = await getResearchProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, milestoneId, status } = body;

    if (!projectId || !milestoneId || !status) {
      return NextResponse.json(
        { success: false, error: "projectId, milestoneId, and status are required" },
        { status: 400 }
      );
    }

    const updated = await updateProjectMilestone(projectId, milestoneId, status);
    return NextResponse.json({
      success: true,
      message: "Research milestone updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, publication } = body;

    if (!projectId || !publication || !publication.title) {
      return NextResponse.json(
        { success: false, error: "projectId and publication data required" },
        { status: 400 }
      );
    }

    const updated = await addProjectPublication(projectId, publication);
    return NextResponse.json({
      success: true,
      message: "Publication manuscript submitted for review",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
