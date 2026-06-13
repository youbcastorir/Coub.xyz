/**
 * Peczo.c.la — moderation.js
 * Spam detection, content flagging, abuse prevention, rate limiting
 */

'use strict';

// ============================================================
// MODERATION CONFIG
// ============================================================
const MOD_CONFIG = {
  maxUploadsPerHour: 15,
  maxCommentsPerMinute: 5,
  autoHideReportThreshold: 5,
  spamPatterns: [
    /\b(buy now|click here|free money|make money fast|weight loss|casino|porn|xxx|nude|naked)\b/i,
    /https?:\/\/[^\s]{3,}\.[^\s]{2,}/g, // URLs in text
    /(.)\1{6,}/,   // Repeated characters
    /\b\d{10,}\b/, // Long number sequences (phone spam)
  ],
  bannedWords: [
    'spam', 'scam', 'phishing',
  ],
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxFileSizeMB: 10,
};

// ============================================================
// RATE LIMITER
// ============================================================
const RateLimiter = (() => {
  const UPLOADS_KEY = 'pz_mod_uploads';
  const COMMENTS_KEY = 'pz_mod_comments';

  function getEvents(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch { return []; }
  }

  function saveEvents(key, events) {
    try { localStorage.setItem(key, JSON.stringify(events)); }
    catch {}
  }

  function canUpload() {
    const now = Date.now();
    const hourAgo = now - 3600000;
    const events = getEvents(UPLOADS_KEY).filter(t => t > hourAgo);
    return { allowed: events.length < MOD_CONFIG.maxUploadsPerHour, count: events.length };
  }

  function recordUpload() {
    const events = getEvents(UPLOADS_KEY);
    events.push(Date.now());
    saveEvents(UPLOADS_KEY, events.slice(-50));
  }

  function canComment() {
    const now = Date.now();
    const minuteAgo = now - 60000;
    const events = getEvents(COMMENTS_KEY).filter(t => t > minuteAgo);
    return { allowed: events.length < MOD_CONFIG.maxCommentsPerMinute, count: events.length };
  }

  function recordComment() {
    const events = getEvents(COMMENTS_KEY);
    events.push(Date.now());
    saveEvents(COMMENTS_KEY, events.slice(-50));
  }

  return { canUpload, recordUpload, canComment, recordComment };
})();

// ============================================================
// TEXT MODERATION
// ============================================================
const TextModerator = {
  isSpam(text) {
    if (!text || typeof text !== 'string') return false;
    const clean = text.trim();
    if (clean.length === 0) return false;

    // Check spam patterns
    for (const pattern of MOD_CONFIG.spamPatterns) {
      if (pattern.test(clean)) return true;
    }

    // Check banned words
    const lower = clean.toLowerCase();
    for (const word of MOD_CONFIG.bannedWords) {
      if (lower.includes(word)) return true;
    }

    // Excessive caps (> 70% uppercase in text > 10 chars)
    if (clean.length > 10) {
      const letters = clean.replace(/[^a-zA-Z]/g, '');
      if (letters.length > 5 && (letters.replace(/[a-z]/g, '').length / letters.length) > 0.7) {
        return true;
      }
    }

    return false;
  },

  moderate(text) {
    if (this.isSpam(text)) {
      return { allowed: false, reason: 'Content flagged as spam.' };
    }
    return { allowed: true };
  },

  sanitize(text) {
    if (!text) return '';
    return String(text)
      .replace(/<[^>]*>/g, '') // Strip HTML tags
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim()
      .slice(0, 500);
  },
};

// ============================================================
// IMAGE MODERATION
// ============================================================
const ImageModerator = {
  preCheck(file) {
    if (!MOD_CONFIG.allowedImageTypes.includes(file.type)) {
      return { allowed: false, reason: `File type not allowed. Use: ${MOD_CONFIG.allowedImageTypes.join(', ')}` };
    }
    if (file.size > MOD_CONFIG.maxFileSizeMB * 1024 * 1024) {
      return { allowed: false, reason: `File too large. Maximum size: ${MOD_CONFIG.maxFileSizeMB}MB` };
    }
    return { allowed: true };
  },
};

