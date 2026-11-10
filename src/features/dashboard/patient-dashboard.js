/* ==========================================================================
   Dentiva Patient Dashboard View (patient-dashboard.js)
   Renders patient overview, quick booking stats, medical history, and blog hub.
   ========================================================================== */

import { state } from '../../core/state.js';
import { db } from '../../core/db.js';
import { renderSidebar, renderNavbar, renderModalContainer } from './layout.js';
import { renderPatientAppointmentsView } from '../appointments/appointments.template.js';
import { renderPatientRecordsTimeline } from '../records/records.template.js';
import { renderPatientBlogFeed } from '../blogs/blogs.template.js';

export function renderPatientDashboard() {
  const user = state.user;
  const tab = state.currentTab;
  let tabBodyHtml = '';

  if (tab === 'overview') {
    const appointments = db.get('appointments').filter(a => a.patientId === user.id);
    const upcoming = appointments.find(a => a.status === 'approved' && new Date(a.dateTime) >= new Date());
    const records = db.get('records').filter(r => r.patientId === user.id);
    const latestRecord = records[records.length - 1];

    const bookingWidget = upcoming 
      ? `
        <div class="stat-icon-wrapper success"><i data-lucide="calendar"></i></div>
        <div class="stat-info">
          <span class="stat-val" style="font-size: 1.15rem;">${new Date(upcoming.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          <span class="stat-lbl">${upcoming.reason} (Approved)</span>
        </div>
      `
      : `
        <div class="stat-icon-wrapper primary"><i data-lucide="calendar"></i></div>
        <div class="stat-info">
          <span class="stat-val" style="font-size: 1.1rem; color: var(--text-muted);">None Scheduled</span>
          <span class="stat-lbl">No upcoming consultations</span>
        </div>
      `;

    const healthWidget = latestRecord
      ? `
        <div class="stat-icon-wrapper secondary"><i data-lucide="activity"></i></div>
        <div class="stat-info">
          <span class="stat-val" style="font-size: 1.15rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${latestRecord.diagnosis}</span>
          <span class="stat-lbl">Last diagnosed &bull; ${latestRecord.date}</span>
        </div>
      `
      : `
        <div class="stat-icon-wrapper secondary"><i data-lucide="activity"></i></div>
        <div class="stat-info">
          <span class="stat-val" style="font-size: 1.1rem; color: var(--text-muted);">No Records Yet</span>
          <span class="stat-lbl">EMR charts clean</span>
        </div>
      `;

    const latestBlogs = db.get('blogs').slice(0, 2);
    const blogTeaserHtml = latestBlogs.map(b => `
      <div class="blog-card" data-blog-id="${b.id}" style="cursor: pointer; flex-direction:row; height: 110px; gap: 15px; margin-bottom: 12px; box-shadow:none; border: 1px solid var(--border); padding: 12px; border-radius: var(--radius-sm);">
        <div style="width: 80px; height: 86px; border-radius:4px; flex-shrink: 0; background: linear-gradient(135deg, var(--primary-light), var(--secondary-light)); display:flex; align-items:center; justify-content:center; color: var(--primary);">
          <i data-lucide="file-text"></i>
        </div>
        <div style="display:flex; flex-direction:column; justify-content:center; overflow:hidden;">
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight:600;">${b.date}</span>
          <h4 style="font-size: 0.95rem; line-height: 1.3; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${b.title}</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted); text-overflow:ellipsis; white-space:nowrap; overflow:hidden; margin-top:2px;">${b.summary}</p>
        </div>
      </div>
    `).join('');

    tabBodyHtml = `
      <div class="page-header">
        <div class="page-title-group">
          <h2>Welcome Back, ${user.name}</h2>
          <p>Secure HIPAA Client Hub &bull; Last clinic visit sync was today at 08:00 AM</p>
        </div>
        <button class="btn-primary" id="btn-open-book-modal">
          <i data-lucide="plus-circle"></i> Book New Consultation
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">${bookingWidget}</div>
        <div class="stat-card">${healthWidget}</div>
        <div class="stat-card">
          <div class="stat-icon-wrapper success"><i data-lucide="shield-check"></i></div>
          <div class="stat-info">
            <span class="stat-val" style="font-size: 1.15rem;">Active</span>
            <span class="stat-lbl">Portal Credentials Secure</span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div style="display:flex; flex-direction:column; gap: 30px;">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Recent Clinic Bookings</h3>
              <button class="btn-secondary" style="padding: 6px 12px; font-size:0.75rem;" data-tab="appointments">View All</button>
            </div>
            <div class="card-body" style="padding:0;">
              <div class="table-wrapper">
                <table class="custom-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Clinic Doctor</th>
                      <th>Reason for Visit</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${appointments.length === 0 
                      ? `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">No appointments requested yet. Book one today!</td></tr>`
                      : appointments.slice(0, 3).map(a => `
                          <tr>
                            <td><strong>${a.dateTime.replace('T', ' ')}</strong></td>
                            <td>${a.doctorName}</td>
                            <td>${a.reason}</td>
                            <td><span class="badge ${a.status}">${a.status}</span></td>
                          </tr>
                        `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Latest Medical Diagnosis</h3>
              <button class="btn-secondary" style="padding: 6px 12px; font-size:0.75rem;" data-tab="records">Browse Timeline</button>
            </div>
            <div class="card-body">
              ${latestRecord 
                ? `
                  <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                    <span style="font-size: 0.8rem; font-weight:700; color:var(--primary);">${latestRecord.date} &bull; Clinical Record</span>
                    <span style="font-size: 0.8rem; color:var(--text-muted); font-weight:600;">Dr: ${latestRecord.doctorName}</span>
                  </div>
                  <h3 style="font-size:1.2rem; margin-bottom: 8px;">${latestRecord.diagnosis}</h3>
                  <p style="font-size:0.9rem; color: var(--text-muted); margin-bottom: 16px;"><strong>Treatment:</strong> ${latestRecord.treatment}</p>
                  <div class="timeline-rx-box">
                    <div class="timeline-rx-label">Active Prescription</div>
                    <div class="timeline-rx-content" style="white-space: pre-line;">${latestRecord.prescription}</div>
                  </div>
                  <button class="btn-secondary" data-print-prescription-id="${latestRecord.id}">
                    <i data-lucide="printer"></i> Print / Download Prescription (PDF)
                  </button>
                `
                : `<div style="text-align:center; color:var(--text-muted); padding: 20px;">No diagnoses recorded in your portal EMR timeline yet.</div>`}
            </div>
          </div>
        </div>

        <div class="card" style="height: fit-content;">
          <div class="card-header">
            <h3 class="card-title">Recent Dental Articles</h3>
            <button class="btn-secondary" style="padding: 6px 12px; font-size:0.75rem;" data-tab="blogs">Read Blogs</button>
          </div>
          <div class="card-body">
            ${blogTeaserHtml}
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'appointments') {
    const appointments = db.get('appointments').filter(a => a.patientId === user.id);
    tabBodyHtml = renderPatientAppointmentsView(appointments);
  } else if (tab === 'records') {
    const records = db.get('records').filter(r => r.patientId === user.id);
    tabBodyHtml = `
      <div class="page-header">
        <div class="page-title-group">
          <h2>Electronic Medical Record (EMR)</h2>
          <p>Access diagnoses, treatments, prescriptions, and official medical files.</p>
        </div>
      </div>
      ${renderPatientRecordsTimeline(records)}
    `;
  } else if (tab === 'blogs') {
    const blogs = db.get('blogs');
    tabBodyHtml = renderPatientBlogFeed(blogs);
  }

  return `
    <div class="dashboard-container">
      ${renderSidebar(tab, 'patient')}
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
