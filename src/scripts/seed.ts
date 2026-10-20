import { resetAndSeed } from "../lib/data-store";
import fs from "fs";
import path from "path";

// Load environment variables without external dependencies
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if (val.startsWith('"') && val.endsWith('"')) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  }
}

loadEnv();

async function main() {
  console.log("=================================================");
  console.log(" SBM Hospitals + MNSRI Digital Platform");
  console.log(" Database Seeding Script");
  console.log("=================================================");
  console.log(
    `Target MongoDB: ${process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sbm_mnsri_hospital"}`
  );

  try {
    const res = await resetAndSeed();
    console.log("\n[SUCCESS]", res.message);
    console.log("\nSeeded Record Counts:");
    Object.entries(res.counts).forEach(([collection, count]) => {
      console.log(`  - ${collection.padEnd(20)}: ${count} records`);
    });
    console.log("\nDemo Personas:");
    console.log("  - Admin:       admin.director@sbmhospitals.org (Col. R. Singh)");
    console.log("  - Doctor:      priya.sharma@sbmhospitals.org   (Dr. Priya Sharma)");
    console.log("  - Receptionist:rajesh.k@sbmhospitals.org       (Rajesh Kumar)");
    console.log("  - Nurse:       sunita.amma@sbmhospitals.org    (Sunita Devi ANM)");
    console.log("  - Researcher:  arvind.verma@mnsri.edu.in       (Dr. Arvind Verma)");
    console.log("  - Patient:     ramesh.patel@gmail.com          (Ramesh Patel)");
    console.log("=================================================\n");
    process.exit(0);
  } catch (err: any) {
    console.error("\n[ERROR] Seeding failed:", err.message);
    process.exit(1);
  }
}

main();
