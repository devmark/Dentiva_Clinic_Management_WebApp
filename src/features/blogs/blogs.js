/* ==========================================================================
   Dentiva Dental Blogs Controller (blogs.js)
   Article authoring, reading time calculation, patient broadcast notifications.
   ========================================================================== */

import { db } from '../../core/db.js';
import { state, notifyStateChange } from '../../core/state.js';
import { toast, addNotification } from '../../core/notifications.js';

export function addBlogPost(title, summary, content) {
  if (!title || !summary || !content) {
    toast("Please fill in all article fields.", "warning");
    return false;
  }

  const blogs = db.get('blogs');
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const newPost = {
    id: `blg_${Date.now()}`,
    title,
    summary,
    content,
    authorName: state.user.name,
    authorRole: state.user.specialty || "DDS, Lead Orthodontist",
    date: new Date().toISOString().split('T')[0],
    readTime: `${readTimeMinutes} min read`
  };

  blogs.unshift(newPost);
  db.set('blogs', blogs);

  // Broadcast notification to all registered patients
  const users = db.get('users');
  users.forEach(u => {
    if (u.role === 'patient') {
      addNotification(
        u.id,
        `Dr. Dentist published a new article: "${title}". Read it in your blog view.`,
        'record'
      );
    }
  });

  // Reset form cache and switch view
  state.forms.writeBlog = { title: '', summary: '', content: '' };
  state.activeModal = null;
  state.currentTab = 'blogs';
  toast("Dental article published globally!", "success");
  notifyStateChange();
  return true;
}

export function bindBlogEvents() {
  // Read Article Click (Patient or Doctor view)
  const blogCards = document.querySelectorAll('.blog-card[data-blog-id]');
  blogCards.forEach(card => {
    card.addEventListener('click', () => {
      state.activeModal = 'view-blog';
      state.selectedBlogId = card.dataset.blogId;
      notifyStateChange();
    });
  });

  // Table row click in Doctor view
  const blogRows = document.querySelectorAll('tr[data-blog-id]');
  blogRows.forEach(row => {
    row.addEventListener('click', () => {
      state.activeModal = 'view-blog';
      state.selectedBlogId = row.dataset.blogId;
      notifyStateChange();
    });
  });

  // Open Composer Modal (Doctor view)
  const openBlogBtn = document.getElementById('btn-open-blog-modal');
  if (openBlogBtn) {
    openBlogBtn.addEventListener('click', () => {
      state.activeModal = 'write-blog';
      notifyStateChange();
    });
  }

  // Article Form Inputs Caching
  const blogTitleInput = document.getElementById('blog-title');
  if (blogTitleInput) {
    blogTitleInput.addEventListener('input', () => {
      state.forms.writeBlog.title = blogTitleInput.value;
    });
  }
  const blogSummaryInput = document.getElementById('blog-summary');
  if (blogSummaryInput) {
    blogSummaryInput.addEventListener('input', () => {
      state.forms.writeBlog.summary = blogSummaryInput.value;
    });
  }
  const blogContentInput = document.getElementById('blog-content');
  if (blogContentInput) {
    blogContentInput.addEventListener('input', () => {
      state.forms.writeBlog.content = blogContentInput.value;
    });
  }

  // Submit New Article
  const blogForm = document.getElementById('write-blog-form');
  if (blogForm) {
    blogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cache = state.forms.writeBlog;
      addBlogPost(cache.title, cache.summary, cache.content);
    });
  }
}
