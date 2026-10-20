import {
  AdminKPIs,
  Admission,
  Appointment,
  AuditLog,
  Bed,
  Encounter,
  Patient,
  Publication,
  Referral,
  ResearchProject,
  User,
  UserRole,
} from "@/types";
import { connectDB } from "./db";
import { PatientModel } from "@/models/Patient";
import { BedModel } from "@/models/Bed";
import { EncounterModel } from "@/models/Encounter";
import { ResearchProjectModel } from "@/models/ResearchProject";
import { AuditLogModel } from "@/models/AuditLog";
import { UserModel } from "@/models/User";
import { AppointmentModel } from "@/models/Appointment";
import { ReferralModel } from "@/models/Referral";
import { AdmissionModel } from "@/models/Admission";
import { PublicationModel } from "@/models/Publication";
import {
  initialAdmissions,
  initialAppointments,
  initialAuditLogs,
  initialBeds,
  initialEncounters,
  initialPatients,
  initialPublications,
  initialReferrals,
  initialResearchProjects,
  initialUsers,
} from "./seed-data";
import bcrypt from "bcryptjs";

// In-Memory store singleton for fast local demo fallback & caching
interface InMemoryStore {
  users: User[];
  patients: Patient[];
  beds: Bed[];
  encounters: Encounter[];
  researchProjects: ResearchProject[];
  auditLogs: AuditLog[];
  appointments: Appointment[];
  referrals: Referral[];
  admissions: Admission[];
  publications: Publication[];
}

declare global {
  // eslint-disable-next-line no-var
  var __hmsStore: InMemoryStore | undefined;
}

function getStore(): InMemoryStore {
  if (!global.__hmsStore) {
    global.__hmsStore = {
      users: JSON.parse(JSON.stringify(initialUsers)),
      patients: JSON.parse(JSON.stringify(initialPatients)),
      beds: JSON.parse(JSON.stringify(initialBeds)),
      encounters: JSON.parse(JSON.stringify(initialEncounters)),
      researchProjects: JSON.parse(JSON.stringify(initialResearchProjects)),
      auditLogs: JSON.parse(JSON.stringify(initialAuditLogs)),
      appointments: JSON.parse(JSON.stringify(initialAppointments)),
      referrals: JSON.parse(JSON.stringify(initialReferrals)),
      admissions: JSON.parse(JSON.stringify(initialAdmissions)),
      publications: JSON.parse(JSON.stringify(initialPublications)),
    };
  }
  return global.__hmsStore;
}

// ---------------- PATIENTS ----------------
export async function getPatients(): Promise<Patient[]> {
  const db = await connectDB();
  if (db) {
    try {
      const docs = await PatientModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id || d.patientId,
        }));
      }
    } catch (e) {
      console.warn("DB read error, falling back to memory:", e);
    }
  }
  return getStore().patients;
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const patients = await getPatients();
  return (
    patients.find(
      (p) => p.id === id || p.patientId === id || (p as any)._id === id
    ) || null
  );
}

export async function createPatient(
  patientData: Partial<Patient>
): Promise<Patient> {
  const store = getStore();
  const id = `pat-${Date.now().toString(36)}`;
  const patientId =
    patientData.patientId ||
    `SBM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPatient: Patient = {
    id,
    patientId,
    name: patientData.name || "Anonymous Patient",
    age: patientData.age || 45,
    gender: patientData.gender || "Male",
    contact: patientData.contact || "+91 90000 00000",
    village: patientData.village || "Rural Maharajganj Center",
    tokenQr:
      patientData.tokenQr ||
      `AMMA-TK-${Math.floor(1000 + Math.random() * 9000)}`,
    source: patientData.source || "AMMA_Clinic",
    urgency: patientData.urgency || "Routine",
    status:
      patientData.status ||
      (patientData.source === "AMMA_Clinic"
        ? "Referred_AMMA"
        : "Reception_Waiting"),
    vitals: patientData.vitals || {
      bp: "120/80",
      spo2: 98,
      pulse: 75,
      temp: 98.6,
    },
    symptoms: patientData.symptoms || [],
    fastAssessment: patientData.fastAssessment,
    notes: patientData.notes || "",
    assignedDoctorId: patientData.assignedDoctorId,
    assignedDoctorName: patientData.assignedDoctorName,
    assignedBedId: patientData.assignedBedId,
    assignedBedNumber: patientData.assignedBedNumber,
    assignedWard: patientData.assignedWard,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Memory store insert
  store.patients.unshift(newPatient);

  // If from AMMA clinic, also automatically create inbound referral
  if (patientData.source === "AMMA_Clinic") {
    const referral: Referral = {
      id: `ref-${Date.now().toString(36)}`,
      referralNumber: `REF-AMMA-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: newPatient.patientId,
      patientName: newPatient.name,
      age: newPatient.age,
      gender: newPatient.gender,
      contact: newPatient.contact,
      village: newPatient.village || "Rural Clinic",
      source: "AMMA_Clinic",
      urgency: newPatient.urgency,
      symptoms: newPatient.symptoms,
      vitals: newPatient.vitals,
      status: "Pending_Arrival",
      arrivalTime: "En route to SBM Central Reception",
      notes: newPatient.notes,
      createdAt: new Date().toISOString(),
    };
    store.referrals.unshift(referral);

    const db = await connectDB();
    if (db) {
      try {
        await ReferralModel.create(referral);
      } catch (e) {
        console.warn("DB referral auto-create error:", e);
      }
    }
  }

  // Audit log
  await addAuditLog(
    patientData.source === "AMMA_Clinic"
      ? "AMMA Referral Created"
      : "Direct OPD Registration",
    patientData.source === "AMMA_Clinic"
      ? "Sunita Devi (ANM)"
      : "Rajesh Kumar (Reception)",
    patientData.source === "AMMA_Clinic" ? "AMMA" : "Reception",
    `Patient ${newPatient.name} (${newPatient.age}/${newPatient.gender}) registered with urgency ${newPatient.urgency}. Token: ${newPatient.tokenQr}`,
    newPatient.patientId,
    "Success"
  );

  // MongoDB insert
  const db = await connectDB();
  if (db) {
    try {
      await PatientModel.create(newPatient);
    } catch (e) {
      console.warn("DB write error:", e);
    }
  }

  return newPatient;
}

