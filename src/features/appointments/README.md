# Appointments Management (`src/features/appointments`)

This feature handles the end-to-end appointment scheduling lifecycle: from patient slot selection and conflict prevention to doctor approval workflows and notifications.

---

## Architecture

```
src/features/appointments/
├── appointments.js          # Controller: booking logic, slot validation, status update
├── appointments.template.js # Booking modal, patient consults table, doctor schedule table
└── README.md                # Lifecycle documentation & demo script
```

---

## Core Features & Workflow

1. **Intelligent Slot Picker**:
   - Offers standard dental office time slots (`09:00`, `10:00`, `11:00`, `13:00`, `14:00`, `15:00`, `16:00`).
   - Limits the date picker to future or current dates (`min="YYYY-MM-DD"`).

2. **Conflict & Double-Booking Prevention**:
   - Before inserting a new record, the controller queries existing records for matching `dateTime`.
   - If an approved appointment already exists at that slot, booking is rejected with an on-screen warning toast.

3. **Status State Machine**:
   - `pending`: Newly booked by patient; visible in doctor’s review queue.
   - `approved`: Doctor accepted; shows as green badge, reserves the time slot, reflects in clinic calendar.
   - `rejected`: Doctor denied; patient is alerted via notification center.

4. **User Engagement**:
   - When a booking request succeeds, an interactive Canvas Confetti burst triggers for delightful user experience.

---

## How to Demo to a Customer

1. **Patient Booking**:
   - Log in as **Subhajit Dey (Patient)**.
   - Click **Book New Consultation** in the top right.
   - Choose tomorrow’s date, pick **11:00**, select **Root Canal Therapy**, type notes, and click **Confirm Reservation Request**.
   - Show the confetti animation and the new pending booking in the table.
2. **Doctor Approval**:
   - Log out, then 1-click log in as **Dr. Dentist**.
   - Show the pending request under **Pending Consultation Requests** or in the **Appointments** tab.
   - Click the green **Approve** button.
   - Switch back to Patient Subhajit and show the notification confirming the approval!
