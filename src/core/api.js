/* ==========================================================================
   Dentiva Frontend API Client (api.js)
   Communicates with the backend REST API (PostgreSQL database) with offline fallback.
   ========================================================================== */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.error || `Server responded with ${res.status}`;
      return { ok: false, status: res.status, error: errorMsg, data: null };
    }

    return { ok: true, status: res.status, data, error: null };
  } catch (err) {
    // Network failure (e.g. running purely offline or without backend)
    return { ok: false, status: 0, error: err.message, data: null };
  }
}

export const api = {
  // Check if live backend server is reachable
  checkHealth: async () => {
    const res = await request('/health');
    return res.ok;
  },

  // Hydrate full clinic database state from PostgreSQL
  syncAll: async () => {
    return await request('/sync');
  },

  // Authentication
  auth: {
    login: async (email, password) => {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },
    signup: async (payload) => {
      return await request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }
  },

  // Appointments
  appointments: {
    getAll: async (patientId) => {
      const q = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
      return await request(`/appointments${q}`);
    },
    create: async (appointmentData) => {
      return await request('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData)
      });
    },
    updateStatus: async (id, status) => {
      return await request(`/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    }
  },

  // Medical Records (EMR)
  records: {
    getAll: async (patientId) => {
      const q = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
      return await request(`/records${q}`);
    },
    create: async (recordData) => {
      return await request('/records', {
        method: 'POST',
        body: JSON.stringify(recordData)
      });
    }
  },

  // Blogs
  blogs: {
    getAll: async () => {
      return await request('/blogs');
    },
    create: async (blogData) => {
      return await request('/blogs', {
        method: 'POST',
        body: JSON.stringify(blogData)
      });
    }
  },

  // Notifications
  notifications: {
    get: async (userId) => {
      return await request(`/notifications/${userId}`);
    },
    create: async (userId, message, type) => {
      return await request('/notifications', {
        method: 'POST',
        body: JSON.stringify({ userId, message, type })
      });
    },
    markRead: async (userId) => {
      return await request(`/notifications/${userId}/read`, {
        method: 'PATCH'
      });
    }
  }
};