export async function updatePatient(
  id: string,
  updates: Partial<Patient>
): Promise<Patient | null> {
  const store = getStore();
  const idx = store.patients.findIndex(
    (p) => p.id === id || p.patientId === id || (p as any)._id === id
  );

  let updated: Patient | null = null;
  if (idx !== -1) {
    store.patients[idx] = {
      ...store.patients[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    updated = store.patients[idx];
  }

  const db = await connectDB();
  if (db) {
    try {
      const res = await PatientModel.findOneAndUpdate(
        { $or: [{ patientId: id }, { _id: id }] },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean();
      if (res) {
        updated = {
          ...res,
          id: (res as any)._id?.toString() || (res as any).patientId,
        };
      }
    } catch (e) {
      console.warn("DB update error:", e);
    }
  }

  return updated;
}

// ---------------- BEDS & WARDS ----------------
export async function getBeds(): Promise<Bed[]> {
  const db = await connectDB();
  if (db) {
    try {
      const docs = await BedModel.find().lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id || d.bedNumber,
        }));
      }
    } catch (e) {
      console.warn("DB read beds error:", e);
    }
  }
  return getStore().beds;
}

export async function getBedById(bedId: string): Promise<Bed | null> {
  const beds = await getBeds();
  return (
    beds.find((b) => b.id === bedId || b.bedNumber === bedId) || null
  );
}

export async function allocateBed(
  bedId: string,
  patientId: string,
  diagnosis?: string,
  doctor?: string
): Promise<{ success: boolean; bed: Bed; patient: Patient; admission: Admission }> {
  const store = getStore();
  const bed = store.beds.find((b) => b.id === bedId || b.bedNumber === bedId);
  if (!bed) throw new Error("Bed not found");

  const patient = store.patients.find(
    (p) => p.id === patientId || p.patientId === patientId
  );
  if (!patient) throw new Error("Patient not found");

  bed.status = "occupied";
  bed.currentPatientId = patient.id;
  bed.currentPatientName = patient.name;
  bed.currentPatientAge = patient.age;
  bed.currentPatientGender = patient.gender;
  bed.admittedDiagnosis =
    diagnosis || patient.symptoms.join(", ") || "Acute Neurological Admission";
  bed.assignedDoctor = doctor || "Dr. Priya Sharma";
  bed.admissionDate = new Date().toISOString();

  // Update patient status to Admitted_IPD
  patient.status = "Admitted_IPD";
  patient.assignedBedId = bed.id;
  patient.assignedBedNumber = bed.bedNumber;
  patient.assignedWard = bed.wardName;
  patient.assignedDoctorName = bed.assignedDoctor;

  // Create Admission record
  const admission: Admission = {
    id: `adm-${Date.now().toString(36)}`,
    admissionNumber: `ADM-${new Date().getFullYear()}-${Math.floor(
      100 + Math.random() * 900
    )}`,
    patientId: patient.patientId,
    patientName: patient.name,
    bedId: bed.id,
    bedNumber: bed.bedNumber,
    wardName: bed.wardName,
    admittingDoctor: bed.assignedDoctor,
    diagnosis: bed.admittedDiagnosis,
    admissionDate: new Date().toISOString(),
    status: "Admitted",
    createdAt: new Date().toISOString(),
  };
  store.admissions.unshift(admission);

  await addAuditLog(
    "Bed Allocated",
    bed.assignedDoctor,
    "BedBoard",
    `Patient ${patient.name} admitted to ${bed.wardName} (${bed.bedNumber}) for ${bed.admittedDiagnosis}. Admission: ${admission.admissionNumber}`,
    bed.bedNumber,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await BedModel.findOneAndUpdate({ bedNumber: bed.bedNumber }, bed, {
        new: true,
      });
      await PatientModel.findOneAndUpdate(
        { patientId: patient.patientId },
        patient
      );
      await AdmissionModel.create(admission);
    } catch (e) {
      console.warn("DB bed assign error:", e);
    }
  }

  return { success: true, bed, patient, admission };
}

