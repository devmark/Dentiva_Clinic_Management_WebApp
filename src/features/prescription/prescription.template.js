/* ==========================================================================
   Dentiva Prescription Print Template (prescription.template.js)
   Official Rx medical document layout designed for standard A4/Letter PDF print.
   ========================================================================== */

export function buildPrescriptionDocument(record, patient, doctorLicense = 'DDS-2026-001') {
  const rxTableRows = record.prescription
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => {
      if (line.startsWith('-')) {
        return `<tr><td style="padding-left: 20px; font-style: italic; color: #555;">${line}</td></tr>`;
      }
      return `<tr><td style="font-weight: bold; border-top: 1px solid #eee; padding-top: 10px;">${line}</td></tr>`;
    })
    .join('');

  const patientAge = patient && patient.dob 
    ? Math.floor((new Date() - new Date(patient.dob)) / 31557600000) 
    : 'N/A';
  const patientGender = patient ? patient.gender : 'N/A';

  return `
    <div class="print-header">
      <div class="print-clinic-logo">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #2563eb;">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15v-5m0-4h.01"></path>
        </svg>
        <span>DENTIVA</span>
      </div>
      <div class="print-clinic-details">
        <strong>Dentiva Dental Orthodontics</strong><br>
        104 Medical Plaza Drive, Suite B<br>
        Phone: +1 (555) 010-9900 | support@dentiva.com<br>
        License #: CLIN-99824-OH
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="font-size: 16pt; text-transform: uppercase; letter-spacing: 1px;">Official Medical Prescription</h2>
    </div>

    <div class="print-meta-grid">
      <div class="print-meta-item">
        <span class="print-meta-label">Patient Name</span><br>
        <strong>${patient ? patient.name : 'Unknown Patient'}</strong>
      </div>
      <div class="print-meta-item">
        <span class="print-meta-label">Date of Issue</span><br>
        <strong>${record.date}</strong>
      </div>
      <div class="print-meta-item">
        <span class="print-meta-label">Age / Gender</span><br>
        <strong>${patientAge} yrs / ${patientGender}</strong>
      </div>
      <div class="print-meta-item">
        <span class="print-meta-label">Doctor in Charge</span><br>
        <strong>${record.doctorName} (${doctorLicense})</strong>
      </div>
    </div>

    <div class="print-prescription-section">
      <div class="print-rx-symbol">Rx</div>
      <table class="print-table">
        <thead>
          <tr>
            <th style="text-align: left;">Medication & Instructions</th>
          </tr>
        </thead>
        <tbody>
          ${rxTableRows}
        </tbody>
      </table>
    </div>

    <div class="print-notes-section">
      <div class="print-notes-title">Clinical Notes & Diagnostics</div>
      <p><strong>Diagnosis:</strong> ${record.diagnosis}</p>
      <p><strong>Treatment Rendered:</strong> ${record.treatment}</p>
      <p style="margin-top: 10px; color: #444;"><strong>Instructions:</strong> ${record.notes || 'None'}</p>
    </div>

    <div class="print-footer">
      <div>
        <em>This prescription is electronically signed and secured by Dentiva EHR.</em>
      </div>
      <div class="print-signature-block">
        <div style="font-family: 'Courier New', monospace; font-size: 10pt; color: #555;">[E-SIGNED VIA PORTAL]</div>
        <strong>${record.doctorName}</strong><br>
        Prescribing Orthodontist
      </div>
    </div>
  `;
}
