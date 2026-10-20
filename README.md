# SBM Hospitals + MNSRI Digital Platform Demo

> **Tertiary Hospital Healthcare & Neuroscience Research Digital Platform**  
> Serving the Maharajganj–Raebareli region of Uttar Pradesh, India.

---

## 1. Project Overview

The **Unified SBM Hospitals + MNSRI Digital Platform** brings together:
1. **SBM Hospitals**: Tertiary clinical inpatient care, 24/7 Stroke ICU, specialized inpatient wards, and central outpatient departments.
2. **AMMA Digital Clinics**: Rural peripheral tele-triage network connecting 42 village health outposts in southern Uttar Pradesh with privacy-preserving digital QR referral tokens.
3. **Maharajganj Neuroscience & Stroke Research Institute (MNSRI)**: Dedicated neuroscience research center running clinical trials, 5-phase milestone tracking, Lancet manuscript reviews, and PubMed literature synthesis.

---

## 2. Product Architecture & Navigation Flow

### A. Public Website
- `/` — **Homepage** (Institutional overview, key specialties, AMMA outreach, OPD slot booking, neuroscience research highlights, 5-step care pathways, community benefits, campus location, and footer).
- `/services` — **Hospital & Diagnostic Services** with category filters and booking actions.
- `/about` — **Institutional Background & Leadership** (SBM Hospitals, MNSRI Research Wing, AMMA Rural outreach).
- `/amma-clinic` — **AMMA Digital Clinic Overview** with interactive FAST stroke assessment and rural referral network.
- `/research` — **Neuroscience Research Overview** showcasing clinical studies, publications, and academic partnerships.
- `/appointments` — **OPD Specialist Appointments** with digital token pass generation.
- `/contact` — **Campus Location & Emergency Helpline** with interactive inquiry form.
- `/patient-portal` — **Patient & Family Portal** with QR patient badge, active appointments, prescribed medications, and vitals history.

### B. Hospital Operations (Role-Protected)
- `/clinic` — **AMMA Digital Clinic Intake**: Peripheral clinic intake with BP, Pulse, SpO2, FAST screening, and privacy-preserving QR referral generation.
- `/reception` — **Hospital Central Reception**: Inbound referrals from AMMA clinics, live OPD/IPD triage queue, appointment check-ins, and walk-in intake.
- `/doctor` — **Doctor Clinical EMR**: Attending clinician console with patient vitals chart, ICD-10 diagnostic coding, digital prescription builder, laboratory orders, and inpatient admission requests.
- `/bed-board` — **Inpatient Bed & Ward Management**: Real-time bed board across Stroke ICU, Neuro Recovery, General Male, and General Female wards with patient assignment, transfers, and discharges.

### C. Administration & Research
- `/research-portal` — **MNSRI Research Dashboard**: Active clinical studies, 5-stage milestone stepper (auto-recalculating progress), manuscript submission, and AI Neuroscience Explorer.
- `/admin` — **Hospital Executive Dashboard**: Live operational KPIs, bed occupancy telemetry, census exports, and master audit ledger.
- `/admin/users` — **User & Role Management (RBAC)**: Manage staff roles, active statuses, and access permissions.
- `/admin/audit-logs` — **Immutable Audit History**: Chronological log of clinical, operational, and research mutations.

---

## 3. Technology Stack

- **Framework**: Next.js App Router (v16.4.2)
- **Language**: TypeScript with strict mode
- **UI & Components**: React 19, Tailwind CSS, Lucide React
- **Database**: MongoDB with Mongoose
- **Tokens & QR Codes**: `qrcode.react` (privacy-preserving opaque identifiers)
- **Security**: `bcryptjs` password hashing, server-side role authorization
- **State & Data Store**: Hybrid MongoDB persistence with in-memory resilient fallback

---

## 4. Setup & Running Locally

### Prerequisites
- Node.js 18+ or 20+
- Local MongoDB running on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI)

### Step 1: Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Ensure `.env.local` contains:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/sbm_mnsri_hospital
NEXTAUTH_SECRET=sbm_mnsri_super_secret_session_key_2026_demo
NODE_ENV=development
```

### Step 2: Seed Database
Populate MongoDB with realistic demo personas, clinical cases, beds, research trials, and audit logs:
```bash
npm run seed
```

### Step 3: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Production Build & Run
To test the optimized production build:
```bash
npm run build
npm run start
```

---

## 5. Seeded Demo Personas

| Role | Name | Email | Password | Primary Workspace |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Col. R. Singh (Retd.) | `admin.director@sbmhospitals.org` | `demo123` | `/admin` |
| **Doctor** | Dr. Priya Sharma, MD | `priya.sharma@sbmhospitals.org` | `demo123` | `/doctor` |
| **Receptionist** | Rajesh Kumar | `rajesh.k@sbmhospitals.org` | `demo123` | `/reception` |
| **Nurse (Field)** | Sunita Devi (ANM) | `sunita.amma@sbmhospitals.org` | `demo123` | `/clinic` |
| **Researcher** | Dr. Arvind Verma, PhD | `arvind.verma@mnsri.edu.in` | `demo123` | `/research-portal` |
| **Patient** | Ramesh Patel | `ramesh.patel@gmail.com` | `demo123` | `/patient-portal` |

*Note: You can switch between personas directly in the UI using the **Staff Login** button in the header.*

---

## 6. End-to-End Demo Journey

1. **Public Website**: Open `/` and view the unified institution overview, services, research highlights, and 5-step care pathways.
2. **AMMA Rural Intake**: Sign in as Sunita Devi (Nurse) or navigate to `/clinic`. Enter patient vitals, check FAST stroke signs, and click **Generate Digital QR & Transmit Referral**.
3. **Hospital Reception**: Navigate to `/reception`. The referral appears immediately under **Inbound Referrals** with a `From AMMA Clinic` badge. Click **Admit to OPD Queue**.
4. **Doctor Consultation**: Navigate to `/doctor`. Open the patient encounter, review vitals, assign ICD-10 diagnosis (`I63.9`), prescribe medication, and click **Request Inpatient Admission** to allocate a Stroke ICU bed.
5. **Bed Board Management**: Navigate to `/bed-board`. In the **Stroke ICU** tab, the assigned bed is now marked as occupied with patient demographics and attending physician.
6. **MNSRI Research**: Navigate to `/research-portal`. Toggle a study milestone status to recalculate overall project progress, and submit a publication draft for review.
7. **Admin Analytics**: Navigate to `/admin`. Verify the updated bed occupancy, registered patient count, active referrals, and immutable audit logs.

---

## 7. Safety & Compliance Notice

This application is a **client-ready demonstration prototype** developed for presentation and workflow validation. All patient names, medical histories, ICD-10 diagnostic codes, trial cohorts, and emergency contact numbers represent synthetic demonstration content and must not be used for autonomous medical diagnosis or clinical emergencies.