export async function dischargeBed(
  bedId: string
): Promise<{ success: boolean; bed: Bed }> {
  const store = getStore();
  const bed = store.beds.find((b) => b.id === bedId || b.bedNumber === bedId);
  if (!bed) throw new Error("Bed not found");

  const prevPatientId = bed.currentPatientId;
  const prevPatientName = bed.currentPatientName || "Patient";

  bed.status = "cleaning";
  bed.notes = "Patient discharged. Bed in terminal cleaning & linen change.";
  bed.currentPatientId = undefined;
  bed.currentPatientName = undefined;
  bed.currentPatientAge = undefined;
  bed.currentPatientGender = undefined;
  bed.admittedDiagnosis = undefined;
  bed.assignedDoctor = undefined;
  bed.admissionDate = undefined;

  if (prevPatientId) {
    const patient = store.patients.find(
      (p) => p.id === prevPatientId || p.patientId === prevPatientId
    );
    if (patient) {
      patient.status = "Discharged";
      patient.assignedBedId = undefined;
      patient.assignedBedNumber = undefined;
    }

    // Update active admission
    const adm = store.admissions.find(
      (a) =>
        (a.patientId === prevPatientId || a.patientName === prevPatientName) &&
        a.status === "Admitted"
    );
    if (adm) {
      adm.status = "Discharged";
      adm.dischargeDate = new Date().toISOString();
    }
  }

  await addAuditLog(
    "Discharge Completed",
    "Ward Sister / Incharge",
    "BedBoard",
    `Bed ${bed.bedNumber} discharged (${prevPatientName}). Bed moved to cleaning status.`,
    bed.bedNumber,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await BedModel.findOneAndUpdate({ bedNumber: bed.bedNumber }, bed);
    } catch (e) {
      console.warn("DB discharge error:", e);
    }
  }

  return { success: true, bed };
}

export async function transferBed(
  fromBedId: string,
  toBedId: string
): Promise<{ success: boolean; fromBed: Bed; toBed: Bed }> {
  const store = getStore();
  const fromBed = store.beds.find(
    (b) => b.id === fromBedId || b.bedNumber === fromBedId
  );
  if (!fromBed) throw new Error("Source bed not found");
  if (fromBed.status !== "occupied")
    throw new Error("Source bed is not occupied");

  const toBed = store.beds.find(
    (b) => b.id === toBedId || b.bedNumber === toBedId
  );
  if (!toBed) throw new Error("Target bed not found");
  if (toBed.status !== "available")
    throw new Error("Target bed is not available for transfer");

  // Transfer patient details
  toBed.status = "occupied";
  toBed.currentPatientId = fromBed.currentPatientId;
  toBed.currentPatientName = fromBed.currentPatientName;
  toBed.currentPatientAge = fromBed.currentPatientAge;
  toBed.currentPatientGender = fromBed.currentPatientGender;
  toBed.admittedDiagnosis = fromBed.admittedDiagnosis;
  toBed.assignedDoctor = fromBed.assignedDoctor;
  toBed.admissionDate = fromBed.admissionDate;

  // Clear source bed and mark cleaning
  fromBed.status = "cleaning";
  fromBed.notes = `Patient transferred to ${toBed.wardName} (${toBed.bedNumber}). Sanitization scheduled.`;
  fromBed.currentPatientId = undefined;
  fromBed.currentPatientName = undefined;
  fromBed.currentPatientAge = undefined;
  fromBed.currentPatientGender = undefined;
  fromBed.admittedDiagnosis = undefined;
  fromBed.assignedDoctor = undefined;
  fromBed.admissionDate = undefined;

  // Update patient record
  const patient = store.patients.find(
    (p) =>
      p.id === toBed.currentPatientId || p.patientId === toBed.currentPatientId
  );
  if (patient) {
    patient.assignedBedId = toBed.id;
    patient.assignedBedNumber = toBed.bedNumber;
    patient.assignedWard = toBed.wardName;
  }

  await addAuditLog(
    "Bed Transfer Completed",
    toBed.assignedDoctor || "Charge Nurse",
    "BedBoard",
    `Patient ${toBed.currentPatientName} transferred from ${fromBed.bedNumber} to ${toBed.wardName} (${toBed.bedNumber}).`,
    toBed.bedNumber,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await BedModel.findOneAndUpdate(
        { bedNumber: fromBed.bedNumber },
        fromBed
      );
      await BedModel.findOneAndUpdate({ bedNumber: toBed.bedNumber }, toBed);
      if (patient) {
        await PatientModel.findOneAndUpdate(
          { patientId: patient.patientId },
          patient
        );
      }
    } catch (e) {
      console.warn("DB bed transfer error:", e);
    }
  }

  return { success: true, fromBed, toBed };
}

