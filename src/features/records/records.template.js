/* ==========================================================================
   Dentiva EMR & Medical Records Templates (records.template.js)
   Visual clinical timelines, patient directory, and record authoring modals.
   ========================================================================== */

import { state } from '../../core/state.js';
import { db } from '../../core/db.js';

export function renderPatientRecordsTimeline(records) {
  if (records.length === 0) {
    return `<div style="text-align: center; color: var(--text-muted); padding: 40px; background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md);">Your patient electronic medical record is clean. No visits logged yet.</div>`;
  }

  return `
    <div class="timeline">
      ${records.map(rec => {
        const attachHtml = rec.attachments && rec.attachments.length > 0 
          ? `<div class="timeline-attachments">
              ${rec.attachments.map(att => `
                <a href="${att.dataUrl}" target="_blank" class="attachment-badge" title="View attached document or dental X-ray">
                  <i data-lucide="image" style="width:14px; height:14px;"></i>
                  <span>${att.name}</span>
                </a>
              `).join('')}
             </div>`
          : '';

        return `
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content-card">
              <div class="timeline-header">
                <span class="timeline-date"><i data-lucide="calendar" style="width:12px; height:12px; vertical-align:middle; margin-right:4px;"></i>${rec.date}</span>
                <span class="timeline-dr"><i data-lucide="user" style="width:12px; height:12px; vertical-align:middle; margin-right:4px;"></i>Prescribed by: ${rec.doctorName}</span>
              </div>
              <h4 class="timeline-diag">${rec.diagnosis}</h4>
              <p class="timeline-treatment"><strong>Treatment Administered:</strong> ${rec.treatment}</p>
              
              <div class="timeline-rx-box">
                <div class="timeline-rx-label">Clinical Prescription (Rx)</div>
                <div class="timeline-rx-content" style="white-space: pre-line;">${rec.prescription}</div>
              </div>
              
              ${rec.notes ? `<p class="timeline-notes"><strong>Doctor Instructions:</strong> ${rec.notes}</p>` : ''}
              ${attachHtml}
              
              <button class="btn-secondary" style="margin-top: 15px;" data-print-prescription-id="${rec.id}">
                <i data-lucide="printer"></i> Download PDF / Print Prescription
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function renderAddRecordModal() {
  const patient = db.get('users').find(u => u.id === state.selectedPatientId);
  const cache = state.forms.addRecord;

  const fileUploadedHtml = cache.attachments.map(att => `
    <div class="preview-attachment-box">
      <span style="font-weight: 600; overflow:hidden; text-overflow:ellipsis; max-width: 300px;">${att.name}</span>
      <span style="color: var(--success); font-size: 0.75rem; font-weight:700;"><i data-lucide="check-circle" style="vertical-align: middle; width:14px;"></i> Ready</span>
    </div>
  `).join('');

  return `
    <form id="add-record-form" data-patient-id="${state.selectedPatientId}">
      <div class="form-group">
        <label class="form-label">Clinical Diagnosis</label>
        <input type="text" id="record-diagnosis" class="form-input" style="padding-left: 16px;" placeholder="e.g. Tooth #14 Deep Dental Caries" value="${cache.diagnosis}" required>
      </div>

      <div class="form-group">
        <label class="form-label">Treatment Rendered</label>
        <input type="text" id="record-treatment" class="form-input" style="padding-left: 16px;" placeholder="e.g. Excavated decay and placed Composite Resin" value="${cache.treatment}" required>
      </div>

      <div class="form-group">
        <label class="form-label">Prescription (Rx Instructions)</label>
        <textarea id="record-prescription" class="form-input" style="padding-left: 16px; min-height: 120px; font-family: monospace;" placeholder="Format:\nMedication Name 500mg\n- 1 tablet 3 times a day for 7 days" required>${cache.prescription}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Additional Doctor Clinical Notes</label>
        <textarea id="record-notes" class="form-input" style="padding-left: 16px; min-height: 70px;" placeholder="e.g. Patient advised to floss regularly. Schedule crown followup in 2 weeks...">${cache.notes}</textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Attach Lab Reports / Dental X-Rays</label>
        <input type="file" id="real-file-input" style="display: none;" accept="image/*,application/pdf">
        <div class="file-upload-zone" id="file-upload-zone-trigger">
          <i data-lucide="cloud-upload" class="upload-icon"></i>
          <p>Drag and drop or <span>Browse Files</span> to upload report</p>
          <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Supported: PNG, JPG, PDF (encoded directly in EMR chart)</p>
        </div>
        ${fileUploadedHtml}
      </div>

      <button type="submit" class="btn-primary" style="margin-top: 20px;">
        <i data-lucide="folder-plus"></i> Save to Electronic Health Record
      </button>
    </form>
  `;
}
