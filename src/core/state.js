/* ==========================================================================
   Dentiva Reactive State Store (state.js)
   Centralized state container with subscriber notification triggers.
   ========================================================================== */

export const state = {
  user: null,                   // Current logged-in user object
  currentPage: 'auth',          // 'auth' | 'patient-dashboard' | 'doctor-dashboard'
  currentTab: 'overview',       // patient: 'overview', 'appointments', 'records', 'blogs'
                                // doctor: 'overview', 'appointments', 'patients', 'blogs', 'calendar'
  selectedPatientId: null,      // Active patient EMR details view
  activeModal: null,            // null | 'book-appointment' | 'add-record' | 'write-blog' | 'view-blog' | 'calendar-day-details'
  calendarSelectedDay: null,    // Selected ISO date string
  calendarDate: new Date(),     // Currently browsed calendar month/year
  selectedBlogId: null,         // Currently viewed blog article
  notificationTrayOpen: false,  // Dropdown state
  mobileSidebarOpen: false,     // Mobile navigation drawer
  theme: 'light',               // 'light' | 'dark'
  toastTimeout: null,
  
  // Form input caches (prevent lost state across re-renders)
  forms: {
    bookAppointment: { date: '', time: '', reason: '', notes: '' },
    addRecord: { diagnosis: '', treatment: '', prescription: '', notes: '', attachments: [] },
    writeBlog: { title: '', summary: '', content: '' }
  },
  patientSearchQuery: '',
  patientFilterStatus: 'all'
};

// Listeners registry for reactive UI updates
const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

export function notifyStateChange() {
  listeners.forEach(fn => fn(state));
}

export function initSession() {
  const sessionUser = localStorage.getItem('dentiva_session_user');
  if (sessionUser) {
    try {
      state.user = JSON.parse(sessionUser);
      state.currentPage = state.user.role === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard';
    } catch (e) {
      console.error("Invalid session data:", e);
      localStorage.removeItem('dentiva_session_user');
    }
  }

  const savedTheme = localStorage.getItem('dentiva_theme') || 'light';
  state.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
}
