/* ==========================================================================
   Dentiva Auth Module Controller (auth.js)
   Authentication, session persistence, role routing, and sandbox logins.
   ========================================================================== */

import { db } from '../../core/db.js';
import { state, notifyStateChange } from '../../core/state.js';
import { toast, addNotification } from '../../core/notifications.js';

export function login(email, password) {
  const users = db.get('users');
  const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (foundUser) {
    state.user = foundUser;
    state.currentPage = foundUser.role === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard';
    state.currentTab = 'overview';
    localStorage.setItem('dentiva_session_user', JSON.stringify(foundUser));
    
    addNotification(
      foundUser.id,
      `Welcome back, ${foundUser.name}! You are securely logged into your dental portal.`,
      'appointment'
    );
    
    toast(`Successfully logged in as ${foundUser.name}`, 'success');
    notifyStateChange();
    return true;
  } else {
    toast("Invalid email or password. Please try again.", "danger");
    return false;
  }
}

export function signup(name, email, phone, role, password) {
  const users = db.get('users');
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    toast("An account with this email already exists.", "danger");
    return false;
  }

  const newUser = {
    id: `usr_${role}_${Date.now()}`,
    email,
    password,
    role,
    name,
    phone,
    avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    ...(role === 'patient' 
      ? { dob: '1995-01-01', gender: 'Male' } 
      : { specialty: 'General Dentist', license: 'DDS-GEN-999' })
  };

  users.push(newUser);
  db.set('users', users);

  // Instantly log in new account
  state.user = newUser;
  state.currentPage = role === 'doctor' ? 'doctor-dashboard' : 'patient-dashboard';
  state.currentTab = 'overview';
  localStorage.setItem('dentiva_session_user', JSON.stringify(newUser));
  
  addNotification(
    newUser.id,
    `Welcome to Dentiva, ${newUser.name}! Your professional dental dashboard is ready.`,
    'appointment'
  );

  toast("Account created successfully!", "success");
  notifyStateChange();
  return true;
}

export function logout() {
  localStorage.removeItem('dentiva_session_user');
  state.user = null;
  state.currentPage = 'auth';
  state.currentTab = 'overview';
  toast("Logged out successfully.", "success");
  notifyStateChange();
}

export function bindAuthEvents() {
  // Login Form Submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      login(email, password);
    });
  }

  // Signup Form Submission
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const phone = document.getElementById('signup-phone').value;
      const password = document.getElementById('signup-password').value;
      const role = signupForm.dataset.role || 'patient';
      signup(name, email, phone, role, password);
    });
  }

  // Role Switcher in Signup Card
  const roleBtns = document.querySelectorAll('.auth-form-card .tab-btn');
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.dataset.role;
      
      const sf = document.getElementById('signup-form');
      if (sf) sf.dataset.role = role;
      
      const titleLabel = document.getElementById('auth-action-label');
      if (titleLabel) titleLabel.textContent = role === 'doctor' ? 'Doctor Portal Registration' : 'Patient Portal Registration';
    });
  });

  // Quick Login Sandbox Buttons
  const attachQuick = (id, email, pass) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        const emailInput = document.getElementById('auth-email');
        const passInput = document.getElementById('auth-password');
        if (emailInput && passInput) {
          emailInput.value = email;
          passInput.value = pass;
        }
        login(email, pass);
      });
    }
  };

  attachQuick('quick-login-doctor', 'doctor@dentiva.com', 'doctor123');
  attachQuick('quick-login-subhajit', 'subhajit@patient.com', 'patient123');
  attachQuick('quick-login-mark', 'mark@patient.com', 'patient123');
  attachQuick('quick-login-souvik', 'souvik@patient.com', 'patient123');

  // Toggle Login / Signup View
  const signupToggle = document.getElementById('toggle-to-signup');
  const loginToggle = document.getElementById('toggle-to-login');
  const loginCard = document.getElementById('login-card-wrapper');
  const signupCard = document.getElementById('signup-card-wrapper');

  if (signupToggle && loginCard && signupCard) {
    signupToggle.addEventListener('click', (e) => {
      e.preventDefault();
      loginCard.style.display = 'none';
      signupCard.style.display = 'block';
    });
  }

  if (loginToggle && loginCard && signupCard) {
    loginToggle.addEventListener('click', (e) => {
      e.preventDefault();
      loginCard.style.display = 'block';
      signupCard.style.display = 'none';
    });
  }
}
