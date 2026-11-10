# Clinic Scheduling Calendar (`src/features/calendar`)

The Calendar module provides clinic staff and doctors with a high-level visual agenda for patient consultations across the entire month.

---

## Architecture

```
src/features/calendar/
├── calendar.js          # Controller: month navigation, date selection handlers
├── calendar.template.js # Month grid calculation, status dot renderer, agenda modal
└── README.md            # Architecture specs and demo instructions
```

---

## Key Features

1. **Deterministic 42-Cell Matrix**:
   - Computes the active month length and accurately offsets the start day of the week (Sun-Sat).
   - Generates preceding and succeeding month padding cells with subdued opacity (`.other-month`).
   - Highlights the current day automatically with `.today`.

2. **Visual Status Dot Indicators**:
   - Days with appointments display color-coded status badges:
     - 🟡 Yellow dot: `pending` review.
     - 🟢 Green dot: `approved` consultation.
     - 🔴 Red dot: `rejected` consultation.

3. **Interactive Day Agenda Inspection**:
   - Clicking any day launches a detail modal presenting every scheduled patient on that date, their appointed time, phone number, and visit reasons.

---

## How to Demo to a Customer

1. **Inspect Clinic Agenda**:
   - Log in as **Dr. Dentist**.
   - Navigate to **Clinic Calendar** in the sidebar.
   - Use the **<** and **>** buttons to browse across months.
   - Point out days with status dots.
   - Click on any day cell with appointments (e.g. May 15, 29, or 30).
   - Show the popup modal detailing patient names, timeslots, and visit reasons.
