/* ==========================================================================
   Dentiva Notification & Toast Service (notifications.js)
   Handles persistent user notifications and transient on-screen toasts.
   ========================================================================== */

import { db } from './db.js';
import { state, notifyStateChange } from './state.js';

export function addNotification(userId, message, type = 'appointment') {
  const notifs = db.get('notifications') || [];
  
  notifs.unshift({
    id: `not_${Date.now()}`,
    userId,
    message,
    type, // 'appointment' | 'record'
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
    unread: true
  });

  db.set('notifications', notifs);
}

export function getNotifications(userId) {
  const notifs = db.get('notifications') || [];
  return notifs.filter(n => n.userId === userId);
}

export function markNotificationsRead(userId) {
  const notifs = db.get('notifications') || [];
  notifs.forEach(n => {
    if (n.userId === userId) n.unread = false;
  });
  db.set('notifications', notifs);
}

export function toast(message, type = 'success') {
  const existing = document.querySelector('.toast-container');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.className = 'toast-container';
  
  const icon = type === 'success' ? 'check-circle' : type === 'danger' ? 'alert-triangle' : 'info';
  
  container.innerHTML = `
    <div class="toast ${type}">
      <i data-lucide="${icon}" class="toast-icon"></i>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(container);
  if (window.lucide) window.lucide.createIcons();

  clearTimeout(state.toastTimeout);
  state.toastTimeout = setTimeout(() => {
    container.remove();
  }, 3500);
}