export async function updateBedStatus(
  bedId: string,
  status: "available" | "occupied" | "maintenance" | "cleaning",
  notes?: string
): Promise<Bed> {
  const store = getStore();
  const bed = store.beds.find((b) => b.id === bedId || b.bedNumber === bedId);
  if (!bed) throw new Error("Bed not found");

  bed.status = status;
  if (notes !== undefined) bed.notes = notes;
  if (status === "available") {
    bed.currentPatientId = undefined;
    bed.currentPatientName = undefined;
    bed.currentPatientAge = undefined;
    bed.currentPatientGender = undefined;
    bed.admittedDiagnosis = undefined;
    bed.assignedDoctor = undefined;
  }

  await addAuditLog(
    "Bed Status Changed",
    "Staff Nurse",
    "BedBoard",
    `Bed ${bed.bedNumber} operational status updated to ${status}.`,
    bed.bedNumber,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await BedModel.findOneAndUpdate({ bedNumber: bed.bedNumber }, bed);
    } catch (e) {
      console.warn("DB bed status error:", e);
    }
  }

  return bed;
}

// ---------------- ENCOUNTERS ----------------
export async function getEncounters(): Promise<Encounter[]> {
  const db = await connectDB();
  if (db) {
    try {
      const docs = await EncounterModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id,
        }));
      }
    } catch (e) {
      console.warn("DB encounters error:", e);
    }
  }
  return getStore().encounters;
}

export async function createEncounter(
  data: Partial<Encounter>
): Promise<Encounter> {
  const store = getStore();
  const id = `enc-${Date.now().toString(36)}`;

  const encounter: Encounter = {
    id,
    patientId: data.patientId || "",
    patientName: data.patientName || "Patient",
    doctorId: data.doctorId || "usr-01",
    doctorName: data.doctorName || "Dr. Priya Sharma",
    type: data.type || "OPD",
    status: data.status || "Completed",
    vitals: data.vitals || { bp: "120/80", spo2: 98, pulse: 72 },
    diagnosis: data.diagnosis || "Clinical Review",
    icdCodes: data.icdCodes || [],
    prescriptions: data.prescriptions || [],
    labOrders: data.labOrders || [],
    clinicalNotes: data.clinicalNotes || "",
    bedAdmissionOrdered: data.bedAdmissionOrdered || false,
    admittedWard: data.admittedWard,
    admittedBedNumber: data.admittedBedNumber,
    createdAt: new Date().toISOString(),
  };

  store.encounters.unshift(encounter);

  // Update patient status
  const pat = store.patients.find(
    (p) => p.id === data.patientId || p.patientId === data.patientId
  );
  if (pat) {
    if (data.bedAdmissionOrdered) {
      pat.status = "Admitted_IPD";
      pat.assignedWard = data.admittedWard;
      pat.assignedBedNumber = data.admittedBedNumber;
    } else {
      pat.status = "Reception_Waiting";
    }
  }

  await addAuditLog(
    "Clinical Encounter Recorded",
    encounter.doctorName || "Doctor",
    "Doctor",
    `Encounter finalized for ${encounter.patientName}. Diagnosis: ${
      encounter.diagnosis
    }. Prescriptions: ${encounter.prescriptions.length}. ${
      encounter.bedAdmissionOrdered
        ? `Admitted to ${encounter.admittedWard} (${encounter.admittedBedNumber})`
        : ""
    }`,
    encounter.patientId,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await EncounterModel.create(encounter);
      if (pat) {
        await PatientModel.findOneAndUpdate(
          { patientId: pat.patientId },
          pat
        );
      }
    } catch (e) {
      console.warn("DB encounter insert error:", e);
    }
  }

  return encounter;
}

