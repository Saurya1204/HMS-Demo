export type UserRole =
  | "receptionist"
  | "doctor"
  | "nurse"
  | "researcher"
  | "admin"
  | "patient";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash?: string;
  department?: string;
  avatarUrl?: string;
  active?: boolean;
}

export type PatientSource = "Direct" | "AMMA_Clinic" | "Peripheral_PHC";
export type UrgencyLevel = "Routine" | "Urgent" | "Critical";
export type PatientStatus =
  | "Referred_AMMA"
  | "Reception_Waiting"
  | "In_Consultation"
  | "Admitted_IPD"
  | "Discharged";

export interface Vitals {
  bp: string; // e.g. "140/90"
  spo2: number; // e.g. 96
  pulse: number; // e.g. 84
  temp?: number; // e.g. 98.6
}

export interface Patient {
  _id?: string;
  id: string;
  patientId: string; // e.g. "SBM-2026-1042"
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contact: string;
  village?: string;
  tokenQr: string; // e.g. "AMMA-TK-8823"
  source: PatientSource;
  urgency: UrgencyLevel;
  status: PatientStatus;
  vitals: Vitals;
  symptoms: string[];
  fastAssessment?: {
    faceDroop: boolean;
    armWeakness: boolean;
    slurredSpeech: boolean;
    timeToActHours?: number;
  };
  notes?: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  assignedBedId?: string;
  assignedBedNumber?: string;
  assignedWard?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string; // "OD", "BD", "TID", "SOS"
  duration: string; // "5 days", "14 days", "1 month"
  instructions?: string;
}

export interface Encounter {
  _id?: string;
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  type: "OPD" | "IPD";
  status: "Draft" | "Completed" | "Admitted";
  vitals: Vitals;
  diagnosis: string;
  icdCodes: string[];
  prescriptions: PrescriptionItem[];
  labOrders: string[];
  clinicalNotes: string;
  bedAdmissionOrdered?: boolean;
  admittedWard?: string;
  admittedBedNumber?: string;
  createdAt: string;
}

export type BedStatus = "available" | "occupied" | "maintenance" | "cleaning";
export type WardType =
  | "Stroke ICU"
  | "Neuro Recovery"
  | "General Male"
  | "General Female";

export interface Bed {
  _id?: string;
  id: string;
  bedNumber: string; // e.g. "ICU-01", "REC-04"
  wardName: WardType;
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  currentPatientAge?: number;
  currentPatientGender?: string;
  admittedDiagnosis?: string;
  assignedDoctor?: string;
  admissionDate?: string;
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  status: "Pending" | "In_Progress" | "Completed";
  targetDate: string;
  dueDate?: string;
  completedDate?: string;
  description?: string;
}

export interface Publication {
  id: string;
  projectId?: string;
  title: string;
  abstract?: string;
  authors: string;
  journal: string;
  status: "Draft" | "Under Review" | "Approved" | "Published" | "Rejected";
  date: string;
  submittedBy?: string;
  documentRef?: string;
}

export interface ResearchProject {
  _id?: string;
  id: string;
  projectCode: string; // e.g. "MNSRI-NPRS-01"
  title: string;
  leadInvestigator: string;
  leadInvestigatorRole: string;
  category: "Stroke Recovery" | "Neuroplasticity" | "Endovascular AI" | "Tele-Neuro";
  description: string;
  cohortSize: {
    enrolled: number;
    target: number;
  };
  patientCount?: number;
  progress?: number;
  milestones: Milestone[];
  publications: Publication[];
  status: "Active" | "Recruiting" | "Completed" | "Review";
  lastUpdated: string;
}

export interface Appointment {
  _id?: string;
  id: string;
  patientId?: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  contact: string;
  department: string;
  doctorName: string;
  date: string;
  slot: string;
  reason: string;
  status: "Scheduled" | "Checked_In" | "Completed" | "Cancelled";
  tokenNumber: string;
  createdAt: string;
}

export interface Referral {
  _id?: string;
  id: string;
  referralNumber: string; // e.g. "REF-AMMA-9021"
  patientId: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  contact: string;
  village: string;
  source: PatientSource;
  urgency: UrgencyLevel;
  symptoms: string[];
  vitals: Vitals;
  status: "Pending_Arrival" | "Arrived" | "OPD_Registered" | "Admitted_IPD";
  arrivalTime?: string;
  notes?: string;
  createdAt: string;
}

export interface Admission {
  _id?: string;
  id: string;
  admissionNumber: string; // e.g. "ADM-2026-081"
  patientId: string;
  patientName: string;
  bedId: string;
  bedNumber: string;
  wardName: WardType;
  admittingDoctor: string;
  diagnosis: string;
  admissionDate: string;
  dischargeDate?: string;
  status: "Admitted" | "Transferred" | "Discharged";
  createdAt: string;
}

export interface AuditLog {
  _id?: string;
  id: string;
  action: string;
  actor: string;
  module: "AMMA" | "Reception" | "Doctor" | "BedBoard" | "MNSRI" | "Admin" | "Appointments";
  details: string;
  recordRef?: string;
  outcome?: "Success" | "Failed" | "Pending";
  timestamp: string;
}

export interface AdminKPIs {
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  maintenanceBeds: number;
  cleaningBeds: number;
  occupancyPercentage: number;
  dailyOpdVolume: number;
  activeAmmaReferrals: number;
  ongoingResearchProjects: number;
  pendingPublications: number;
  pendingReceptionActions: number;
  criticalPatients: number;
  strokeTrialsEnrolled: number;
}
