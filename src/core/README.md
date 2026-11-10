# Core System Architecture (`src/core`)

This module forms the bedrock of the Dentiva Dental Clinic Portal. It manages offline persistence, application-level state reactivity, and notification pipelines.

---

## Architecture Overview

```
src/core/
├── db.js             # LocalStorage relational mock engine & seeding data
├── state.js          # Centralized reactive state container & session loader
├── notifications.js  # Floating toast system & persistent in-app notifications
└── README.md         # Architecture and technical guide
```

---

## 1. LocalStorage Database Engine (`db.js`)

Dentiva simulates an enterprise relational database directly in the browser's `localStorage`. This allows the application to be deployed as a completely self-contained static app (e.g. inside Docker Nginx) with zero backend dependency while maintaining full CRUD capabilities.

### Key Tables & Schemas

| Table | Primary Key | Description |
|---|---|---|
| `dentiva_users` | `id` | Patient and Doctor credentials, profiles, phone, specialty, license |
| `dentiva_appointments` | `id` | Consultation dates, timeslots, statuses (`pending`, `approved`, `rejected`), doctor/patient link |
| `dentiva_records` | `id` | Electronic Medical Records (EMR): diagnosis, treatment, Rx, attachments |
| `dentiva_blogs` | `id` | Clinic educational dental articles, author bio, read time |
| `dentiva_notifications`| `id` | System events targeted to specific `userId`, with read/unread status |

### Seeding & Self-Healing
On application launch, `db.init()` checks whether the database tables exist. If empty, it populates default realistic seed data (Lead Orthodontist Dr. Dentist and patients Subhajit, Mark, and Souvik).

---

## 2. Reactive State Store (`state.js`)

Centralized state eliminates hard-to-track UI bugs:
- **`state.user`**: The active authenticated user object.
- **`state.currentPage`**: Routing switcher (`auth`, `patient-dashboard`, `doctor-dashboard`).
- **`state.currentTab`**: Active sub-view in the portal.
- **`state.forms`**: In-flight input cache so modal inputs are never wiped accidentally.
- **`subscribe(listener)`**: Lightweight observer pattern triggering re-renders upon state mutations.

---

## 3. Notification Service (`notifications.js`)

- **`toast(message, type)`**: Displays a slide-in alert box with color coding (`success`, `danger`, `warning`) that auto-dismisses after 3.5 seconds.
- **`addNotification(userId, message, type)`**: Records permanent timeline notifications that badge the top navbar bell.
- **`markNotificationsRead(userId)`**: Clears unread badge counts when the user reviews the tray.

---

## Customer Presentation Tip
> **Show the customer:** Log in as Patient Subhajit, book a consultation, then log out and log in as Dr. Dentist. Point out that the appointment appears in real time and the notification bell updates. Explain that this architecture cleanly maps to REST APIs or WebSockets when connecting to PostgreSQL or MongoDB in cloud production.
