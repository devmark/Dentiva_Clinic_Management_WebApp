/* ==========================================================================
   Dentiva PostgreSQL Database Connection & Auto-Migration Engine (db.js)
   ========================================================================== */

const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'dentiva_admin',
  password: process.env.DB_PASSWORD || 'dentiva_secure_pass_2026',
  database: process.env.DB_NAME || 'dentiva_clinic_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production') {
    console.log('Executed query', { text: text.slice(0, 80), duration, rows: res.rowCount });
  }
  return res;
}

// Initial Seeding Data
const initialUsers = [
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
];

const initialAppointments = [
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
];

const initialRecords = [
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
];

const initialBlogs = [
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
];

async function initDatabase() {
  console.log("Connecting to PostgreSQL and running migrations...");

  // 1. Create Tables
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(32) NOT NULL,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(64),
      avatar VARCHAR(16),
      dob VARCHAR(32),
      gender VARCHAR(32),
      specialty VARCHAR(255),
      license VARCHAR(64),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id VARCHAR(64) PRIMARY KEY,
      patient_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      patient_name VARCHAR(255) NOT NULL,
      patient_phone VARCHAR(64),
      doctor_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      doctor_name VARCHAR(255) NOT NULL,
      date_time VARCHAR(64) NOT NULL,
      status VARCHAR(32) DEFAULT 'pending',
      reason VARCHAR(255) NOT NULL,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS records (
      id VARCHAR(64) PRIMARY KEY,
      patient_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      date VARCHAR(32) NOT NULL,
      diagnosis TEXT NOT NULL,
      treatment TEXT NOT NULL,
      prescription TEXT NOT NULL,
      notes TEXT,
      doctor_name VARCHAR(255) NOT NULL,
      attachments JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      author_name VARCHAR(255) NOT NULL,
      author_role VARCHAR(255),
      date VARCHAR(32) NOT NULL,
      read_time VARCHAR(64),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      type VARCHAR(32) DEFAULT 'appointment',
      time VARCHAR(64) NOT NULL,
      unread BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Check if seeding is required
  const usersCheck = await query('SELECT count(*) FROM users');
  if (parseInt(usersCheck.rows[0].count, 10) === 0) {
    console.log("Empty database detected. Seeding initial clinic data...");

    for (const u of initialUsers) {
      await query(`
        INSERT INTO users (id, email, password, role, name, phone, avatar, dob, gender, specialty, license)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [u.id, u.email, u.password, u.role, u.name, u.phone, u.avatar, u.dob || null, u.gender || null, u.specialty || null, u.license || null]);
    }

    for (const a of initialAppointments) {
      await query(`
        INSERT INTO appointments (id, patient_id, patient_name, patient_phone, doctor_id, doctor_name, date_time, status, reason, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [a.id, a.patientId, a.patientName, a.patientPhone, a.doctorId, a.doctorName, a.dateTime, a.status, a.reason, a.notes]);
    }

    for (const r of initialRecords) {
      await query(`
        INSERT INTO records (id, patient_id, date, diagnosis, treatment, prescription, notes, doctor_name, attachments)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [r.id, r.patientId, r.date, r.diagnosis, r.treatment, r.prescription, r.notes, r.doctorName, JSON.stringify(r.attachments)]);
    }

    for (const b of initialBlogs) {
      await query(`
        INSERT INTO blogs (id, title, summary, content, author_name, author_role, date, read_time)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [b.id, b.title, b.summary, b.content, b.authorName, b.authorRole, b.date, b.readTime]);
    }

    console.log("Seeding completed successfully.");
  } else {
    console.log("Database already populated with clinical records.");
  }
}

module.exports = {
  pool,
  query,
  initDatabase
};
