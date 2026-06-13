/**
 * Peczo.c.la — upload.js
 * Drag-and-drop upload, validation, compression, localStorage save
 */

'use strict';

// ============================================================
// CONFIG
// ============================================================
const UPLOAD_CONFIG = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxWidth: 1600,
  quality: 0.85,
};

// ============================================================
// STATE
// ============================================================
const UploadState = {
  file: null,
  dataUrl: null,
  ready: false,
};

// ============================================================
// GENERATE ID
// ============================================================
function generateId() {
  return 'pz_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

// ============================================================
// COMPRESS IMAGE
// ============================================================
function compressImage(file, maxWidth, quality) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/gif' ? 'image/gif' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ============================================================
// VALIDATE FILE
// ============================================================
function validateFile(file) {
  if (!UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, WebP, and GIF images are allowed.' };
  }
  if (file.size > UPLOAD_CONFIG.maxSizeBytes) {
    return { valid: false, error: `File is too large. Maximum size is ${UPLOAD_CONFIG.maxSizeBytes / 1024 / 1024}MB.` };
  }
  return { valid: true };
}

// ============================================================
// HANDLE FILE SELECTION
// ============================================================
async function handleFileSelect(file) {
  const dropZone = document.getElementById('dropZone');
  const dropInner = document.getElementById('dropInner');
  const dropPreview = document.getElementById('dropPreview');

  const validation = validateFile(file);
  if (!validation.valid) {
    window.showToast(validation.error, 'error');
    return;
  }

  // Moderation: basic check before upload
  if (typeof ModerationSystem !== 'undefined') {
    const modCheck = ModerationSystem.preUploadCheck(file);
    if (!modCheck.allowed) {
      window.showToast(modCheck.reason, 'error');
      return;
    }
  }

  UploadState.file = file;

  // Show loading state
  dropInner.style.opacity = '0.3';

  try {
    const dataUrl = await compressImage(file, UPLOAD_CONFIG.maxWidth, UPLOAD_CONFIG.quality);
    UploadState.dataUrl = dataUrl;

    // Show preview
    dropPreview.src = dataUrl;
    dropPreview.removeAttribute('hidden');
    dropPreview.style.opacity = '0';
    dropPreview.style.transition = 'opacity 0.3s';
    setTimeout(() => { dropPreview.style.opacity = '1'; }, 50);

    dropInner.style.opacity = '0';
    dropInner.style.position = 'absolute';

    UploadState.ready = true;
    updateSubmitButton();
  } catch (e) {
    window.showToast('Failed to process image. Please try another.', 'error');
    dropInner.style.opacity = '1';
  }
}

// ============================================================
// UPDATE SUBMIT BUTTON
// ============================================================
function updateSubmitButton() {
  const btn = document.getElementById('submitUpload');
  const consent = document.getElementById('uploadConsent');
  btn.disabled = !(UploadState.ready && consent.checked);
}

// ============================================================
// RESET UPLOAD FORM
// ============================================================
function resetUploadForm() {
  UploadState.file = null;
  UploadState.dataUrl = null;
  UploadState.ready = false;

  const dropInner = document.getElementById('dropInner');
  const dropPreview = document.getElementById('dropPreview');

  dropPreview.setAttribute('hidden', '');
  dropPreview.src = '';
  dropInner.style.opacity = '1';
  dropInner.style.position = '';

  document.getElementById('photoTitle').value = '';
  document.getElementById('photoDesc').value = '';
  document.getElementById('photoCountry').value = '';
  document.getElementById('photoCity').value = '';
  document.getElementById('photoCategory').value = '';
  document.getElementById('photoTags').value = '';
  document.getElementById('uploadConsent').checked = false;
  document.getElementById('fileInput').value = '';
  document.getElementById('uploadProgress').setAttribute('hidden', '');
  document.getElementById('progressFill').style.width = '0';

  updateSubmitButton();
}

// ============================================================
// SIMULATE PROGRESS
// ============================================================
function simulateProgress(onComplete) {
  const progress = document.getElementById('uploadProgress');
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');

  progress.removeAttribute('hidden');
  let pct = 0;

  const interval = setInterval(() => {
    pct += Math.random() * 18 + 5;
    if (pct >= 95) { pct = 95; clearInterval(interval); }
    fill.style.width = pct + '%';
  }, 120);

  setTimeout(() => {
    clearInterval(interval);
    fill.style.width = '100%';
    label.textContent = '✓ Published!';
    setTimeout(onComplete, 600);
  }, 1400);
}

// ============================================================
// SUBMIT UPLOAD
// ============================================================
function submitUpload() {
  if (!UploadState.ready) return;

  const title = document.getElementById('photoTitle').value.trim();
  const description = document.getElementById('photoDesc').value.trim();
  const country = document.getElementById('photoCountry').value;
  const city = document.getElementById('photoCity').value.trim();
  const category = document.getElementById('photoCategory').value;
  const tagsRaw = document.getElementById('photoTags').value;

  // Content moderation check
  if (typeof ModerationSystem !== 'undefined') {
    const textCheck = ModerationSystem.moderateText(title + ' ' + description);
    if (!textCheck.allowed) {
      window.showToast('Content flagged: ' + textCheck.reason, 'error');
      return;
    }
  }

  const tags = tagsRaw
    .split(',')
    .map(t => t.trim().toLowerCase().replace(/[^a-z0-9À-ÿ\u0600-\u06FF\-]/g, ''))
    .filter(t => t.length > 0 && t.length < 30)
    .slice(0, 10);

  const photo = {
    id: generateId(),
    title: title || 'Untitled',
    description,
    country,
    city,
    category,
    tags,
    dataUrl: UploadState.dataUrl,
    uploadedAt: Date.now(),
    likes: 0,
    views: 0,
    reported: false,
    reportCount: 0,
  };

  // Disable submit
  const btn = document.getElementById('submitUpload');
  btn.disabled = true;
  btn.textContent = 'Publishing…';

  simulateProgress(() => {
    PeczoStore.add(photo);

    // Close modal and reset
    if (typeof closeModal === 'function') closeModal('uploadModal');
    resetUploadForm();

    // Refresh gallery
    if (typeof renderGallery === 'function') renderGallery();
    if (typeof renderCategories === 'function') renderCategories();
    if (typeof renderTrending === 'function') renderTrending();

    window.showToast(window.t('photo_uploaded'), 'success', 4000);

    // Scroll to top of gallery
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });

    btn.textContent = window.t('publish_photo') || 'Publish Photo';
    btn.disabled = false;
  });
}