// ---------------- APPOINTMENTS ----------------
export async function getAppointments(): Promise<Appointment[]> {
  const db = await connectDB();
  if (db) {
    try {
      const docs = await AppointmentModel.find()
        .sort({ createdAt: -1 })
        .lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id,
        }));
      }
    } catch (e) {
      console.warn("DB appointments read error:", e);
    }
  }
  return getStore().appointments;
}

export async function createAppointment(
  data: Partial<Appointment>
): Promise<Appointment> {
  const store = getStore();
  const id = `apt-${Date.now().toString(36)}`;
  const tokenNumber = `OPD-TK-${Math.floor(10 + Math.random() * 90)}`;

  const apt: Appointment = {
    id,
    patientName: data.patientName || "Anonymous",
    patientAge: data.patientAge || 40,
    patientGender: data.patientGender || "Male",
    contact: data.contact || "+91 90000 00000",
    department: data.department || "Neurology & Stroke Unit",
    doctorName: data.doctorName || "Dr. Priya Sharma",
    date: data.date || new Date().toISOString().split("T")[0],
    slot: data.slot || "10:00 AM",
    reason: data.reason || "General OPD Consultation",
    status: data.status || "Scheduled",
    tokenNumber,
    createdAt: new Date().toISOString(),
  };

  store.appointments.unshift(apt);

  await addAuditLog(
    "OPD Appointment Booked",
    apt.patientName,
    "Appointments",
    `Appointment booked for ${apt.patientName} (${apt.department}) on ${apt.date} at ${apt.slot}. Token: ${apt.tokenNumber}`,
    apt.tokenNumber,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await AppointmentModel.create(apt);
    } catch (e) {
      console.warn("DB appointment insert error:", e);
    }
  }

  return apt;
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment["status"]
): Promise<Appointment | null> {
  const store = getStore();
  const apt = store.appointments.find((a) => a.id === id || a.tokenNumber === id);
  if (!apt) return null;

  apt.status = status;

  await addAuditLog(
    "Appointment Status Updated",
    "Receptionist",
    "Reception",
    `Appointment ${apt.tokenNumber} (${apt.patientName}) updated to ${status}.`,
    apt.tokenNumber,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await AppointmentModel.findOneAndUpdate(
        { $or: [{ id }, { tokenNumber: id }] },
        { status }
      );
    } catch (e) {
      console.warn("DB appointment update error:", e);
    }
  }

  return apt;
}

// ---------------- REFERRALS ----------------
export async function getReferrals(): Promise<Referral[]> {
  const db = await connectDB();
  if (db) {
    try {
      const docs = await ReferralModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id || d.referralNumber,
        }));
      }
    } catch (e) {
      console.warn("DB referrals read error:", e);
    }
  }
  return getStore().referrals;
}

