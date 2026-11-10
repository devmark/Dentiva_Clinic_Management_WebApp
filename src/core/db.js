/* ==========================================================================
   Dentiva Core Database Layer (db.js)
   LocalStorage caching engine with live PostgreSQL synchronization via api.js.
   ========================================================================== */

import { api } from './api.js';

export const seedData = {
  users: [
    {
      id: "usr_doc_1",
      email: "doctor@dentiva.com",
      password: "doctor123",
      role: "doctor",
      name: "Dr. Dentist",
      phone: "+91 98765 43210",
      avatar: "LA",
      specialty: "Lead Orthodontist & Oral Surgeon",
      license: "DDS-2026-001"
    },
    {
      id: "usr_pat_1",
      email: "subhajit@patient.com",
      password: "patient123",
      role: "patient",
      name: "Subhajit Dey",
      phone: "+91 98300 12345",
      avatar: "SD",
      dob: "1996-05-12",
      gender: "Male"
    },
    {
      id: "usr_pat_2",
      email: "mark@patient.com",
      password: "patient123",
      role: "patient",
      name: "Mark Smith",
      phone: "+1 (555) 015-8855",
      avatar: "MS",
      dob: "1990-03-30",
      gender: "Male"
    },
    {
      id: "usr_pat_3",
      email: "souvik@patient.com",
      password: "patient123",
      role: "patient",
      name: "Souvik Roy",
      phone: "+91 94330 98765",
      avatar: "SR",
      dob: "1997-12-05",
      gender: "Male"
    }
  ],
  appointments: [
    {
      id: "apt_1",
      patientId: "usr_pat_1",
      patientName: "Subhajit Dey",
      patientPhone: "+91 98300 12345",
      doctorId: "usr_doc_1",
      doctorName: "Dr. Dentist",
      dateTime: "2026-05-15T10:00",
      status: "approved",
      reason: "Regular Dental Checkup",
      notes: "General scaling and polishing needed."
    },
    {
      id: "apt_2",
      patientId: "usr_pat_2",
      patientName: "Mark Smith",
      patientPhone: "+1 (555) 015-8855",
      doctorId: "usr_doc_1",
      doctorName: "Dr. Dentist",
      dateTime: "2026-05-30T14:00",
      status: "approved",
      reason: "Root Canal Follow-up",
      notes: "Evaluate dental post and finalize crown prep."
    },
    {
      id: "apt_3",
      patientId: "usr_pat_3",
      patientName: "Souvik Roy",
      patientPhone: "+91 94330 98765",
      doctorId: "usr_doc_1",
      doctorName: "Dr. Dentist",
      dateTime: "2026-05-29T09:30",
      status: "pending",
      reason: "Wisdom Tooth Pain Consultation",
      notes: "Severe throbbing in lower-right wisdom tooth quadrant."
    }
  ],
  records: [
    {
      id: "rec_1",
      patientId: "usr_pat_1",
      date: "2026-05-15",
      diagnosis: "Mild Dental Caries & Dental Calculus",
      treatment: "Prophylaxis (Deep Scaling) & Composite Resin Filling",
      prescription: "Chlorhexidine Gluconate 0.12% Oral Rinse\n- Rinse 15ml twice daily (morning & night) after brushing for 7 days.\n\nIbuprofen 400mg tablets\n- Take 1 tablet every 6 hours as needed for post-treatment soreness (Max 4/day).",
      notes: "Deep pocket scaling on molar teeth. Caries excavated on tooth #14 and composite filling placed. Patient advised to floss daily and switch to a soft-bristled toothbrush.",
      doctorName: "Dr. Dentist",
      attachments: [
        {
          name: "Initial_Panoramic_Xray.jpg",
          dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250' style='background:%230f172a;color:%2338bdf8;'><rect width='400' height='250' fill='%230f172a'/><path d='M80 80 Q100 150 120 80 T160 80' stroke='%2338bdf8' stroke-width='4' fill='none'/><path d='M220 80 Q240 150 260 80 T300 80' stroke='%2338bdf8' stroke-width='4' fill='none'/><path d='M80 180 Q100 110 120 180 T160 180' stroke='%2338bdf8' stroke-width='4' fill='none'/><path d='M220 180 Q240 110 260 180 T300 180' stroke='%2338bdf8' stroke-width='4' fill='none'/><line x1='50' y1='125' x2='350' y2='125' stroke='%23334155' stroke-dasharray='5'/><text x='150' y='40' fill='%2364748b' font-family='sans-serif' font-size='12' font-weight='bold'>DENTIVA EMR - UPPER MANDIBLE</text><text x='150' y='225' fill='%2364748b' font-family='sans-serif' font-size='12' font-weight='bold'>PANORAMIC DENTAL X-RAY</text></svg>"
        }
      ]
    }
  ],
  blogs: [
    {
      id: "blg_1",
      title: "The Importance of Flossing: More Than Just Food Removal",
      summary: "Why flossing daily is critical for preventing aggressive gum disease and protecting your overall cardiovascular health.",
      content: "Many of us believe that flossing is simply a tool to remove food particles stuck between teeth. However, flossing plays a much deeper role in your oral hygiene regimen. Flossing reaches the plaque and harmful bacterial colonies that live beneath the gumline, which standard toothbrushes cannot touch.<br><br>If plaque is allowed to accumulate beneath the gums, it hardens into calculus (tartar) and leads to **Gingivitis**—characterized by bleeding gums and chronic inflammation. Left untreated, it evolves into **Periodontitis**, which leads to bone loss and tooth mobility. Research has also shown that chronic oral bacteria can enter the bloodstream and trigger inflammation in cardiovascular arteries, increasing heart disease risk. Make sure to floss at least once a day before going to bed!",
      authorName: "Dr. Dentist",
      authorRole: "DDS, Lead Orthodontist",
      date: "2026-05-20",
      readTime: "3 min read"
    },
    {
      id: "blg_2",
      title: "Demystifying Root Canals: What to Truly Expect",
      summary: "Shattering the myths surrounding root canal therapy and why it is actually a virtually painless, tooth-saving procedure.",
      content: "The phrase 'root canal' has unfortunately become synonymous with dental discomfort. In modern dentistry, however, this perception is completely outdated. A root canal (endodontic treatment) is actually a highly sophisticated, virtually painless procedure designed specifically to **relieve** severe tooth pain and save your natural tooth from extraction.<br><br>When the dental pulp (containing nerves and blood vessels) becomes infected due to deep decay or trauma, it triggers excruciating throbbing pain. During a root canal, the doctor applies local anesthesia to completely numb the area, opens the tooth crown, cleans out the infected pulp cavity, sterilizes the canals, and seals them with a biocompatible material (gutta-percha). A crown is later placed to restore structural integrity. Don't fear the procedure—embrace it as the best way to save your tooth!",
      authorName: "Dr. Dentist",
      authorRole: "DDS, Lead Orthodontist",
      date: "2026-05-25",
      readTime: "4 min read"
    }
  ]
};

