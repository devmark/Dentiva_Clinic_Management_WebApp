/* ==========================================================================
   Dentiva Appointments View Templates (appointments.template.js)
   Modals and table grids for consultation reservations.
   ========================================================================== */

import { state } from '../../core/state.js';

export function renderBookingModal() {
  const formState = state.forms.bookAppointment;
  const today = new Date().toISOString().split('T')[0];
  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  return `
    <form id="book-appointment-form">
      <div class="form-group">
        <label class="form-label">Select Consult Date</label>
        <div class="form-input-wrapper">
          <i data-lucide="calendar" class="form-icon"></i>
          <input type="date" id="book-date" class="form-input" min="${today}" value="${formState.date}" required>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Available Time Slot</label>
        <div class="slots-grid">
          ${timeSlots.map(t => {
            const isSel = formState.time === t;
            return `<div class="slot-option ${isSel ? 'selected' : ''}" data-time="${t}">${t}</div>`;
          }).join('')}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Primary Symptom / Reason</label>
        <select id="book-reason" class="form-input" style="padding-left: 16px;" required>
          <option value="" disabled ${!formState.reason ? 'selected' : ''}>-- Select Service --</option>
          <option value="Regular Dental Checkup" ${formState.reason === 'Regular Dental Checkup' ? 'selected' : ''}>Regular Dental Checkup</option>
          <option value="Deep Scaling & Polishing" ${formState.reason === 'Deep Scaling & Polishing' ? 'selected' : ''}>Deep Scaling & Polishing</option>
          <option value="Cavity Extraction / Filling" ${formState.reason === 'Cavity Extraction / Filling' ? 'selected' : ''}>Cavity Extraction / Filling</option>
          <option value="Root Canal Therapy" ${formState.reason === 'Root Canal Therapy' ? 'selected' : ''}>Root Canal Therapy</option>
          <option value="Wisdom Tooth Pain Consultation" ${formState.reason === 'Wisdom Tooth Pain Consultation' ? 'selected' : ''}>Wisdom Tooth Pain Consultation</option>
          <option value="Teeth Whitening" ${formState.reason === 'Teeth Whitening' ? 'selected' : ''}>Teeth Whitening</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Patient Notes (Optional)</label>
        <textarea id="book-notes" class="form-input" style="padding-left: 16px; min-height: 80px;" placeholder="Add details e.g., pain scale, historical treatments...">${formState.notes}</textarea>
      </div>
      
      <button type="submit" class="btn-primary" style="margin-top: 15px;">
        <i data-lucide="check"></i> Confirm Reservation Request
      </button>
    </form>
  `;
}

export function renderPatientAppointmentsView(appointments) {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h2>My Consultations</h2>
        <p>Track history and real-time status of your clinic bookings.</p>
      </div>
      <button class="btn-primary" id="btn-open-book-modal">
        <i data-lucide="plus-circle"></i> Book New Consultation
      </button>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Your Appointments Calendar Entries</h3>
      </div>
      <div class="card-body" style="padding: 0;">
        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Clinic Doctor</th>
                <th>Reason / Service</th>
                <th>Patient Notes</th>
                <th>Status Badge</th>
              </tr>
            </thead>
            <tbody>
              ${appointments.length === 0 
                ? `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">No appointments booked. Click "Book New Consultation" to reserve a slot.</td></tr>`
                : appointments.map(a => `
                    <tr>
                      <td><strong>${a.dateTime.replace('T', ' ')}</strong></td>
                      <td>${a.doctorName}</td>
                      <td>${a.reason}</td>
                      <td style="color: var(--text-muted); font-size:0.85rem; font-style:italic; max-width: 250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${a.notes || ''}">
                        "${a.notes || 'None'}"
                      </td>
                      <td><span class="badge ${a.status}">${a.status}</span></td>
                    </tr>
                  `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function renderDoctorAppointmentsView(appointments) {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h2>Appointments Manager</h2>
        <p>Review patient booking calendars and update consultation status.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Master Clinic Consultation Schedule</h3>
      </div>
      <div class="card-body" style="padding: 0;">
        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date & Time Slot</th>
                <th>Service Reason</th>
                <th>Status Badge</th>
                <th style="text-align: right;">Approval Action</th>
              </tr>
            </thead>
            <tbody>
              ${appointments.length === 0
                ? `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 40px;">No appointments in database.</td></tr>`
                : appointments.map(a => {
                    let actionHtml = '';
                    if (a.status === 'pending') {
                      actionHtml = `
                        <div class="btn-icon-actions" style="justify-content: flex-end;">
                          <button class="btn-secondary" style="padding: 6px 12px; background:var(--success-light); color:var(--success); border-color:transparent;" data-approve-apt="${a.id}">Approve</button>
                          <button class="btn-secondary" style="padding: 6px 12px; background:var(--danger-light); color:var(--danger); border-color:transparent;" data-reject-apt="${a.id}">Reject</button>
                        </div>
                      `;
                    } else {
                      actionHtml = `<span style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">Completed / Decided</span>`;
                    }

                    return `
                      <tr>
                        <td>
                          <div style="display:flex; flex-direction:column;">
                            <strong>${a.patientName}</strong>
                            <span style="font-size:0.75rem; color:var(--text-muted);">${a.patientPhone || ''}</span>
                          </div>
                        </td>
                        <td><strong>${a.dateTime.replace('T', ' ')}</strong></td>
                        <td>${a.reason}</td>
                        <td><span class="badge ${a.status}">${a.status}</span></td>
                        <td style="text-align: right;">${actionHtml}</td>
                      </tr>
                    `;
                  }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
