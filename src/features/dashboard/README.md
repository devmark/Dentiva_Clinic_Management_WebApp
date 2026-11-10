# Dashboard Shell, Layout & Theming (`src/features/dashboard`)

The Dashboard module acts as the master UI shell and coordinator for both the Patient Portal and Doctor Workspace.

---

## Architecture

```
src/features/dashboard/
├── layout.js            # Shared shell: Navbar, Sidebar, Notifications Tray, Modals, Theme Toggler
├── patient-dashboard.js # Patient portal views: Overview, Consultations, Records, Blogs
├── doctor-dashboard.js  # Doctor portal views: Overview, Approvals, Patient Directory, EMR, Calendar
└── README.md            # Architecture documentation and customer tour
```

---

## Core Capabilities

1. **Role-Tailored Workspaces**:
   - Evaluates `state.user.role` to render either `renderDoctorDashboard()` or `renderPatientDashboard()`.
   - Distinct navigation menus, metrics cards, and actionable workflows for clinicians vs. patients.

2. **Dark / Light Theme System**:
   - Zero-reload instant theme toggler updating the root `[data-theme]` attribute.
   - Saves preferences to `localStorage['dentiva_theme']` so user settings persist across sessions.

3. **Responsive Mobile Drawer**:
   - Collapses into a floating hamburger menu on screens under 768px.
   - Smooth slide-in sidebar with dedicated close button and touch-friendly tap targets.

4. **Universal Modal Container**:
   - Mounts and manages state for all feature modals (`book-appointment`, `add-record`, `write-blog`, `view-blog`, `calendar-day-details`).

---

## How to Demo to a Customer

1. **Theme Switching**:
   - Click the Moon/Sun icon in the top right navbar.
   - Demonstrate the high-contrast dark mode tailored for low-light clinical examination rooms.
2. **Mobile View Simulation**:
   - Press `F12` and switch to mobile device emulation (or shrink browser width).
   - Show how the sidebar collapses cleanly into a hamburger icon and opens smoothly.