export const db = {
  get: (table) => {
    try {
      const data = localStorage.getItem(`dentiva_${table}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Database read error:", table, e);
      return [];
    }
  },

  set: (table, data) => {
    try {
      localStorage.setItem(`dentiva_${table}`, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Database write error:", table, e);
      return false;
    }
  },

  init: async (onServerSynced) => {
    // 1. Initialize local cache fallback
    ['users', 'appointments', 'records', 'blogs'].forEach(table => {
      if (!localStorage.getItem(`dentiva_${table}`)) {
        db.set(table, seedData[table]);
      }
    });

    if (!localStorage.getItem('dentiva_notifications')) {
      db.set('notifications', []);
    }

    // 2. Perform live synchronization with PostgreSQL backend if reachable
    try {
      const syncRes = await api.syncAll();
      if (syncRes.ok && syncRes.data) {
        const { users, appointments, records, blogs } = syncRes.data;
        if (users && users.length) db.set('users', users);
        if (appointments) db.set('appointments', appointments);
        if (records) db.set('records', records);
        if (blogs) db.set('blogs', blogs);

        console.log("Database synchronized with PostgreSQL backend.");
        if (typeof onServerSynced === 'function') {
          onServerSynced();
        }
      }
    } catch (e) {
      console.log("Operating with local storage cache fallback.");
    }
  }
};
