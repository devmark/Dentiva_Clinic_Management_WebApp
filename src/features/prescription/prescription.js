/* ==========================================================================
   Dentiva Prescription Controller (prescription.js)
   Extracts clinical prescription details, populates template, and prints/saves PDF.
   ========================================================================== */

import { db } from '../../core/db.js';
import { state } from '../../core/state.js';
import { buildPrescriptionDocument } from './prescription.template.js';

export function printPrescription(recordId) {
  const records = db.get('records');
  const record = records.find(r => r.id === recordId);
  if (!record) return;

  const users = db.get('users');
  const patient = users.find(u => u.id === record.patientId);
  const doctor = users.find(u => u.name === record.doctorName);
  const doctorLicense = doctor?.license || state.user?.license || 'DDS-2026-001';

  const printContainer = document.getElementById('prescription-print-template');
  if (printContainer) {
    printContainer.innerHTML = buildPrescriptionDocument(record, patient, doctorLicense);
    // Trigger native browser print dialog (supports Save as PDF or physical print)
    window.print();
  }
}

export function bindPrescriptionEvents() {
  const printBtns = document.querySelectorAll('[data-print-prescription-id]');
  printBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const recId = btn.dataset.printPrescriptionId;
      printPrescription(recId);
    });
  });
}