export async function createReferral(
  data: Partial<Referral>
): Promise<Referral> {
  const store = getStore();
  const id = `ref-${Date.now().toString(36)}`;
  const referralNumber = `REF-AMMA-${Math.floor(1000 + Math.random() * 9000)}`;

  const referral: Referral = {
    id,
    referralNumber,
    patientId: data.patientId || `SBM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    patientName: data.patientName || "Anonymous",
    age: data.age || 50,
    gender: data.gender || "Male",
    contact: data.contact || "+91 90000 00000",
    village: data.village || "Bachhrawan, Raebareli",
    source: data.source || "AMMA_Clinic",
    urgency: data.urgency || "Routine",
    symptoms: data.symptoms || [],
    vitals: data.vitals || { bp: "120/80", spo2: 98, pulse: 75, temp: 98.6 },
    status: data.status || "Pending_Arrival",
    arrivalTime: data.arrivalTime || "En route",
    notes: data.notes || "",
    createdAt: new Date().toISOString(),
  };

  store.referrals.unshift(referral);

  await addAuditLog(
    "Inbound Referral Created",
    "AMMA Clinic ANM",
    "AMMA",
    `Referral ${referral.referralNumber} created for ${referral.patientName} (${referral.urgency}).`,
    referral.referralNumber,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await ReferralModel.create(referral);
    } catch (e) {
      console.warn("DB referral insert error:", e);
    }
  }

  return referral;
}

export async function updateReferralStatus(
  id: string,
  status: Referral["status"]
): Promise<Referral | null> {
  const store = getStore();
  const ref = store.referrals.find(
    (r) => r.id === id || r.referralNumber === id || r.patientId === id
  );
  if (!ref) return null;

  ref.status = status;
  if (status === "Arrived") {
    ref.arrivalTime = "Arrived at Reception Desk";
  }

  await addAuditLog(
    "Referral Status Updated",
    "Rajesh Kumar (Reception)",
    "Reception",
    `Referral ${ref.referralNumber} (${ref.patientName}) marked as ${status}.`,
    ref.referralNumber,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await ReferralModel.findOneAndUpdate(
        { $or: [{ id }, { referralNumber: id }] },
        { status, arrivalTime: ref.arrivalTime }
      );
    } catch (e) {
      console.warn("DB referral update error:", e);
    }
  }

  return ref;
}

// ---------------- ADMISSIONS ----------------
export async function getAdmissions(): Promise<Admission[]> {
  const db = await connectDB();
  if (db) {
    try {
      const docs = await AdmissionModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id,
        }));
      }
    } catch (e) {
      console.warn("DB admissions read error:", e);
    }
  }
  return getStore().admissions;
}

// ---------------- RESEARCH PROJECTS & MILESTONES ----------------
export async function getResearchProjects(): Promise<ResearchProject[]> {
  const db = await connectDB();
  if (db) {
    try {
      const docs = await ResearchProjectModel.find().lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id || d.projectCode,
        }));
      }
    } catch (e) {
      console.warn("DB research error:", e);
    }
  }
  return getStore().researchProjects;
}

export async function getResearchProjectById(
  id: string
): Promise<ResearchProject | null> {
  const projects = await getResearchProjects();
  return (
    projects.find((p) => p.id === id || p.projectCode === id) || null
  );
}

export async function updateProjectMilestone(
  projectId: string,
  milestoneId: string,
  newStatus: "Pending" | "In_Progress" | "Completed",
  targetDate?: string
): Promise<ResearchProject | null> {
  const store = getStore();
  const proj = store.researchProjects.find(
    (p) => p.id === projectId || p.projectCode === projectId
  );
  if (!proj) return null;

  const ms = proj.milestones.find((m) => m.id === milestoneId);
  if (ms) {
    ms.status = newStatus;
    if (targetDate) ms.targetDate = targetDate;
    if (newStatus === "Completed") {
      ms.completedDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    proj.lastUpdated = new Date().toISOString();
  }

  await addAuditLog(
    "Research Milestone Updated",
    "Dr. Arvind Verma",
    "MNSRI",
    `Project [${proj.projectCode}] milestone "${ms?.title}" updated to ${newStatus}.`,
    proj.projectCode,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await ResearchProjectModel.findOneAndUpdate(
        { projectCode: proj.projectCode },
        proj
      );
    } catch (e) {
      console.warn("DB research milestone update error:", e);
    }
  }

  return proj;
}

// ---------------- PUBLICATIONS ----------------
export async function getPublications(): Promise<Publication[]> {
  const db = await connectDB();
  if (db) {
    try {
      const docs = await PublicationModel.find().sort({ createdAt: -1 }).lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id,
        }));
      }
    } catch (e) {
      console.warn("DB publications read error:", e);
    }
  }
  return getStore().publications;
}

export async function createPublication(
  data: Partial<Publication>
): Promise<Publication> {
  const store = getStore();
  const id = `pub-${Date.now().toString(36)}`;

  const pub: Publication = {
    id,
    projectId: data.projectId || "proj-01",
    title: data.title || "Untitled Manuscript Draft",
    abstract: data.abstract || "",
    authors: data.authors || "Dr. Arvind Verma, Dr. Priya Sharma",
    journal: data.journal || "Indian Journal of Medical Research",
    status: data.status || "Draft",
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    submittedBy: data.submittedBy || "Researcher",
    documentRef: data.documentRef || `MNSRI-MANU-${Math.floor(100 + Math.random() * 900)}.pdf`,
  };

  store.publications.unshift(pub);

  // Also attach to matching research project if present
  const proj = store.researchProjects.find(
    (p) => p.id === pub.projectId || p.projectCode === pub.projectId
  );
  if (proj) {
    proj.publications.unshift(pub);
  }

  await addAuditLog(
    "Publication Manuscript Submitted",
    pub.submittedBy || "Lead Investigator",
    "MNSRI",
    `Publication draft "${pub.title}" submitted for peer review in ${pub.journal} (Status: ${pub.status}).`,
    pub.id,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await PublicationModel.create(pub);
      if (proj) {
        await ResearchProjectModel.findOneAndUpdate(
          { projectCode: proj.projectCode },
          proj
        );
      }
    } catch (e) {
      console.warn("DB publication insert error:", e);
    }
  }

  return pub;
}

export async function addProjectPublication(
  projectIdOrData: string | Partial<Publication>,
  maybePublication?: Partial<Publication>
): Promise<Publication> {
  if (typeof projectIdOrData === "string") {
    return createPublication({
      ...maybePublication,
      projectId: projectIdOrData,
    });
  }
  return createPublication(projectIdOrData);
}

export async function updatePublicationStatus(
  id: string,
  status: Publication["status"]
): Promise<Publication | null> {
  const store = getStore();
  const pub = store.publications.find((p) => p.id === id);
  if (!pub) return null;

  pub.status = status;

  await addAuditLog(
    "Publication Review Status Updated",
    "MNSRI Review Board",
    "MNSRI",
    `Publication draft "${pub.title}" review status changed to ${status}.`,
    pub.id,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await PublicationModel.findOneAndUpdate({ id }, { status });
    } catch (e) {
      console.warn("DB pub status error:", e);
    }
  }

  return pub;
}

// ---------------- USERS & AUTH ----------------
export async function getUsers(): Promise<User[]> {
  const db = await connectDB();
  if (db) {
    try {
      const docs = await UserModel.find().lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id,
        }));
      }
    } catch (e) {
      console.warn("DB users error:", e);
    }
  }
  return getStore().users;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id || u.email === id) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  department?: string;
}): Promise<User> {
  const store = getStore();
  const normalizedEmail = data.email.toLowerCase().trim();
  const existing = store.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (existing) {
    throw new Error("A user with this email address already exists.");
  }

  const id = `user-${data.role}-${Date.now().toString(36)}`;
  const passwordHash = data.password
    ? bcrypt.hashSync(data.password, 10)
    : bcrypt.hashSync("demo123", 10);

  const defaultDept: Record<UserRole, string> = {
    admin: "Executive Administration",
    doctor: "Neurology & Stroke Unit",
    receptionist: "Central Reception Desk",
    nurse: "AMMA Rural Clinic Outreach",
    researcher: "MNSRI Neuroscience Research",
    patient: "Outpatient & Public",
  };

  const newUser: User = {
    id,
    name: data.name.trim(),
    email: normalizedEmail,
    role: data.role,
    department: data.department || defaultDept[data.role] || "Clinical Services",
    active: true,
    passwordHash,
  };

  store.users.unshift(newUser);

  const db = await connectDB();
  if (db) {
    try {
      await UserModel.create({
        id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        passwordHash,
        active: true,
      });
    } catch (e: any) {
      console.warn("DB create user error:", e);
    }
  }

  await addAuditLog(
    "User Registered",
    newUser.name,
    "Admin",
    `New ${newUser.role.toUpperCase()} account registered: ${newUser.name} (${newUser.email}).`,
    newUser.id,
    "Success"
  );

  return newUser;
}

export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<User | null> {
  const store = getStore();
  const user = store.users.find((u) => u.id === userId || u.email === userId);
  if (!user) return null;

  user.role = newRole;

  await addAuditLog(
    "User Role Modified",
    "Admin Director",
    "Admin",
    `User ${user.name} role updated to ${newRole}.`,
    user.id,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await UserModel.findOneAndUpdate(
        { $or: [{ id: userId }, { email: userId }] },
        { role: newRole }
      );
    } catch (e) {
      console.warn("DB user update error:", e);
    }
  }

  return user;
}

export async function toggleUserActive(userId: string): Promise<User | null> {
  const store = getStore();
  const user = store.users.find((u) => u.id === userId || u.email === userId);
  if (!user) return null;

  user.active = user.active === false ? true : false;

  await addAuditLog(
    "User Status Toggled",
    "Admin Director",
    "Admin",
    `User ${user.name} active state changed to ${user.active}.`,
    user.id,
    "Success"
  );

  const db = await connectDB();
  if (db) {
    try {
      await UserModel.findOneAndUpdate(
        { $or: [{ id: userId }, { email: userId }] },
        { active: user.active }
      );
    } catch (e) {
      console.warn("DB user toggle error:", e);
    }
  }

  return user;
}

// ---------------- AUDIT LOGS ----------------
export async function getAuditLogs(): Promise<AuditLog[]> {
  const db = await connectDB();
  if (db) {
    try {
      const docs = await AuditLogModel.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();
      if (docs && docs.length > 0) {
        return docs.map((d: any) => ({
          ...d,
          id: d._id?.toString() || d.id,
          timestamp: d.createdAt || d.timestamp || new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn("DB audit read error:", e);
    }
  }
  return getStore().auditLogs;
}

export async function addAuditLog(
  action: string,
  actor: string,
  module: AuditLog["module"],
  details: string,
  recordRef?: string,
  outcome: "Success" | "Failed" | "Pending" = "Success"
): Promise<AuditLog> {
  const store = getStore();
  const log: AuditLog = {
    id: `log-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    action,
    actor,
    module,
    details,
    recordRef,
    outcome,
    timestamp: new Date().toISOString(),
  };

  store.auditLogs.unshift(log);
  if (store.auditLogs.length > 200) {
    store.auditLogs = store.auditLogs.slice(0, 200);
  }

  const db = await connectDB();
  if (db) {
    try {
      await AuditLogModel.create(log);
    } catch (e) {
      console.warn("DB audit log insert error:", e);
    }
  }

  return log;
}

