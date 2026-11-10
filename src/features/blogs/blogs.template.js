/* ==========================================================================
   Dentiva Dental Blogs & Article CMS Templates (blogs.template.js)
   Public health intelligence cards, composer modal, and article reading view.
   ========================================================================== */

import { state } from '../../core/state.js';
import { db } from '../../core/db.js';

export function renderPatientBlogFeed(blogs) {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h2>Dental Health & Science Intelligence</h2>
        <p>Professional health tips and articles published by Dentiva clinic doctors.</p>
      </div>
    </div>

    <div class="blog-grid">
      ${blogs.length === 0
        ? `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px; background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-md);">No articles published yet.</div>`
        : blogs.map(b => `
            <div class="blog-card" data-blog-id="${b.id}" style="cursor: pointer;">
              <div>
                <div class="blog-image">
                  <i data-lucide="shield-check" style="width: 48px; height: 48px; opacity:0.3;"></i>
                  <span class="blog-badge">Oral Science</span>
                </div>
                <div class="blog-card-body">
                  <span class="blog-date-time">${b.date} &bull; ${b.readTime}</span>
                  <h3 class="blog-card-title">${b.title}</h3>
                  <p class="blog-card-summary">${b.summary}</p>
                </div>
              </div>
              <div class="blog-card-footer">
                <div class="blog-author">
                  <div class="blog-author-avatar">LA</div>
                  <span class="blog-author-name">${b.authorName}</span>
                </div>
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); display:flex; align-items:center; gap:4px;">
                  Read Article <i data-lucide="chevron-right" style="width: 14px;"></i>
                </span>
              </div>
            </div>
          `).join('')}
    </div>
  `;
}

export function renderDoctorBlogManager(blogs) {
  return `
    <div class="page-header">
      <div class="page-title-group">
        <h2>Dental Article Composer</h2>
        <p>Publish clinical articles, tips, and science updates to all patient portal grids.</p>
      </div>
      <button class="btn-primary" id="btn-open-blog-modal">
        <i data-lucide="plus-circle"></i> Compose New Article
      </button>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Active Health Science Feed</h3>
      </div>
      <div class="card-body" style="padding: 0;">
        <div class="table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Publish Date</th>
                <th>Article Title</th>
                <th>Brief Summary Teaser</th>
                <th>Length</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              ${blogs.length === 0
                ? `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 30px;">No articles published yet. Compose one!</td></tr>`
                : blogs.map(b => `
                    <tr data-blog-id="${b.id}" style="cursor: pointer;">
                      <td><strong>${b.date}</strong></td>
                      <td><strong>${b.title}</strong></td>
                      <td>${b.summary}</td>
                      <td>${b.readTime}</td>
                      <td>${b.authorName}</td>
                    </tr>
                  `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function renderWriteBlogModal() {
  const cache = state.forms.writeBlog;

  return `
    <form id="write-blog-form">
      <div class="form-group">
        <label class="form-label">Article Title</label>
        <input type="text" id="blog-title" class="form-input" style="padding-left: 16px;" placeholder="e.g. Why Fluoride Prevents Cavities: The Chemistry" value="${cache.title}" required>
      </div>

      <div class="form-group">
        <label class="form-label">Brief Summary (SEO Meta description)</label>
        <input type="text" id="blog-summary" class="form-input" style="padding-left: 16px;" placeholder="A compelling 1-sentence synopsis of the article..." value="${cache.summary}" required>
      </div>

      <div class="form-group">
        <label class="form-label">Article Content (HTML supported)</label>
        <textarea id="blog-content" class="form-input" style="padding-left: 16px; min-height: 200px; line-height: 1.6;" placeholder="Type article content here. Use paragraphs and HTML tags for styling..." required>${cache.content}</textarea>
      </div>

      <button type="submit" class="btn-primary" style="margin-top: 15px;">
        <i data-lucide="globe"></i> Publish Article Globally
      </button>
    </form>
  `;
}

export function renderViewBlogModal() {
  const blogs = db.get('blogs');
  const blog = blogs.find(b => b.id === state.selectedBlogId);
  if (!blog) return { title: 'Article Not Found', body: '' };

  return {
    title: blog.title,
    body: `
      <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px; font-weight:600;">
        Published by ${blog.authorName} (${blog.authorRole}) &bull; ${blog.date} &bull; ${blog.readTime}
      </div>
      <div style="line-height: 1.7; font-size: 0.95rem; color: var(--text-main);">
        ${blog.content}
      </div>
    `
  };
}
