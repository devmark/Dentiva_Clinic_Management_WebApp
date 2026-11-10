# Dental Health Blog & Science CMS (`src/features/blogs`)

The Blogs module empowers clinic doctors to publish clinical insights, preventive dental care guidelines, and oral surgery articles directly to patients.

---

## Architecture

```
src/features/blogs/
├── blogs.js          # Controller: authoring, word-count to read-time estimation, patient broadcasting
├── blogs.template.js # Card feed layout, composer modal, reader modal
└── README.md         # Module documentation and customer presentation script
```

---

## Technical Features

1. **Integrated Authoring Engine**:
   - Doctors can write articles with HTML and Markdown formatting.
   - Calculates estimated reading time automatically based on standard average reading speeds (200 words/minute).

2. **Clinic-Wide Broadcast Pipeline**:
   - Upon publication, the controller loops through all registered `patient` accounts and broadcasts a tailored notification to their notification center.

3. **Responsive Card Feed**:
   - Patient view renders cards with author badges, publication dates, and quick read links.
   - Doctor view renders an administrative table of articles with one-click full-text inspection.

---

## How to Demo to a Customer

1. **Doctor Publishes an Article**:
   - Log in as **Dr. Dentist**.
   - Navigate to **Dental Blog Editor** (or click **Write Article** on the Overview).
   - Enter Title: `5 Myths About Teeth Whitening`.
   - Enter Summary: `Learn the truth about enamel safety and professional whitening.`.
   - Type article body and click **Publish Article Globally**.
2. **Patient Receives Broadcast**:
   - Log out and log in as **Mark Smith (Patient)**.
   - Point out the notification bell alerting that Dr. Dentist published a new article.
   - Click on **Dental Health Blog** in the sidebar, click the new card, and show the clean reading modal.
