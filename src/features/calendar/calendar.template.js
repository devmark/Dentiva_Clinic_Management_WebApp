/* ==========================================================================
   Dentiva Calendar View Templates (calendar.template.js)
   Responsive month grid, day cells with status dots, and daily agenda modal.
   ========================================================================== */

import { state } from '../../core/state.js';
import { db } from '../../core/db.js';

export function renderCalendarComponent() {
  if (!state.calendarDate) state.calendarDate = new Date();
  const calDate = state.calendarDate;
  const month = calDate.getMonth();
  const year = calDate.getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const gridCells = [];

  // 1. Padding from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    gridCells.push(`<div class="calendar-day-cell other-month"><span class="calendar-day-number">${daysInPrevMonth - i}</span></div>`);
  }

  // 2. Days in active viewed month
  const appointments = db.get('appointments');
  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const fullDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayApts = appointments.filter(a => a.dateTime.startsWith(fullDateStr));
    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    
    const dotsHtml = dayApts.length > 0 
      ? `<div class="calendar-dots">
          ${dayApts.map(apt => `<div class="calendar-dot ${apt.status}" title="${apt.patientName}: ${apt.reason} (${apt.status})"></div>`).join('')}
         </div>`
      : '';

    gridCells.push(`
      <div class="calendar-day-cell ${isToday ? 'today' : ''}" data-date="${fullDateStr}">
        <span class="calendar-day-number">${day}</span>
        ${dotsHtml}
      </div>
    `);
  }

  // 3. Padding for next month to complete 6 rows (42 cells)
  const remainingCells = 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridCells.push(`<div class="calendar-day-cell other-month"><span class="calendar-day-number">${i}</span></div>`);
  }

  return `
    <div class="page-header">
      <div class="page-title-group">
        <h2>Clinic Consultation Calendar</h2>
        <p>Visual scheduling workspace. View date slots, pending loads, and approved visits.</p>
      </div>
    </div>

    <div class="calendar-component">
      <div class="calendar-header">
        <h3 class="calendar-month-year">${monthNames[month]} ${year}</h3>
        <div class="calendar-nav-btns">
          <button id="calendar-prev-month" class="calendar-nav-btn" title="Previous Month">
            <i data-lucide="chevron-left"></i>
          </button>
          <button id="calendar-next-month" class="calendar-nav-btn" title="Next Month">
            <i data-lucide="chevron-right"></i>
          </button>
        </div>
      </div>

      <div class="calendar-days-grid">
        <div class="calendar-day-header">Sun</div>
        <div class="calendar-day-header">Mon</div>
        <div class="calendar-day-header">Tue</div>
        <div class="calendar-day-header">Wed</div>
        <div class="calendar-day-header">Thu</div>
        <div class="calendar-day-header">Fri</div>
        <div class="calendar-day-header">Sat</div>
        
        ${gridCells.join('')}
      </div>
    </div>
  `;
}

export function renderCalendarDayModal() {
  const dateStr = state.calendarSelectedDay;
  const appointments = db.get('appointments');
  const dayApts = appointments.filter(a => a.dateTime.startsWith(dateStr));
  
  const formattedDate = new Date(dateStr).toLocaleDateString([], { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const aptsHtml = dayApts.length === 0 
    ? `<div style="text-align: center; color: var(--text-muted); padding: 20px;">No appointments scheduled on this date.</div>`
    : dayApts.map(apt => `
        <div style="background: var(--bg-app); border:1px solid var(--border); padding: 16px; border-radius: var(--radius-md); margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="display: block; font-size: 1rem;">${apt.patientName}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight:600;">Time: ${apt.dateTime.split('T')[1]} &bull; Phone: ${apt.patientPhone || 'N/A'}</span>
            <p style="margin-top: 6px; font-size: 0.85rem;"><strong>Reason:</strong> ${apt.reason}</p>
            ${apt.notes ? `<p style="font-size: 0.8rem; font-style: italic; color: var(--text-muted);">"${apt.notes}"</p>` : ''}
          </div>
          <div>
            <span class="badge ${apt.status}">${apt.status}</span>
          </div>
        </div>
      `).join('');

  return {
    title: `Appointments for ${formattedDate}`,
    body: `<div style="max-height: 400px; overflow-y: auto;">${aptsHtml}</div>`
  };
}
