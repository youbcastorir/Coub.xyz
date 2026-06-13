/**
 * Peczo.c.la — gallery.js
 * Storage layer (localStorage) + masonry gallery + categories + trending + world map
 */

'use strict';

// ============================================================
// DEMO PHOTOS (placeholder images for first-run experience)
// ============================================================
const DEMO_PHOTOS = [
  {
    id: 'demo_001',
    title: 'Golden Hour in Sahara',
    description: 'The sky turned into fire as the sun kissed the sand dunes goodbye.',
    country: 'DZ',
    city: 'Tamanrasset',
    category: 'nature',
    tags: ['desert', 'sunset', 'sahara', 'golden-hour'],
    url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 2,
    likes: 142,
    views: 870,
    featured: true,
  },
  {
    id: 'demo_002',
    title: 'Tokyo Crossroads',
    description: 'Shibuya at night. Eight million stories converging at one intersection.',
    country: 'JP',
    city: 'Tokyo',
    category: 'cities',
    tags: ['japan', 'night', 'urban', 'neon'],
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 5,
    likes: 287,
    views: 1420,
    featured: true,
  },
  {
    id: 'demo_003',
    title: 'Lavender Fields Forever',
    description: 'Provence in bloom. The air smells of something ancient and sweet.',
    country: 'FR',
    city: 'Valensole',
    category: 'nature',
    tags: ['france', 'lavender', 'fields', 'purple'],
    url: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 8,
    likes: 198,
    views: 966,
  },
  {
    id: 'demo_004',
    title: 'Faces of Marrakech',
    description: 'The medina never sleeps. Every alley is a story.',
    country: 'MA',
    city: 'Marrakech',
    category: 'travel',
    tags: ['morocco', 'medina', 'people', 'culture'],
    url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 12,
    likes: 164,
    views: 743,
  },
  {
    id: 'demo_005',
    title: 'Amazon at Dawn',
    description: 'Mist rising from the world\'s lungs. Every breath we take starts here.',
    country: 'BR',
    city: 'Manaus',
    category: 'nature',
    tags: ['amazon', 'rainforest', 'mist', 'dawn'],
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 18,
    likes: 321,
    views: 1890,
  },
  {
    id: 'demo_006',
    title: 'Street Food in Bangkok',
    description: 'The best pad thai I have ever tasted cost 40 baht from a cart on Silom.',
    country: 'TH',
    city: 'Bangkok',
    category: 'food',
    tags: ['thailand', 'street-food', 'bangkok', 'noodles'],
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 24,
    likes: 89,
    views: 467,
  },
  {
    id: 'demo_007',
    title: 'Santorini Blue',
    description: 'White walls, blue domes, infinity sea. A cliché that earns every second.',
    country: 'GR',
    city: 'Oia',
    category: 'architecture',
    tags: ['greece', 'santorini', 'architecture', 'aegean'],
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 30,
    likes: 412,
    views: 2340,
    featured: true,
  },
  {
    id: 'demo_008',
    title: 'Lion at Rest',
    description: 'Photographed in the Masai Mara. He looked at me like I was luggage.',
    country: 'KE',
    city: 'Narok',
    category: 'animals',
    tags: ['kenya', 'lion', 'wildlife', 'safari'],
    url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 36,
    likes: 277,
    views: 1560,
  },
  {
    id: 'demo_009',
    title: 'New York After Rain',
    description: 'The city reflects itself a thousand times in every puddle.',
    country: 'US',
    city: 'New York',
    category: 'cities',
    tags: ['nyc', 'rain', 'reflection', 'street'],
    url: 'https://images.unsplash.com/photo-1546436836-07a91091f160?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 48,
    likes: 195,
    views: 1120,
  },
  {
    id: 'demo_010',
    title: 'Colosseum Dawn',
    description: 'I arrived before the crowds. For ten minutes, it was mine.',
    country: 'IT',
    city: 'Rome',
    category: 'history',
    tags: ['rome', 'colosseum', 'ancient', 'italy'],
    url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 60,
    likes: 349,
    views: 1780,
    featured: true,
  },
  {
    id: 'demo_011',
    title: 'Northern Lights Ceremony',
    description: 'Standing in minus twenty watching the sky dance. Worth every frozen finger.',
    country: 'NO',
    city: 'Tromsø',
    category: 'nature',
    tags: ['norway', 'aurora', 'northern-lights', 'arctic'],
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 72,
    likes: 517,
    views: 3210,
    featured: true,
  },
  {
    id: 'demo_012',
    title: 'Circuit Fever',
    description: 'The F1 paddock smells of carbon fiber and ambition.',
    country: 'AE',
    city: 'Abu Dhabi',
    category: 'sports',
    tags: ['f1', 'motorsport', 'racing', 'uae'],
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
    uploadedAt: Date.now() - 3600000 * 84,
    likes: 231,
    views: 1230,
  },
];

