/* ==========================================================================
   Dentiva Main Orchestrator (main.js)
   Bootstraps core subsystems, routes view renders, and attaches event binders.
   ========================================================================== */

import { db } from './core/db.js';
import { state, subscribe, initSession } from './core/state.js';
import { renderAuthView } from './features/auth/auth.template.js';
import { bindAuthEvents } from './features/auth/auth.js';
import { renderPatientDashboard } from './features/dashboard/patient-dashboard.js';
import { renderDoctorDashboard } from './features/dashboard/doctor-dashboard.js';
import { bindLayoutEvents } from './features/dashboard/layout.js';
import { bindAppointmentEvents } from './features/appointments/appointments.js';
import { bindRecordEvents } from './features/records/records.js';
import { bindPrescriptionEvents } from './features/prescription/prescription.js';
import { bindCalendarEvents } from './features/calendar/calendar.js';
import { bindBlogEvents } from './features/blogs/blogs.js';

export function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  if (state.currentPage === 'auth') {
    root.innerHTML = renderAuthView();
    bindAuthEvents();
  } else if (state.currentPage === 'patient-dashboard') {
    root.innerHTML = renderPatientDashboard();
    bindLayoutEvents();
    bindAppointmentEvents();
    bindRecordEvents();
    bindPrescriptionEvents();
    bindBlogEvents();
  } else if (state.currentPage === 'doctor-dashboard') {
    root.innerHTML = renderDoctorDashboard();
    bindLayoutEvents();
    bindAppointmentEvents();
    bindRecordEvents();
    bindPrescriptionEvents();
    bindCalendarEvents();
    bindBlogEvents();
  }

  // Refresh vector icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Bootstrap on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  initSession();
  subscribe(renderApp);
  renderApp();

  // Initialize DB and perform live PostgreSQL synchronization if server is reachable
  db.init(() => {
    renderApp();
  });
});