// ============================================================
// REPORT SYSTEM
// ============================================================
const ReportSystem = (() => {
  const REPORTS_KEY = 'pz_reports';

  function getAll() {
    try { return JSON.parse(localStorage.getItem(REPORTS_KEY) || '{}'); }
    catch { return {}; }
  }

  function flag(photoId, reason, details = '') {
    const reports = getAll();
    if (!reports[photoId]) {
      reports[photoId] = { count: 0, reasons: [], flaggedAt: null };
    }
    reports[photoId].count++;
    reports[photoId].reasons.push({ reason, details: details.slice(0, 200), ts: Date.now() });
    reports[photoId].flaggedAt = Date.now();

    try { localStorage.setItem(REPORTS_KEY, JSON.stringify(reports)); }
    catch {}

    // Auto-hide if threshold reached
    if (reports[photoId].count >= MOD_CONFIG.autoHideReportThreshold) {
      autoHidePhoto(photoId);
    }

    return reports[photoId];
  }

  function getPhotoReports(photoId) {
    return getAll()[photoId] || { count: 0, reasons: [] };
  }

  function isHidden(photoId) {
    const report = getPhotoReports(photoId);
    return report.count >= MOD_CONFIG.autoHideReportThreshold;
  }

  function autoHidePhoto(photoId) {
    PeczoStore.update(photoId, { hidden: true, reportCount: MOD_CONFIG.autoHideReportThreshold });
    console.info(`[Moderation] Photo ${photoId} auto-hidden after ${MOD_CONFIG.autoHideReportThreshold} reports.`);
  }

  return { flag, getPhotoReports, isHidden };
})();

// ============================================================
// UPLOAD GUARD
// ============================================================
const UploadGuard = {
  check(file) {
    // Rate limit
    const rate = RateLimiter.canUpload();
    if (!rate.allowed) {
      return {
        allowed: false,
        reason: `Upload limit reached (${MOD_CONFIG.maxUploadsPerHour} per hour). Please wait before uploading more.`,
      };
    }

    // Image check
    const imageCheck = ImageModerator.preCheck(file);
    if (!imageCheck.allowed) return imageCheck;

    return { allowed: true };
  },

  record() {
    RateLimiter.recordUpload();
  },
};

// ============================================================
// COMMENT GUARD
// ============================================================
const CommentGuard = {
  check(text) {
    // Rate limit
    const rate = RateLimiter.canComment();
    if (!rate.allowed) {
      return { allowed: false, reason: 'Too many comments. Please wait a moment.' };
    }

    // Spam check
    const spam = TextModerator.moderate(text);
    if (!spam.allowed) return spam;

    // Length
    if (!text || text.trim().length < 1) {
      return { allowed: false, reason: 'Comment cannot be empty.' };
    }
    if (text.length > 200) {
      return { allowed: false, reason: 'Comment too long (max 200 characters).' };
    }

    return { allowed: true };
  },

  record() {
    RateLimiter.recordComment();
  },
};

// ============================================================
// PUBLIC API
// ============================================================
const ModerationSystem = {
  preUploadCheck: (file) => UploadGuard.check(file),
  recordUpload: () => UploadGuard.record(),
  moderateText: (text) => TextModerator.moderate(text),
  sanitizeText: (text) => TextModerator.sanitize(text),
  isSpam: (text) => TextModerator.isSpam(text),
  checkComment: (text) => CommentGuard.check(text),
  recordComment: () => CommentGuard.record(),
  flagPhoto: (id, reason, details) => ReportSystem.flag(id, reason, details),
  isPhotoHidden: (id) => ReportSystem.isHidden(id),
  getPhotoReports: (id) => ReportSystem.getPhotoReports(id),
};

window.ModerationSystem = ModerationSystem;

// ============================================================
// PATCH STORE TO FILTER HIDDEN PHOTOS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const originalGetAll = PeczoStore.getAll.bind(PeczoStore);
  PeczoStore.getAll = function () {
    return originalGetAll().filter(p => !p.hidden);
  };

  // Patch comment guard into app comment handler
  const originalSubmitComment = document.getElementById('submitComment');
  if (originalSubmitComment) {
    originalSubmitComment.addEventListener('click', () => {
      const input = document.getElementById('commentInput');
      const text = input.value.trim();
      if (!text) return;

      const check = CommentGuard.check(text);
      if (!check.allowed) {
        window.showToast(check.reason, 'error');
        return;
      }
      CommentGuard.record();
    }, true); // capture phase so it runs before app.js handler
  }
});