// ============================================================
// STORAGE LAYER
// ============================================================
const PeczoStore = (() => {
  const PHOTOS_KEY = 'pz_photos';
  const COMMENTS_KEY = 'pz_comments';
  const LIKES_KEY = 'pz_likes';

  function getAll() {
    try {
      const raw = localStorage.getItem(PHOTOS_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch { return []; }
  }

  function saveAll(photos) {
    try {
      localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
      document.dispatchEvent(new CustomEvent('peczo:photosUpdated'));
    } catch (e) {
      console.warn('Storage full:', e);
    }
  }

  function get(id) {
    return getAll().find(p => p.id === id) || null;
  }

  function add(photo) {
    const photos = getAll();
    photos.unshift(photo);
    saveAll(photos);
    return photo;
  }

  function remove(id) {
    saveAll(getAll().filter(p => p.id !== id));
  }

  function update(id, changes) {
    const photos = getAll();
    const idx = photos.findIndex(p => p.id === id);
    if (idx !== -1) {
      photos[idx] = { ...photos[idx], ...changes };
      saveAll(photos);
    }
  }

  function incrementView(id) {
    const photos = getAll();
    const idx = photos.findIndex(p => p.id === id);
    if (idx !== -1) {
      photos[idx].views = (photos[idx].views || 0) + 1;
      saveAll(photos);
    }
  }

  function toggleLike(id) {
    const likes = getLikes();
    const isLiked = likes.includes(id);
    const newLikes = isLiked ? likes.filter(l => l !== id) : [...likes, id];
    localStorage.setItem(LIKES_KEY, JSON.stringify(newLikes));
    // Update count
    const photos = getAll();
    const idx = photos.findIndex(p => p.id === id);
    if (idx !== -1) {
      photos[idx].likes = Math.max(0, (photos[idx].likes || 0) + (isLiked ? -1 : 1));
      saveAll(photos);
    }
    return !isLiked;
  }

  function getLikes() {
    try { return JSON.parse(localStorage.getItem(LIKES_KEY) || '[]'); }
    catch { return []; }
  }

  function isLiked(id) { return getLikes().includes(id); }

  function getComments(photoId) {
    try {
      const all = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');
      return all[photoId] || [];
    } catch { return []; }
  }

  function addComment(photoId, comment) {
    try {
      const all = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '{}');
      all[photoId] = [...(all[photoId] || []), comment];
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
    } catch {}
  }

  function seedDemoPhotos() {
    if (getAll().length === 0) {
      const demos = DEMO_PHOTOS.map(p => ({ ...p }));
      localStorage.setItem(PHOTOS_KEY, JSON.stringify(demos));
    }
  }

  return { getAll, saveAll, get, add, remove, update, incrementView, toggleLike, getLikes, isLiked, getComments, addComment, seedDemoPhotos };
})();

window.PeczoStore = PeczoStore;

// ============================================================
// CATEGORY CONFIG
// ============================================================
const CATEGORIES = [
  { id: 'travel', label: 'Travel', emoji: '✈️', bg: '#1a1030' },
  { id: 'nature', label: 'Nature', emoji: '🌿', bg: '#0d1a10' },
  { id: 'cities', label: 'Cities', emoji: '🏙️', bg: '#0d1020' },
  { id: 'art', label: 'Art', emoji: '🎨', bg: '#1a0d18' },
  { id: 'animals', label: 'Animals', emoji: '🐾', bg: '#1a1204' },
  { id: 'sports', label: 'Sports', emoji: '⚽', bg: '#0a1a14' },
  { id: 'food', label: 'Food', emoji: '🍜', bg: '#1a1108' },
  { id: 'technology', label: 'Technology', emoji: '💻', bg: '#0d1218' },
  { id: 'architecture', label: 'Architecture', emoji: '🏛️', bg: '#12101a' },
  { id: 'history', label: 'History', emoji: '📜', bg: '#1a1410' },
];

// ============================================================
// RENDER PHOTO CARD
// ============================================================
function createPhotoCard(photo) {
  const country = window.getCountry(photo.country);
  const isLiked = PeczoStore.isLiked(photo.id);
  const src = photo.dataUrl || photo.url || '';

  const div = document.createElement('div');
  div.className = 'photo-card';
  div.setAttribute('role', 'listitem');
  div.setAttribute('tabindex', '0');
  div.setAttribute('aria-label', photo.title || 'Photo');
  div.dataset.id = photo.id;

  div.innerHTML = `
    ${photo.category ? `<span class="category-badge">${photo.category}</span>` : ''}
    <img
      src="${src}"
      alt="${window.escapeHtml(photo.title || 'Photo from ' + (country ? country.name : 'the world'))}"
      loading="lazy"
      class="lazy"
      onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%231C1C26%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%236B6C7A%22 font-family=%22sans-serif%22 font-size=%2240%22 x=%22170%22 y=%22165%22%3E📷%3C/text%3E%3C/svg%3E'"
    />
    <div class="photo-card-overlay">
      <div class="photo-card-title">${window.escapeHtml(photo.title || 'Untitled')}</div>
      <div class="photo-card-meta">
        ${country ? `<span class="photo-card-flag">${country.flag}</span><span>${country.name}</span>` : ''}
        <span class="photo-card-likes">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="${isLiked ? '#FF5C35' : 'none'}" stroke="${isLiked ? '#FF5C35' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          ${photo.likes || 0}
        </span>
      </div>
    </div>
  `;

  div.addEventListener('click', () => window.openPhotoDetail(photo.id));
  div.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') window.openPhotoDetail(photo.id); });

  // Lazy load image
  const img = div.querySelector('img');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        img.classList.add('loaded');
        obs.disconnect();
      }
    });
  }, { rootMargin: '200px' });
  obs.observe(img);

  return div;
}

