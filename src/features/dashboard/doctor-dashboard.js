/* ==========================================================================
   Dentiva Doctor Dashboard View (doctor-dashboard.js)
   Renders doctor clinical hub, appointment queues, patient EMRs, and calendar.
   ========================================================================== */

import { state } from '../../core/state.js';
import { db } from '../../core/db.js';
import { renderSidebar, renderNavbar, renderModalContainer } from './layout.js';
import { renderDoctorAppointmentsView } from '../appointments/appointments.template.js';
import { renderPatientRecordsTimeline } from '../records/records.template.js';
import { renderCalendarComponent } from '../calendar/calendar.template.js';
import { renderDoctorBlogManager } from '../blogs/blogs.template.js';

export function renderDoctorDashboard() {
  const user = state.user;
  const tab = state.currentTab;
  let tabBodyHtml = '';

  if (tab === 'overview') {
    const appointments = db.get('appointments');
    const pending = appointments.filter(a => a.status === 'pending');
    const patients = db.get('users').filter(u => u.role === 'patient');
    const blogs = db.get('blogs');

    tabBodyHtml = `
      <div class="page-header">
        <div class="page-title-group">
          <h2>Welcome, ${user.name}</h2>
          <p>Orthodontist Dashboard &bull; Clinical environment active</p>
        </div>
        <div style="display:flex; gap:12px;">
          <button class="btn-secondary" id="btn-open-blog-modal">
            <i data-lucide="file-text"></i> Write Article
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper primary"><i data-lucide="calendar"></i></div>
          <div class="stat-info">
            <span class="stat-val">${appointments.filter(a => a.status === 'approved').length}</span>
            <span class="stat-lbl">Approved Bookings</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper warning"><i data-lucide="activity"></i></div>
          <div class="stat-info">
            <span class="stat-val">${pending.length}</span>
            <span class="stat-lbl">Pending Review</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon-wrapper success"><i data-lucide="users"></i></div>
          <div class="stat-info">
            <span class="stat-val">${patients.length}</span>
            <span class="stat-lbl">Total Clinic Patients</span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Pending Consultation Requests</h3>
            <button class="btn-secondary" style="padding: 6px 12px; font-size:0.75rem;" data-tab="appointments">Manage</button>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-wrapper">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Date / Time Slot</th>
                    <th>Symptom Reason</th>
                    <th style="text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${pending.length === 0
                    ? `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">All caught up! No pending appointment requests.</td></tr>`
                    : pending.slice(0, 3).map(a => `
                        <tr>
                          <td><strong>${a.patientName}</strong></td>
                          <td>${a.dateTime.replace('T', ' ')}</td>
                          <td>${a.reason}</td>
                          <td style="text-align: right;">
                            <div class="btn-icon-actions" style="justify-content: flex-end;">
                              <button class="btn-action-round success" data-approve-apt="${a.id}" title="Approve Request">
                                <i data-lucide="check" style="width:16px;"></i>
                              </button>
                              <button class="btn-action-round danger" data-reject-apt="${a.id}" title="Reject Request">
                                <i data-lucide="x" style="width:16px;"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card" style="height: fit-content;">
          <div class="card-header">
            <h3 class="card-title">Latest Articles</h3>
            <button class="btn-secondary" style="padding: 6px 12px; font-size:0.75rem;" data-tab="blogs">Publish Section</button>
          </div>
          <div class="card-body">
            ${blogs.slice(0, 2).map(b => `
              <div style="border-bottom: 1px solid var(--border); padding-bottom:12px; margin-bottom:12px;">
                <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${b.date}</span>
                <h4 style="font-size:0.95rem; line-height: 1.3;">${b.title}</h4>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'appointments') {
    const appointments = db.get('appointments');
    tabBodyHtml = renderDoctorAppointmentsView(appointments);
  } else if (tab === 'patients') {
    if (state.selectedPatientId) {
      const patient = db.get('users').find(u => u.id === state.selectedPatientId);
      const records = db.get('records').filter(r => r.patientId === state.selectedPatientId);

      tabBodyHtml = `
        <div class="page-header">
          <button class="btn-secondary" id="btn-back-patients">
            <i data-lucide="arrow-left"></i> Back to Patient Directory
          </button>
          <button class="btn-primary" id="btn-open-record-modal">
            <i data-lucide="folder-plus"></i> Add EMR Chart Entry
          </button>
        </div>

        <div class="card" style="margin-bottom: 30px;">
          <div class="card-header" style="background:var(--primary-light);">
            <h3 class="card-title" style="color:var(--primary); font-weight:800;">ELECTRONIC MEDICAL RECORD: ${patient ? patient.name : 'Patient EMR'}</h3>
          </div>
          <div class="card-body">
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:20px; font-size:0.9rem; border-bottom:1px solid var(--border); padding-bottom:20px; margin-bottom:20px;">
              <div><span style="color:var(--text-muted); font-weight:600;">Date of Birth:</span> <strong>${patient ? patient.dob : 'N/A'}</strong></div>
              <div><span style="color:var(--text-muted); font-weight:600;">Gender:</span> <strong>${patient ? patient.gender : 'N/A'}</strong></div>
              <div><span style="color:var(--text-muted); font-weight:600;">Contact Phone:</span> <strong>${patient ? patient.phone : 'N/A'}</strong></div>
              <div><span style="color:var(--text-muted); font-weight:600;">Secure Email:</span> <strong>${patient ? patient.email : 'N/A'}</strong></div>
            </div>
            
            <h3 style="font-size:1.15rem; margin-bottom: 20px; font-weight:700;"><i data-lucide="activity" style="vertical-align:middle; margin-right:6px; color:var(--primary);"></i>Clinical Historical Timeline</h3>
            ${renderPatientRecordsTimeline(records)}
          </div>
        </div>
      `;
    } else {
      const patients = db.get('users').filter(u => u.role === 'patient');

      tabBodyHtml = `
        <div class="page-header">
          <div class="page-title-group">
            <h2>Patient Database</h2>
            <p>Search clinic health charts, review histories, and manage prescriptions.</p>
          </div>
        </div>

        <div class="search-filter-bar">
          <div class="search-input-wrapper">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="patient-search-input" class="form-input" placeholder="Search patients by name, email, or telephone...">
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Electronic Health Chart Directory</h3>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-wrapper">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Patient Full Name</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Contact Phone</th>
                    <th>Portal Email</th>
                  </tr>
                </thead>
                <tbody id="patients-table-body">
                  ${patients.length === 0
                    ? `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">No patients signed up in clinic system yet.</td></tr>`
                    : patients.map(pat => `
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
                      `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }
  } else if (tab === 'blogs') {
    const blogs = db.get('blogs');
    tabBodyHtml = renderDoctorBlogManager(blogs);
  } else if (tab === 'calendar') {
    tabBodyHtml = renderCalendarComponent();
  }

  return `
    <div class="dashboard-container">
      ${renderSidebar(tab, 'doctor')}
      <div class="main-content">
        ${renderNavbar()}
        <main class="dashboard-content">
          ${tabBodyHtml}
        </main>
      </div>
      ${renderModalContainer()}
    </div>
  `;
}
