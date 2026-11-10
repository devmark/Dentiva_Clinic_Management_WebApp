# Electronic Medical Records (EMR) & Clinical History (`src/features/records`)

This module manages HIPAA-compliant dental health charts, diagnostic histories, treatments, clinical notes, and multimedia attachments (panoramic X-rays and dental scans).

---

## Architecture

```
src/features/records/
├── records.js          # Controller: record creation, file attachment parser, search filter
├── records.template.js # Timeline view, add-record modal, patient EMR layout
└── README.md           # Documentation, data specs, and customer walkthrough
```

---

## Core Capabilities

1. **Patient EMR Timeline**:
   - Displays historical consultations chronologically.
   - Distinct sections for **Diagnosis**, **Treatment Rendered**, **Active Prescriptions (Rx)**, and **Doctor Clinical Instructions**.

2. **Attachment & Dental X-Ray Ingestion**:
   - Supports uploading image scans (PNG, JPG) or reports (PDF).
   - Ingests files via the HTML5 `FileReader` API into Base64 Data URLs so attachments persist in `localStorage` without requiring an S3/storage backend.
   - Clickable badges allow reviewing the attached X-rays in a new browser tab.

3. **Doctor Patient Search**:
   - Instant real-time filtering by Patient Name, Phone Number, or Email address without full-page reloads.

---

## How to Demo to a Customer

1. **Doctor EMR Charting**:
   - Log in as **Dr. Dentist**.
   - Navigate to **Patient EMRs** in the sidebar.
   - Use the search bar to type `Mark` or `Subhajit`.
   - Click on a patient's row to open their full clinical chart.
   - Click **Add EMR Chart Entry**.
   - Fill in Diagnosis (e.g., `Tooth #19 Cracked Tooth Syndrome`), Treatment, Rx, and optionally click or drag a local dental X-ray/image into the upload box.
   - Click **Save to Electronic Health Record**.
2. **Patient Review**:
   - Log out and log in as that patient.
   - Navigate to **Medical History** to inspect the new chronological entry and view attached scans.