// ============================================================
// DRAG AND DROP
// ============================================================
function initDragAndDrop() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  // Click to open file dialog
  dropZone.addEventListener('click', (e) => {
    if (e.target !== fileInput) fileInput.click();
  });
  dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') fileInput.click();
  });

  // File input change
  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFileSelect(fileInput.files[0]);
  });

  // Drag over
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });
  dropZone.addEventListener('dragleave', (e) => {
    if (!dropZone.contains(e.relatedTarget)) {
      dropZone.classList.remove('drag-over');
    }
  });

  // Drop
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  });

  // Global drag
  document.addEventListener('dragover', (e) => e.preventDefault());
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // Open upload modal if not open
      const modal = document.getElementById('uploadModal');
      if (modal.hasAttribute('hidden')) {
        modal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
      }
      handleFileSelect(file);
    }
  });
}

// ============================================================
// PASTE TO UPLOAD
// ============================================================
function initPasteUpload() {
  document.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const modal = document.getElementById('uploadModal');
          if (modal.hasAttribute('hidden')) {
            modal.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';
          }
          handleFileSelect(file);
        }
      }
    }
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initDragAndDrop();
  initPasteUpload();

  // Consent toggle
  document.getElementById('uploadConsent').addEventListener('change', updateSubmitButton);

  // Any field change
  ['photoTitle', 'photoDesc', 'photoCountry', 'photoCategory', 'photoTags', 'photoCity'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateSubmitButton);
  });

  // Submit
  document.getElementById('submitUpload').addEventListener('click', submitUpload);

  // Reset on modal close
  document.getElementById('closeUploadBtn').addEventListener('click', resetUploadForm);
  document.getElementById('uploadModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) resetUploadForm();
  });
});