// ============================================================
// FILTER & SORT PHOTOS
// ============================================================
function getFilteredPhotos() {
  let photos = PeczoStore.getAll();

  // Category filter
  if (window.AppState.currentCategory) {
    photos = photos.filter(p => p.category === window.AppState.currentCategory);
  }

  // Country filter
  if (window.AppState.currentCountry) {
    photos = photos.filter(p => p.country === window.AppState.currentCountry);
  }

  // Search query
  if (window.AppState.searchQuery) {
    const q = window.AppState.searchQuery.toLowerCase();
    photos = photos.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.tags || []).some(tag => tag.toLowerCase().includes(q)) ||
      (p.city || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }

  // Sort
  switch (window.AppState.currentFilter) {
    case 'trending': photos = photos.sort((a, b) => (b.likes + b.views * 0.1) - (a.likes + a.views * 0.1)); break;
    case 'most_viewed': photos = photos.sort((a, b) => (b.views || 0) - (a.views || 0)); break;
    case 'random': photos = photos.sort(() => Math.random() - 0.5); break;
    default: photos = photos.sort((a, b) => b.uploadedAt - a.uploadedAt);
  }

  return photos;
}

// ============================================================
// RENDER GALLERY
// ============================================================
let galleryPage = 1;
const PAGE_SIZE = 12;

function renderGallery(append = false) {
  const grid = document.getElementById('photoGrid');
  const emptyEl = document.getElementById('galleryEmpty');
  const loadingEl = document.getElementById('galleryLoading');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  if (!append) {
    galleryPage = 1;
    grid.innerHTML = '';
  }

  loadingEl.style.display = 'flex';

  setTimeout(() => {
    const photos = getFilteredPhotos();
    const start = (galleryPage - 1) * PAGE_SIZE;
    const slice = photos.slice(start, start + PAGE_SIZE);

    loadingEl.style.display = 'none';
    emptyEl.hidden = photos.length > 0;
    loadMoreBtn.hidden = photos.length <= galleryPage * PAGE_SIZE;

    slice.forEach(photo => {
      grid.appendChild(createPhotoCard(photo));
    });
  }, 100);
}

window.renderGallery = renderGallery;

document.getElementById('loadMoreBtn').addEventListener('click', () => {
  galleryPage++;
  renderGallery(true);
});

