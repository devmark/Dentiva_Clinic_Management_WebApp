/* ==========================================================================
   Dentiva Backend Express REST API Server (server.js)
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const { query, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support base64 X-rays and large clinical payloads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'dentiva-backend-api', timestamp: new Date().toISOString() });
});

// Full state hydration sync (for instant frontend initial load)
app.get('/api/sync', async (req, res) => {
  try {
    const users = await query('SELECT id, email, role, name, phone, avatar, dob, gender, specialty, license FROM users');
    const appointments = await query(`
      SELECT id, patient_id AS "patientId", patient_name AS "patientName", patient_phone AS "patientPhone",
             doctor_id AS "doctorId", doctor_name AS "doctorName", date_time AS "dateTime",
             status, reason, notes
      FROM appointments ORDER BY date_time ASC
    `);
    const records = await query(`
      SELECT id, patient_id AS "patientId", date, diagnosis, treatment, prescription, notes,
             doctor_name AS "doctorName", attachments
      FROM records ORDER BY date DESC, created_at DESC
    `);
    const blogs = await query(`
      SELECT id, title, summary, content, author_name AS "authorName", author_role AS "authorRole",
             date, read_time AS "readTime"
      FROM blogs ORDER BY created_at DESC
    `);

    res.json({
      users: users.rows,
      appointments: appointments.rows,
      records: records.rows,
      blogs: blogs.rows
    });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ error: "Failed to synchronize clinic data" });
  }
});

// ==========================================================================
// 1. Auth Endpoints
// ==========================================================================
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await query(
      'SELECT id, email, password, role, name, phone, avatar, dob, gender, specialty, license FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (result.rows.length === 0 || result.rows[0].password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = { ...result.rows[0] };
    delete user.password; // Do not leak password to client
    res.json({ success: true, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error during login" });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, phone, role, password } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    const check = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (check.rows.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const id = `usr_${role}_${Date.now()}`;
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const dob = role === 'patient' ? '1995-01-01' : null;
    const gender = role === 'patient' ? 'Male' : null;
    const specialty = role === 'doctor' ? 'General Dentist' : null;
    const license = role === 'doctor' ? 'DDS-GEN-999' : null;

    await query(`
      INSERT INTO users (id, email, password, role, name, phone, avatar, dob, gender, specialty, license)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [id, email, password, role, name, phone, avatar, dob, gender, specialty, license]);

    const newUser = { id, email, role, name, phone, avatar, dob, gender, specialty, license };
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error during signup" });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, email, role, name, phone, avatar, dob, gender, specialty, license FROM users'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ==========================================================================
// 2. Appointments Endpoints
// ==========================================================================
app.get('/api/appointments', async (req, res) => {
  try {
    const { patientId } = req.query;
    let text = `
      SELECT id, patient_id AS "patientId", patient_name AS "patientName", patient_phone AS "patientPhone",
             doctor_id AS "doctorId", doctor_name AS "doctorName", date_time AS "dateTime",
             status, reason, notes
      FROM appointments
    `;
    const params = [];
    if (patientId) {
      text += ' WHERE patient_id = $1';
      params.push(patientId);
    }
    text += ' ORDER BY date_time ASC';

    const result = await query(text, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { date, time, reason, notes, patientId, patientName, patientPhone } = req.body;
  if (!date || !time || !reason || !patientId) {
    return res.status(400).json({ error: "Missing required appointment fields" });
  }

  const targetDateTime = `${date}T${time}`;

  try {
    // Conflict check
    const conflict = await query(
      'SELECT id FROM appointments WHERE date_time = $1 AND status = $2',
      [targetDateTime, 'approved']
    );
    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: "This slot is already approved for another patient. Please select another slot." });
    }

    const id = `apt_${Date.now()}`;
    const doctorId = "usr_doc_1";
    const doctorName = "Dr. Dentist";

    await query(`
      INSERT INTO appointments (id, patient_id, patient_name, patient_phone, doctor_id, doctor_name, date_time, status, reason, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [id, patientId, patientName, patientPhone, doctorId, doctorName, targetDateTime, 'pending', reason, notes || '']);

    const newApt = { id, patientId, patientName, patientPhone, doctorId, doctorName, dateTime: targetDateTime, status: 'pending', reason, notes: notes || '' };
    res.status(201).json({ success: true, appointment: newApt });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Failed to reserve appointment" });
  }
});

app.patch('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Status is required" });

  try {
    const result = await query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING id, patient_id AS "patientId", date_time AS "dateTime", status',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ success: true, appointment: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to update appointment status" });
  }
});

// ==========================================================================
// 3. Medical Records & Attachments Endpoints
// ==========================================================================
app.get('/api/records', async (req, res) => {
  try {
    const { patientId } = req.query;
    let text = `
      SELECT id, patient_id AS "patientId", date, diagnosis, treatment, prescription, notes,
             doctor_name AS "doctorName", attachments
      FROM records
    `;
    const params = [];
    if (patientId) {
      text += ' WHERE patient_id = $1';
      params.push(patientId);
    }
    text += ' ORDER BY date DESC, created_at DESC';

    const result = await query(text, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch medical records" });
  }
});

app.post('/api/records', async (req, res) => {
  const { patientId, diagnosis, treatment, prescription, notes, doctorName, attachments } = req.body;
  if (!patientId || !diagnosis || !treatment || !prescription) {
    return res.status(400).json({ error: "Clinical diagnosis, treatment, and prescription are required" });
  }

  try {
    const id = `rec_${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const parsedAttachments = Array.isArray(attachments) ? attachments : [];

    await query(`
      INSERT INTO records (id, patient_id, date, diagnosis, treatment, prescription, notes, doctor_name, attachments)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [id, patientId, date, diagnosis, treatment, prescription, notes || '', doctorName || 'Dr. Dentist', JSON.stringify(parsedAttachments)]);

    const newRecord = {
      id,
      patientId,
      date,
      diagnosis,
      treatment,
      prescription,
      notes: notes || '',
      doctorName: doctorName || 'Dr. Dentist',
      attachments: parsedAttachments
    };

    res.status(201).json({ success: true, record: newRecord });
  } catch (err) {
    console.error("Record creation error:", err);
    res.status(500).json({ error: "Failed to save EMR chart entry" });
  }
});

// ==========================================================================
// 4. Blogs Endpoints
// ==========================================================================
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await query(`
      SELECT id, title, summary, content, author_name AS "authorName", author_role AS "authorRole",
             date, read_time AS "readTime"
      FROM blogs ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

app.post('/api/blogs', async (req, res) => {
  const { title, summary, content, authorName, authorRole } = req.body;
  if (!title || !summary || !content) {
    return res.status(400).json({ error: "Title, summary, and content are required" });
  }

  try {
    const id = `blg_${Date.now()}`;
    const date = new Date().toISOString().split('T')[0];
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    await query(`
      INSERT INTO blogs (id, title, summary, content, author_name, author_role, date, read_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [id, title, summary, content, authorName || 'Dr. Dentist', authorRole || 'DDS, Lead Orthodontist', date, readTime]);

    const newBlog = {
      id, title, summary, content, authorName: authorName || 'Dr. Dentist', authorRole: authorRole || 'DDS, Lead Orthodontist', date, readTime
    };

    res.status(201).json({ success: true, blog: newBlog });
  } catch (err) {
    res.status(500).json({ error: "Failed to publish article" });
  }
});

// ==========================================================================
// 5. Notifications Endpoints
// ==========================================================================
app.get('/api/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await query(
      'SELECT id, user_id AS "userId", message, type, time, unread FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.post('/api/notifications', async (req, res) => {
  const { userId, message, type } = req.body;
  if (!userId || !message) return res.status(400).json({ error: "User ID and message required" });

  try {
    const id = `not_${Date.now()}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString();

    await query(`
      INSERT INTO notifications (id, user_id, message, type, time, unread)
      VALUES ($1, $2, $3, $4, $5, TRUE)
    `, [id, userId, message, type || 'appointment', time]);

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

app.patch('/api/notifications/:userId/read', async (req, res) => {
  const { userId } = req.params;
  try {
    await query('UPDATE notifications SET unread = FALSE WHERE user_id = $1', [userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notifications read" });
  }
});

// Startup with Database Connection Retry Loop
async function startServer() {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await initDatabase();
      break;
    } catch (err) {
      retries++;
      console.warn(`Database not ready yet (attempt ${retries}/${maxRetries}): ${err.message}. Retrying in 3 seconds...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`Dentiva Clinical REST API running on port ${PORT}`);
    console.log(`Connected to PostgreSQL Database`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`====================================================`);
  });
}

startServer();
