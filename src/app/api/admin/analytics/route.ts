import { NextRequest, NextResponse } from "next/server";
import { getAdminKPIs, getBeds, getPatients, getReferrals, getResearchProjects } from "@/lib/data-store";

export async function GET(req: NextRequest) {
  try {
    const kpis = await getAdminKPIs();
    const beds = await getBeds();
    const patients = await getPatients();
    const referrals = await getReferrals();
    const projects = await getResearchProjects();

    // Inpatient census by ward
    const wardCensus = [
      {
        ward: "Stroke ICU",
        total: beds.filter((b) => b.wardName === "Stroke ICU").length,
        occupied: beds.filter(
          (b) => b.wardName === "Stroke ICU" && b.status === "occupied"
        ).length,
      },
      {
        ward: "Neuro Recovery",
        total: beds.filter((b) => b.wardName === "Neuro Recovery").length,
        occupied: beds.filter(
          (b) => b.wardName === "Neuro Recovery" && b.status === "occupied"
        ).length,
      },
      {
        ward: "General Male",
        total: beds.filter((b) => b.wardName === "General Male").length,
        occupied: beds.filter(
          (b) => b.wardName === "General Male" && b.status === "occupied"
        ).length,
      },
      {
        ward: "General Female",
        total: beds.filter((b) => b.wardName === "General Female").length,
        occupied: beds.filter(
          (b) => b.wardName === "General Female" && b.status === "occupied"
        ).length,
      },
    ];

    // Referral sources
    const referralSources = [
      {
        name: "AMMA Digital Clinics (Rural)",
        count: referrals.filter((r) => r.source === "AMMA_Clinic").length +
          patients.filter((p) => p.source === "AMMA_Clinic").length,
      },
      {
        name: "Direct Walk-In / Public Portal",
        count: patients.filter((p) => p.source === "Direct").length,
      },
      {
        name: "Peripheral PHCs / CHCs",
        count: referrals.filter((r) => r.source === "Peripheral_PHC").length,
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        kpis,
        wardCensus,
        referralSources,
        projectsCount: projects.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