// ============================================================
// RENDER CATEGORIES
// ============================================================
function renderCategories() {
  const grid = document.getElementById('categoriesGrid');
  const photos = PeczoStore.getAll();

  grid.innerHTML = CATEGORIES.map(cat => {
    const count = photos.filter(p => p.category === cat.id).length;
    return `
      <div class="category-card" data-cat="${cat.id}" role="button" tabindex="0" aria-label="Browse ${cat.label} photos">
        <span class="category-emoji">${cat.emoji}</span>
        <div class="category-name">${cat.label}</div>
        <div class="category-count">${count} photo${count !== 1 ? 's' : ''}</div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      window.AppState.currentCategory = card.dataset.cat;
      document.getElementById('categoryFilter').value = card.dataset.cat;
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
      renderGallery();
    });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') card.click(); });
  });
}

// ============================================================
// RENDER TRENDING
// ============================================================
function renderTrending() {
  const grid = document.getElementById('trendingGrid');
  const photos = PeczoStore.getAll()
    .sort((a, b) => (b.likes * 2 + b.views) - (a.likes * 2 + a.views))
    .slice(0, 8);

  if (!photos.length) {
    grid.innerHTML = '<p style="color:var(--clr-text3);text-align:center;padding:40px 0;grid-column:1/-1">No trending photos yet.</p>';
    return;
  }

  grid.innerHTML = photos.map((photo, i) => {
    const country = window.getCountry(photo.country);
    const src = photo.dataUrl || photo.url || '';
    return `
      <div class="trending-card" data-id="${photo.id}" role="button" tabindex="0" aria-label="${window.escapeHtml(photo.title || 'Photo')}">
        <span class="trending-rank">${i + 1}</span>
        <img src="${src}" alt="${window.escapeHtml(photo.title || '')}" loading="lazy"
          onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect fill=%22%231C1C26%22 width=%22400%22 height=%22200%22/%3E%3Ctext fill=%22%236B6C7A%22 font-family=%22sans-serif%22 font-size=%2240%22 x=%22170%22 y=%22115%22%3E📷%3C/text%3E%3C/svg%3E'" />
        <div class="trending-card-body">
          <div class="trending-card-title">${window.escapeHtml(photo.title || 'Untitled')}</div>
          <div class="trending-card-meta">
            ${country ? `<span>${country.flag} ${country.name}</span>` : ''}
            <span>❤️ ${photo.likes || 0}</span>
            <span>👁 ${photo.views || 0}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.trending-card').forEach(card => {
    card.addEventListener('click', () => window.openPhotoDetail(card.dataset.id));
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') card.click(); });
  });
}

// ============================================================
// WORLD MAP (Leaflet)
// ============================================================
function initWorldMap() {
  const mapEl = document.getElementById('worldMap');
  if (!mapEl || typeof L === 'undefined') return;

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  const map = L.map('worldMap', {
    center: [20, 0],
    zoom: 2,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: false,
  });

  L.tileLayer(tileUrl, {
    maxZoom: 18,
    attribution: '© CartoDB',
  }).addTo(map);

  // Plot photo countries
  const photos = PeczoStore.getAll();
  const countryCount = {};
  photos.forEach(p => {
    if (p.country) countryCount[p.country] = (countryCount[p.country] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(countryCount), 1);

  Object.entries(countryCount).forEach(([code, count]) => {
    const country = window.getCountry(code);
    if (!country) return;

    const heat = count / maxCount;
    const color = heat > 0.6 ? '#FF5C35' : heat > 0.3 ? '#F5A623' : '#8B9BAE';
    const radius = 6 + heat * 14;

    L.circleMarker([country.lat, country.lng], {
      radius,
      fillColor: color,
      color: 'rgba(255,255,255,0.2)',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.75,
    })
    .bindPopup(`
      <strong>${country.flag} ${country.name}</strong><br>
      <small>${count} photo${count !== 1 ? 's' : ''}</small>
    `)
    .addTo(map);
  });

  // Add a few markers for demo countries with no uploads
  const demoCodes = ['US', 'GB', 'IN', 'NG', 'CN', 'RU', 'BR'];
  demoCodes.forEach(code => {
    if (countryCount[code]) return;
    const country = window.getCountry(code);
    if (!country) return;
    L.circleMarker([country.lat, country.lng], {
      radius: 5,
      fillColor: '#8B9BAE',
      color: 'rgba(255,255,255,0.15)',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.4,
    }).addTo(map);
  });

  // Re-apply theme on toggle
  document.getElementById('themeToggle').addEventListener('click', () => {
    setTimeout(() => {
      const dark = document.documentElement.getAttribute('data-theme') !== 'light';
      const newTile = dark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      map.eachLayer(l => { if (l instanceof L.TileLayer) map.removeLayer(l); });
      L.tileLayer(newTile, { maxZoom: 18 }).addTo(map);
    }, 350);
  });
}

// ============================================================
// REFRESH ALL ON PHOTO UPDATES
// ============================================================
document.addEventListener('peczo:photosUpdated', () => {
  renderCategories();
  renderTrending();
});

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  PeczoStore.seedDemoPhotos();
  renderGallery();
  renderCategories();
  renderTrending();

  // Map loads when in viewport
  const mapSection = document.getElementById('map');
  const mapObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      initWorldMap();
      mapObserver.disconnect();
    }
  }, { rootMargin: '100px' });
  if (mapSection) mapObserver.observe(mapSection);
});