// ---------------- ADMIN KPIS ----------------
export async function getAdminKPIs(): Promise<AdminKPIs> {
  const beds = await getBeds();
  const patients = await getPatients();
  const projects = await getResearchProjects();
  const referrals = await getReferrals();
  const publications = await getPublications();

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter((b) => b.status === "occupied").length;
  const availableBeds = beds.filter((b) => b.status === "available").length;
  const maintenanceBeds = beds.filter((b) => b.status === "maintenance").length;
  const cleaningBeds = beds.filter((b) => b.status === "cleaning").length;

  // Operational beds exclude maintenance
  const operationalBeds = totalBeds - maintenanceBeds;
  const occupancyPercentage =
    operationalBeds > 0
      ? Math.round((occupiedBeds / operationalBeds) * 100)
      : 0;

  const activeAmmaReferrals = referrals.filter(
    (r) => r.source === "AMMA_Clinic" && r.status === "Pending_Arrival"
  ).length;

  const pendingReceptionActions =
    patients.filter((p) => p.status === "Reception_Waiting").length +
    referrals.filter((r) => r.status === "Arrived").length;

  const criticalPatients =
    patients.filter((p) => p.urgency === "Critical").length +
    referrals.filter((r) => r.urgency === "Critical").length;

  const strokeTrialsEnrolled = projects.reduce(
    (acc, cur) => acc + (cur.cohortSize?.enrolled || 0),
    0
  );

  const pendingPublications = publications.filter(
    (p) => p.status === "Draft" || p.status === "Under Review"
  ).length;

  return {
    totalBeds,
    occupiedBeds,
    availableBeds,
    maintenanceBeds,
    cleaningBeds,
    occupancyPercentage,
    dailyOpdVolume: 142 + patients.length,
    activeAmmaReferrals,
    ongoingResearchProjects: projects.length,
    pendingPublications,
    pendingReceptionActions,
    criticalPatients,
    strokeTrialsEnrolled,
  };
}

