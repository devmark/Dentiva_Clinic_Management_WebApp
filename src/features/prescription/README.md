# Prescription Engine & PDF Export (`src/features/prescription`)

The Prescription module dynamically formats clinical medical prescriptions into a print-ready, legally compliant document with doctor credentials, clinic licensing, structured dosage tables, and digital signature stamps.

---

## Architecture

```
src/features/prescription/
├── prescription.js          # Controller: record parsing, print lifecycle management
├── prescription.template.js # Official Rx layout (clinic header, meta grid, Rx table, signature)
└── README.md                # Feature specifications and customer demo guide
```

---

## Technical Details

1. **Intelligent Text-to-Table Parser**:
   - Converts clinical dosage text into formatted rows:
     ```
     Amoxicillin 500mg
     - 1 capsule 3 times daily for 7 days
     ```
     Lines with drug names receive bold headers; hyphenated instructions are styled into indented dosage guidelines.

2. **Zero-Dependency Vector Quality**:
   - Instead of rasterizing to pixelated canvases, it utilizes pure HTML/CSS rendered into a dedicated `#prescription-print-template` block.
   - When `@media print` triggers via `window.print()`, all application dashboard frames, sidebars, buttons, and badges are suppressed, displaying only the pristine letterhead document.
   - Users can select **"Save as PDF"** or choose any connected office printer.

3. **Medical Compliance Details**:
   - Clinic address, emergency telephone line, doctor DDS state license number, patient calculated age/gender, and electronic signature stamp `[E-SIGNED VIA PORTAL]`.

---

## How to Demo to a Customer

1. **From Patient Dashboard**:
   - Log in as **Subhajit Dey (Patient)**.
   - On the Overview card under **Latest Medical Diagnosis**, or in the **Medical History** tab, locate the **Download PDF / Print Prescription** button.
   - Click the button.
   - Show the customer how the native browser Print Preview opens immediately with a crisp, official medical prescription ready to save as PDF or print.
2. **From Doctor EMR View**:
   - Log in as **Dr. Dentist**, open any patient record, and click **Download PDF**.
