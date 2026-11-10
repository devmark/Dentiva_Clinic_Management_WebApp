/* ==========================================================================
   Dentiva Appointments Controller (appointments.js)
   Appointment creation, slot collision prevention, approval state machine.
   ========================================================================== */

import { db } from '../../core/db.js';
import { state, notifyStateChange } from '../../core/state.js';
import { toast, addNotification } from '../../core/notifications.js';

export function bookAppointment(date, time, reason, notes) {
  if (!date || !time || !reason) {
    toast("Please select a date, time slot, and reason.", "warning");
    return false;
  }

  // Conflict / Double booking check against already approved visits
  const appointments = db.get('appointments');
  const targetDateTime = `${date}T${time}`;
  
  const isDoubleBooked = appointments.some(apt => 
    apt.dateTime === targetDateTime && 
    apt.status === 'approved'
  );

  if (isDoubleBooked) {
    toast("This slot is already approved for another patient. Please choose another slot.", "danger");
    return false;
  }

  const newApt = {
    id: `apt_${Date.now()}`,
    patientId: state.user.id,
    patientName: state.user.name,
    patientPhone: state.user.phone || '',
    doctorId: "usr_doc_1", // Default clinic lead
    doctorName: "Dr. Dentist",
    dateTime: targetDateTime,
    status: "pending",
    reason,
    notes: notes || ''
  };

  appointments.push(newApt);
  db.set('appointments', appointments);

  // Notify Patient
  addNotification(
    state.user.id,
    `Your appointment booking for ${date} at ${time} is pending review.`,
    'appointment'
  );

  // Notify Doctor
  addNotification(
    "usr_doc_1",
    `New appointment request received from ${state.user.name} for ${date}.`,
    'appointment'
  );

  // Confetti delight effect
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Reset form cache and close modal
  state.forms.bookAppointment = { date: '', time: '', reason: '', notes: '' };
  state.activeModal = null;
  toast("Appointment requested successfully!", "success");
  notifyStateChange();
  return true;
}

export function updateAppointmentStatus(id, status) {
  const appointments = db.get('appointments');
  const aptIndex = appointments.findIndex(a => a.id === id);
  
  if (aptIndex !== -1) {
    const apt = appointments[aptIndex];
    apt.status = status;
    db.set('appointments', appointments);

    const statusText = status === 'approved' ? 'Approved' : 'Rejected';
    addNotification(
      apt.patientId,
      `Dr. Dentist has ${statusText.toLowerCase()} your appointment request for ${apt.dateTime.replace('T', ' ')}.`,
      'appointment'
    );

    toast(`Appointment successfully ${statusText.toLowerCase()}`, status === 'approved' ? 'success' : 'danger');
    notifyStateChange();
  }
}

export function bindAppointmentEvents() {
  // Open Booking Modal
  const openBookBtn = document.getElementById('btn-open-book-modal');
  if (openBookBtn) {
    openBookBtn.addEventListener('click', () => {
      state.activeModal = 'book-appointment';
      notifyStateChange();
    });
  }

  // Slot Selection
  const slotOptions = document.querySelectorAll('.slot-option');
  slotOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      slotOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      state.forms.bookAppointment.time = opt.dataset.time;
    });
  });

  // Booking Form Fields Cache
  const bookDate = document.getElementById('book-date');
  if (bookDate) {
    bookDate.addEventListener('change', () => {
      state.forms.bookAppointment.date = bookDate.value;
    });
  }
  const bookReason = document.getElementById('book-reason');
  if (bookReason) {
    bookReason.addEventListener('change', () => {
      state.forms.bookAppointment.reason = bookReason.value;
    });
  }
  const bookNotes = document.getElementById('book-notes');
  if (bookNotes) {
    bookNotes.addEventListener('input', () => {
      state.forms.bookAppointment.notes = bookNotes.value;
    });
  }

  // Booking Form Submission
  const bookForm = document.getElementById('book-appointment-form');
  if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cache = state.forms.bookAppointment;
      bookAppointment(cache.date, cache.time, cache.reason, cache.notes);
    });
  }

  // Approve / Reject Actions (Doctor view)
  const approveBtns = document.querySelectorAll('[data-approve-apt]');
  approveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      updateAppointmentStatus(btn.dataset.approveApt, 'approved');
    });
  });

  const rejectBtns = document.querySelectorAll('[data-reject-apt]');
  rejectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      updateAppointmentStatus(btn.dataset.rejectApt, 'rejected');
    });
  });
}