// ---------------- SEED & RESET ----------------
export async function resetAndSeed(): Promise<{ message: string; counts: Record<string, number> }> {
  // Reset in-memory store
  global.__hmsStore = {
    users: JSON.parse(JSON.stringify(initialUsers)),
    patients: JSON.parse(JSON.stringify(initialPatients)),
    beds: JSON.parse(JSON.stringify(initialBeds)),
    encounters: JSON.parse(JSON.stringify(initialEncounters)),
    researchProjects: JSON.parse(JSON.stringify(initialResearchProjects)),
    auditLogs: JSON.parse(JSON.stringify(initialAuditLogs)),
    appointments: JSON.parse(JSON.stringify(initialAppointments)),
    referrals: JSON.parse(JSON.stringify(initialReferrals)),
    admissions: JSON.parse(JSON.stringify(initialAdmissions)),
    publications: JSON.parse(JSON.stringify(initialPublications)),
  };

  const counts: Record<string, number> = {
    users: initialUsers.length,
    patients: initialPatients.length,
    beds: initialBeds.length,
    encounters: initialEncounters.length,
    researchProjects: initialResearchProjects.length,
    auditLogs: initialAuditLogs.length,
    appointments: initialAppointments.length,
    referrals: initialReferrals.length,
    admissions: initialAdmissions.length,
    publications: initialPublications.length,
  };

  const db = await connectDB();
  if (db) {
    try {
      await UserModel.deleteMany({});
      await UserModel.insertMany(initialUsers);

      await PatientModel.deleteMany({});
      await PatientModel.insertMany(initialPatients);

      await BedModel.deleteMany({});
      await BedModel.insertMany(initialBeds);

      await EncounterModel.deleteMany({});
      await EncounterModel.insertMany(initialEncounters);

      await ResearchProjectModel.deleteMany({});
      await ResearchProjectModel.insertMany(initialResearchProjects);

      await AuditLogModel.deleteMany({});
      await AuditLogModel.insertMany(initialAuditLogs);

      await AppointmentModel.deleteMany({});
      await AppointmentModel.insertMany(initialAppointments);

      await ReferralModel.deleteMany({});
      await ReferralModel.insertMany(initialReferrals);

      await AdmissionModel.deleteMany({});
      await AdmissionModel.insertMany(initialAdmissions);

      await PublicationModel.deleteMany({});
      await PublicationModel.insertMany(initialPublications);
    } catch (e) {
      console.warn("DB seed error:", e);
    }
  }

  return {
    message: "Hospital and research database seeded successfully with all clinical, operational, and research records.",
    counts,
  };
}
