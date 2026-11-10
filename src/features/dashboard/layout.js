/* ==========================================================================
   Dentiva Dashboard Shell & Layout (layout.js)
   Shared chrome, sidebar navigation, top navbar, modals, and theme switcher.
   ========================================================================== */

import { state, notifyStateChange } from '../../core/state.js';
import { getNotifications, markNotificationsRead, toast } from '../../core/notifications.js';
import { logout } from '../auth/auth.js';
import { renderBookingModal } from '../appointments/appointments.template.js';
import { renderAddRecordModal } from '../records/records.template.js';
import { renderWriteBlogModal, renderViewBlogModal } from '../blogs/blogs.template.js';
import { renderCalendarDayModal } from '../calendar/calendar.template.js';

export function toggleTheme() {
  const newTheme = state.theme === 'light' ? 'dark' : 'light';
  state.theme = newTheme;
  localStorage.setItem('dentiva_theme', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  toast(`Switched to ${newTheme} mode`, 'success');
  notifyStateChange();
}

export function renderSidebar(activeTab, role) {
  const isDoc = role === 'doctor';
  const menuItems = isDoc ? [
    { id: 'overview', icon: 'grid', label: 'Doctor Overview' },
    { id: 'appointments', icon: 'calendar', label: 'Appointments' },
    { id: 'patients', icon: 'users', label: 'Patient EMRs' },
    { id: 'calendar', icon: 'activity', label: 'Clinic Calendar' },
    { id: 'blogs', icon: 'file-text', label: 'Dental Blog Editor' }
  ] : [
    { id: 'overview', icon: 'grid', label: 'Patient Overview' },
    { id: 'appointments', icon: 'calendar', label: 'My Appointments' },
    { id: 'records', icon: 'heart', label: 'Medical History' },
    { id: 'blogs', icon: 'file-text', label: 'Dental Health Blog' }
  ];

  const linksHtml = menuItems.map(item => `
    <a href="#" class="sidebar-link ${activeTab === item.id ? 'active' : ''}" data-tab="${item.id}">
      <i data-lucide="${item.icon}"></i>
      <span>${item.label}</span>
    </a>
  `).join('');

  return `
    <aside class="sidebar ${state.mobileSidebarOpen ? 'mobile-open' : ''}">
      <div>
        <div class="sidebar-logo">
          <div class="logo-icon">
            <i data-lucide="shield-check"></i>
          </div>
          <div class="logo-text">DENTIVA</div>
          <button id="mobile-sidebar-close" class="nav-icon-btn" style="display: none; margin-left: auto; width:32px; height:32px; border-radius:50%; border:none; background:var(--bg-surface-hover);">
            <i data-lucide="x" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
        <nav class="sidebar-menu">
          ${linksHtml}
        </nav>
      </div>
      <div class="sidebar-footer">
        <div class="user-profile-badge">
          <div class="user-avatar">${state.user?.avatar || 'US'}</div>
          <div class="user-info">
            <span class="user-name">${state.user?.name || 'User'}</span>
            <span class="user-role">${state.user?.role || 'Guest'}</span>
          </div>
        </div>
        <button id="logout-btn" class="sidebar-link" style="color: var(--danger); width: 100%; border: none; background: transparent;">
          <i data-lucide="log-out"></i>
          <span>Secure Log Out</span>
        </button>
      </div>
    </aside>
  `;
}

export function renderNavbar() {
  const notifs = getNotifications(state.user.id);
  const unreadCount = notifs.filter(n => n.unread).length;
  const badgeHtml = unreadCount > 0 ? `<div class="nav-icon-badge">${unreadCount}</div>` : '';
  const themeIcon = state.theme === 'light' ? 'moon' : 'sun';

  return `
    <header class="navbar">
      <button id="mobile-menu-toggle" class="menu-toggle-btn" title="Toggle Navigation Drawer">
        <i data-lucide="menu"></i>
      </button>
      
      <div class="navbar-actions">
        <button id="theme-toggle-btn" class="nav-icon-btn theme-switch-btn" title="Toggle Light/Dark Theme">
          <i data-lucide="${themeIcon}"></i>
        </button>
        
        <div style="position: relative;">
          <button id="notif-bell-btn" class="nav-icon-btn" title="Notifications Center">
            <i data-lucide="bell"></i>
            ${badgeHtml}
          </button>
          ${renderNotificationTray(notifs)}
        </div>
      </div>
    </header>
  `;
}

export function renderNotificationTray(notifs) {
  const trayHtml = notifs.length === 0 
    ? `<div class="notif-empty">No notifications yet.</div>`
    : notifs.map(n => `
        <div class="notif-item ${n.unread ? 'unread' : ''}">
          <div class="notif-icon ${n.type}">
            <i data-lucide="${n.type === 'appointment' ? 'calendar' : 'heart'}"></i>
          </div>
          <div>
            <p>${n.message}</p>
            <span class="notif-time">${n.time}</span>
          </div>
        </div>
      `).join('');

  return `
    <div id="notif-dropdown-tray" class="notification-dropdown">
      <div class="notif-header">
        <h4>Notifications Center</h4>
        <span style="font-size: 0.75rem; color: var(--primary); font-weight: 700;">Secure Network</span>
      </div>
      <div class="notif-list">
        ${trayHtml}
      </div>
    </div>
  `;
}

export function renderModalContainer() {
  if (!state.activeModal) return '';

  let title = '';
  let body = '';

  if (state.activeModal === 'book-appointment') {
    title = 'Book Dental Consultation';
    body = renderBookingModal();
  } else if (state.activeModal === 'add-record') {
    title = 'Add Clinical Record to Patient EMR';
    body = renderAddRecordModal();
  } else if (state.activeModal === 'write-blog') {
    title = 'Compose Dental Health Article';
    body = renderWriteBlogModal();
  } else if (state.activeModal === 'view-blog') {
    const data = renderViewBlogModal();
    title = data.title;
    body = data.body;
  } else if (state.activeModal === 'calendar-day-details') {
    const data = renderCalendarDayModal();
    title = data.title;
    body = data.body;
  }

  return `
    <div class="modal-overlay active">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close-btn" data-close-modal>
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="modal-body">
          ${body}
        </div>
      </div>
    </div>
  `;
}

export function bindLayoutEvents() {
  // Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  // Theme Switch
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-sidebar-close');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      state.mobileSidebarOpen = true;
      notifyStateChange();
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => {
      state.mobileSidebarOpen = false;
      notifyStateChange();
    });
  }

  // Notification Bell
  const notifBtn = document.getElementById('notif-bell-btn');
  const notifDropdown = document.getElementById('notif-dropdown-tray');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('active');
      state.notificationTrayOpen = notifDropdown.classList.contains('active');
      if (state.notificationTrayOpen) {
        markNotificationsRead(state.user.id);
        const badge = document.querySelector('.nav-icon-badge');
        if (badge) badge.remove();
      }
    });
  }

  document.addEventListener('click', (e) => {
    const tray = document.getElementById('notif-dropdown-tray');
    if (tray && tray.classList.contains('active') && !tray.contains(e.target) && e.target !== document.getElementById('notif-bell-btn')) {
      tray.classList.remove('active');
      state.notificationTrayOpen = false;
    }
  });

  // Sidebar Tab Navigation
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      state.currentTab = link.dataset.tab;
      state.selectedPatientId = null;
      state.mobileSidebarOpen = false;
      notifyStateChange();
    });
  });

  // Modal Close Buttons
  const modalCloses = document.querySelectorAll('[data-close-modal]');
  modalCloses.forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeModal = null;
      notifyStateChange();
    });
  });
}
