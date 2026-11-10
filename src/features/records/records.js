/* ==========================================================================
   Dentiva Medical Records & EMR Controller (records.js)
   Electronic Medical Chart management, file attachments, and clinical timeline.
   ========================================================================== */

import { db } from '../../core/db.js';
import { state, notifyStateChange } from '../../core/state.js';
import { toast, addNotification } from '../../core/notifications.js';

export function addMedicalRecord(patientId, diagnosis, treatment, prescription, notes, attachments) {
  if (!diagnosis || !treatment || !prescription) {
    toast("Please complete the diagnosis, treatment, and prescription fields.", "warning");
    return false;
  }

  const records = db.get('records');
  const newRecord = {
    id: `rec_${Date.now()}`,
    patientId,
    date: new Date().toISOString().split('T')[0],
    diagnosis,
    treatment,
    prescription,
    notes: notes || '',
    doctorName: state.user.name,
    attachments: attachments || []
  };

  records.push(newRecord);
  db.set('records', records);

  // Notify Patient
  addNotification(
    patientId,
    `A new medical record & prescription has been added to your EMR chart by ${state.user.name}.`,
    'record'
  );

  // Reset form cache and close modal
  state.forms.addRecord = { diagnosis: '', treatment: '', prescription: '', notes: '', attachments: [] };
  state.activeModal = null;
  
  toast("Medical record published to patient EMR", "success");
  notifyStateChange();
  return true;
}

export function bindRecordEvents() {
  // Open Add Record Modal (Doctor view)
  const openRecordModalBtn = document.getElementById('btn-open-record-modal');
  if (openRecordModalBtn) {
    openRecordModalBtn.addEventListener('click', () => {
      state.activeModal = 'add-record';
      notifyStateChange();
    });
  }

  // Form Fields Caching
  const diagInput = document.getElementById('record-diagnosis');
  if (diagInput) {
    diagInput.addEventListener('input', () => {
      state.forms.addRecord.diagnosis = diagInput.value;
    });
  }
  const treatmentInput = document.getElementById('record-treatment');
  if (treatmentInput) {
    treatmentInput.addEventListener('input', () => {
      state.forms.addRecord.treatment = treatmentInput.value;
    });
  }
  const rxInput = document.getElementById('record-prescription');
  if (rxInput) {
    rxInput.addEventListener('input', () => {
      state.forms.addRecord.prescription = rxInput.value;
    });
  }
  const notesInput = document.getElementById('record-notes');
  if (notesInput) {
    notesInput.addEventListener('input', () => {
      state.forms.addRecord.notes = notesInput.value;
    });
  }

  // File / Panoramic X-ray Base64 Uploader
  const fileZone = document.getElementById('file-upload-zone-trigger');
  const fileInput = document.getElementById('real-file-input');
  if (fileZone && fileInput) {
    fileZone.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          state.forms.addRecord.attachments.push({
            name: file.name,
            dataUrl: event.target.result // Base64 data URL
          });
          toast(`File "${file.name}" uploaded successfully`, "success");
          notifyStateChange();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Record Form Submission
  const recordForm = document.getElementById('add-record-form');
  if (recordForm) {
    recordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cache = state.forms.addRecord;
      const patientId = recordForm.dataset.patientId;
      addMedicalRecord(
        patientId,
        cache.diagnosis,
        cache.treatment,
        cache.prescription,
        cache.notes,
        cache.attachments
      );
    });
  }

  // Back to Patients list
  const backToPatients = document.getElementById('btn-back-patients');
  if (backToPatients) {
    backToPatients.addEventListener('click', () => {
      state.selectedPatientId = null;
      notifyStateChange();
    });
  }

  // Patient Directory Instant Search
  const searchInput = document.getElementById('patient-search-input');
  if (searchInput) {
    searchInput.value = state.patientSearchQuery;
    searchInput.addEventListener('input', () => {
      state.patientSearchQuery = searchInput.value;
      const tableBody = document.querySelector('#patients-table-body');
      if (tableBody) {
        const patients = db.get('users').filter(u => u.role === 'patient');
        const q = state.patientSearchQuery.toLowerCase();
        const filtered = patients.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.includes(state.patientSearchQuery)
        );
        
        if (filtered.length === 0) {
          tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">No patients found matching your search.</td></tr>`;
        } else {
          tableBody.innerHTML = filtered.map(pat => `
            <tr data-patient-id="${pat.id}" style="cursor: pointer;">
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.85rem;">${pat.avatar}</div>
                  <strong>${pat.name}</strong>
                </div>
              </td>
              <td>${pat.dob || 'N/A'}</td>
              <td>${pat.gender || 'N/A'}</td>
              <td>${pat.phone}</td>
              <td>${pat.email}</td>
            </tr>
          `).join('');
          
          tableBody.querySelectorAll('tr[data-patient-id]').forEach(row => {
            row.addEventListener('click', () => {
              state.selectedPatientId = row.dataset.patientId;
              notifyStateChange();
            });
          });
        }
      }
    });
  }

  // Patient Directory row click
  const patientRows = document.querySelectorAll('.custom-table tr[data-patient-id]');
  patientRows.forEach(row => {
    row.addEventListener('click', () => {
      state.selectedPatientId = row.dataset.patientId;
      state.currentTab = 'patients';
      notifyStateChange();
    });
  });
}
