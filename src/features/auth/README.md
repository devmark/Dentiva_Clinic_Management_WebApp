# Authentication & Role Switching (`src/features/auth`)

The Auth module provides role-based authentication, dual-role self-registration (Doctor vs. Patient), persistent session state, and pre-configured sandbox demo accounts.

---

## Architecture

```
src/features/auth/
├── auth.js            # Controller: login, signup, session caching, event bindings
├── auth.template.js   # Visual templates for login, registration, and quick buttons
└── README.md          # Feature guide, testing steps, and customer presentation script
```

---

## Functional Capabilities

1. **Role Separation**:
   - **Doctor Role**: Routes to the Clinical Dashboard (`doctor-dashboard`) with access to consultation approvals, EMR chart editing, clinic-wide calendar, and article authoring.
   - **Patient Role**: Routes to the Client Health Hub (`patient-dashboard`) with access to instant booking, prescription printing, and personal timeline history.

2. **Session Persistence**:
   - Active user tokens are cached in `localStorage` under `dentiva_session_user`.
   - On page refresh, the session is resumed automatically without forcing re-login.

3. **Sandbox Quick-Login Bar**:
   - Built directly into the UI for instant customer demonstrations:
     - **Dr. Dentist (Doctor)**: `doctor@dentiva.com` / `doctor123`
     - **Subhajit Dey (Patient)**: `subhajit@patient.com` / `patient123`
     - **Mark Smith (Patient)**: `mark@patient.com` / `patient123`
     - **Souvik Roy (Patient)**: `souvik@patient.com` / `patient123`

---

## How to Demo to a Customer

1. **Demonstrate 1-Click Sandbox Login**:
   - On the login screen, click **Dr. Dentist (Doctor)**.
   - Show that the portal routes immediately to the doctor’s clinical overview with approval queues.
2. **Demonstrate Role Switching**:
   - Click **Secure Log Out** in the bottom left sidebar.
   - Click **Subhajit (Patient)**.
   - Show how the interface switches dynamically to personal appointments, medical timelines, and the "Book New Consultation" action.
3. **Demonstrate New Registration**:
   - Click **Secure Log Out**, then click **Request Access**.
   - Switch between **Patient Role** and **Doctor Role** tabs.
   - Fill in credentials and submit. Notice that the account is created, stored in `localStorage`, and logged in immediately with an introductory notification.
