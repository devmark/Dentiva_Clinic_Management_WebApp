/* ==========================================================================
   Dentiva Auth View Template (auth.template.js)
   Split-screen visual layout with quick-credential sandbox buttons.
   ========================================================================== */

export function renderAuthView() {
  return `
    <div class="auth-wrapper">
      <div class="auth-banner">
        <div class="logo-header" style="color: white;">
          <div class="logo-icon" style="background: white; color: var(--primary);">
            <i data-lucide="shield-check"></i>
          </div>
          <div class="logo-text" style="background: none; -webkit-text-fill-color: initial; color: white;">Dentiva</div>
        </div>
        <div class="auth-banner-content">
          <h1>Advanced Clinic Portal Architecture</h1>
          <p>Access your electronic medical charts, review pending consultations, download signed digital prescriptions, and browse advanced dental health intelligence articles.</p>
        </div>
        <div style="font-size: 0.85rem; opacity: 0.8; font-weight: 600;">
          Secure Medical Portal
        </div>
      </div>

      <div class="auth-form-side">
        <!-- 1. LOGIN CARD -->
        <div class="auth-form-card" id="login-card-wrapper">
          <div class="logo-header">
            <div class="logo-icon">
              <i data-lucide="shield-check"></i>
            </div>
            <div class="logo-text">DENTIVA CLINIC</div>
          </div>
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Please enter your secure credentials to load EMR records.</p>
          
          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="auth-email">Clinical Email</label>
              <div class="form-input-wrapper">
                <i data-lucide="mail" class="form-icon"></i>
                <input type="email" id="auth-email" class="form-input" placeholder="e.g., doctor@dentiva.com" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="auth-password">Security Password</label>
              <div class="form-input-wrapper">
                <i data-lucide="lock" class="form-icon"></i>
                <input type="password" id="auth-password" class="form-input" placeholder="••••••••" required>
              </div>
            </div>

            <button type="submit" class="btn-primary">
              <i data-lucide="unlock"></i> Sign In to Dashboard
            </button>
          </form>

          <div class="auth-footer">
            Don't have an account? <a href="#" id="toggle-to-signup">Request access</a>
          </div>

          <!-- Quick Access Credentials for Customer Demos -->
          <div class="quick-creds">
            <div class="quick-creds-title">
              <i data-lucide="bolt" style="width: 14px; height:14px;"></i> Sandbox Demo Credentials
            </div>
            <div class="quick-creds-grid" style="display: flex; flex-direction: column; gap: 8px;">
              <button class="quick-btn" id="quick-login-doctor" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; width: 100%;">
                <span class="quick-role">Dr. Dentist (Doctor)</span>
                <span class="quick-email">doctor@dentiva.com</span>
              </button>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <button class="quick-btn" id="quick-login-subhajit" style="text-align: center;">
                  <span class="quick-role">Subhajit</span>
                  <span class="quick-email" style="font-size: 0.65rem;">subhajit@...</span>
                </button>
                <button class="quick-btn" id="quick-login-mark" style="text-align: center;">
                  <span class="quick-role">Mark</span>
                  <span class="quick-email" style="font-size: 0.65rem;">mark@...</span>
                </button>
                <button class="quick-btn" id="quick-login-souvik" style="text-align: center;">
                  <span class="quick-role">Souvik</span>
                  <span class="quick-email" style="font-size: 0.65rem;">souvik@...</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. SIGNUP CARD (Hidden by default) -->
        <div class="auth-form-card" id="signup-card-wrapper" style="display: none;">
          <div class="logo-header">
            <div class="logo-icon">
              <i data-lucide="shield-check"></i>
            </div>
            <div class="logo-text">DENTIVA</div>
          </div>
          <h2 class="auth-title" id="auth-action-label">Patient Portal Registration</h2>
          <p class="auth-subtitle">Fill in information below to initialize clinic credentials.</p>

          <div class="tab-switch">
            <button type="button" class="tab-btn active" data-role="patient">Patient Role</button>
            <button type="button" class="tab-btn" data-role="doctor">Doctor Role</button>
          </div>
          
          <form id="signup-form" data-role="patient">
            <div class="form-group">
              <label class="form-label" for="signup-name">Full Name</label>
              <div class="form-input-wrapper">
                <i data-lucide="user" class="form-icon"></i>
                <input type="text" id="signup-name" class="form-input" placeholder="John Doe" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="signup-email">Secure Email</label>
              <div class="form-input-wrapper">
                <i data-lucide="mail" class="form-icon"></i>
                <input type="email" id="signup-email" class="form-input" placeholder="e.g. john@patient.com" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="signup-phone">Contact Phone</label>
              <div class="form-input-wrapper">
                <i data-lucide="phone" class="form-icon"></i>
                <input type="tel" id="signup-phone" class="form-input" placeholder="+1 (555) 012-3456" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="signup-password">Portal Password</label>
              <div class="form-input-wrapper">
                <i data-lucide="lock" class="form-icon"></i>
                <input type="password" id="signup-password" class="form-input" placeholder="••••••••" required>
              </div>
            </div>

            <button type="submit" class="btn-primary">
              <i data-lucide="check"></i> Create Secure Account
            </button>
          </form>

          <div class="auth-footer">
            Already have an account? <a href="#" id="toggle-to-login">Log In instead</a>
          </div>
        </div>

      </div>
    </div>
  `;
}
