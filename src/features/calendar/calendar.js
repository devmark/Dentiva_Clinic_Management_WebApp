/* ==========================================================================
   Dentiva Calendar Controller (calendar.js)
   Month calculations, navigation triggers, and daily agenda inspection.
   ========================================================================== */

import { state, notifyStateChange } from '../../core/state.js';

export function bindCalendarEvents() {
  // Day Cell Inspection
  const dayCells = document.querySelectorAll('.calendar-day-cell:not(.other-month)');
  dayCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const dateStr = cell.dataset.date;
      state.activeModal = 'calendar-day-details';
      state.calendarSelectedDay = dateStr;
      notifyStateChange();
    });
  });

  // Month Navigation
  const prevMonthBtn = document.getElementById('calendar-prev-month');
  const nextMonthBtn = document.getElementById('calendar-next-month');

  if (prevMonthBtn && nextMonthBtn) {
    if (!state.calendarDate) state.calendarDate = new Date();
    
    prevMonthBtn.addEventListener('click', () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
      notifyStateChange();
    });

    nextMonthBtn.addEventListener('click', () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
      notifyStateChange();
    });
  }
}
