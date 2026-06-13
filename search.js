/**
 * Peczo.c.la — search.js
 * Live search with overlay, keyword + tag + country + category filtering
 */

'use strict';

// ============================================================
// SEARCH OVERLAY HTML (injected once)
// ============================================================
function createSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'searchOverlay';
  overlay.className = 'search-overlay';
  overlay.setAttribute('hidden', '');
  overlay.setAttribute('role', 'search');
  overlay.innerHTML = `
    <div class="search-overlay-inner">
      <div class="search-overlay-header">
        <h2 class="search-overlay-title" id="searchResultTitle">Results for "<span id="searchQueryDisplay"></span>"</h2>
        <button class="btn-search-close" id="closeSearchOverlay">✕ Close</button>
      </div>
      <div class="search-filters-row" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:28px;">
        <select id="searchCatFilter" class="filter-select" style="width:auto;">
          <option value="">All Categories</option>
          <option value="travel">✈️ Travel</option>
          <option value="nature">🌿 Nature</option>
          <option value="cities">🏙️ Cities</option>
          <option value="art">🎨 Art</option>
          <option value="animals">🐾 Animals</option>
          <option value="sports">⚽ Sports</option>
          <option value="food">🍜 Food</option>
          <option value="technology">💻 Technology</option>
          <option value="architecture">🏛️ Architecture</option>
          <option value="history">📜 History</option>
        </select>
        <select id="searchCountryFilter" class="filter-select" style="width:auto;">
          <option value="">All Countries</option>
        </select>
        <select id="searchSortFilter" class="filter-select" style="width:auto;">
          <option value="relevant">Most Relevant</option>
          <option value="recent">Most Recent</option>
          <option value="likes">Most Liked</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>
      <div class="masonry-grid" id="searchResultGrid" role="list"></div>
      <div id="searchEmpty" hidden style="text-align:center;padding:80px 20px;color:var(--clr-text3);">
        <div style="font-size:3rem;margin-bottom:16px">🔍</div>
        <p id="searchEmptyMsg" style="font-size:1.1rem">No results found.</p>
      </div>
      <div id="searchLoading" hidden style="display:flex;justify-content:center;padding:40px;">
        <div class="spinner"></div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

// ============================================================
// SEARCH ENGINE
// ============================================================
function scorePhoto(photo, query) {
  const q = query.toLowerCase().trim();
  if (!q) return 1;

  let score = 0;
  const title = (photo.title || '').toLowerCase();
  const desc = (photo.description || '').toLowerCase();
  const tags = (photo.tags || []).map(t => t.toLowerCase());
  const city = (photo.city || '').toLowerCase();
  const category = (photo.category || '').toLowerCase();

  const country = window.getCountry(photo.country);
  const countryName = country ? country.name.toLowerCase() : '';

  // Exact title match
  if (title === q) score += 100;
  // Title starts with
  else if (title.startsWith(q)) score += 60;
  // Title contains
  else if (title.includes(q)) score += 40;

  // Tag exact match
  if (tags.includes(q)) score += 50;
  else if (tags.some(t => t.startsWith(q))) score += 30;
  else if (tags.some(t => t.includes(q))) score += 15;

  // Category match
  if (category.includes(q)) score += 35;

  // Country match
  if (countryName.includes(q)) score += 30;

  // City match
  if (city.includes(q)) score += 25;

  // Description
  if (desc.includes(q)) score += 10;

  return score;
}

function searchPhotos(query, catFilter = '', countryFilter = '', sort = 'relevant') {
  let photos = PeczoStore.getAll();

  // Apply filters
  if (catFilter) photos = photos.filter(p => p.category === catFilter);
  if (countryFilter) photos = photos.filter(p => p.country === countryFilter);

  // Score and filter
  if (query.trim()) {
    photos = photos
      .map(p => ({ ...p, _score: scorePhoto(p, query) }))
      .filter(p => p._score > 0);
  } else {
    photos = photos.map(p => ({ ...p, _score: 1 }));
  }

  // Sort
  switch (sort) {
    case 'recent': photos.sort((a, b) => b.uploadedAt - a.uploadedAt); break;
    case 'likes':  photos.sort((a, b) => (b.likes || 0) - (a.likes || 0)); break;
    case 'views':  photos.sort((a, b) => (b.views || 0) - (a.views || 0)); break;
    default:       photos.sort((a, b) => b._score - a._score);
  }

  return photos;
}

// ============================================================
// RENDER SEARCH RESULTS
// ============================================================
function renderSearchResults(photos, query) {
  const grid = document.getElementById('searchResultGrid');
  const emptyEl = document.getElementById('searchEmpty');
  const emptyMsg = document.getElementById('searchEmptyMsg');
  const loadingEl = document.getElementById('searchLoading');

  loadingEl.style.display = 'none';
  grid.innerHTML = '';

  if (!photos.length) {
    emptyEl.removeAttribute('hidden');
    emptyMsg.textContent = `No results found for "${query}".`;
    return;
  }

  emptyEl.setAttribute('hidden', '');

  photos.forEach(photo => {
    const country = window.getCountry(photo.country);
    const src = photo.dataUrl || photo.url || '';
    const isLiked = PeczoStore.isLiked(photo.id);

    const div = document.createElement('div');
    div.className = 'photo-card';
    div.setAttribute('role', 'listitem');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', photo.title || 'Photo');
    div.dataset.id = photo.id;

    // Highlight matching text
    const highlightTitle = highlightQuery(photo.title || 'Untitled', query);

    div.innerHTML = `
      ${photo.category ? `<span class="category-badge">${photo.category}</span>` : ''}
      <img src="${src}" alt="${window.escapeHtml(photo.title || '')}" loading="lazy"
        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%231C1C26%22 width=%22400%22 height=%22300%22/%3E%3Ctext fill=%22%236B6C7A%22 font-family=%22sans-serif%22 font-size=%2240%22 x=%22170%22 y=%22165%22%3E📷%3C/text%3E%3C/svg%3E'"
      />
      <div class="photo-card-overlay">
        <div class="photo-card-title">${highlightTitle}</div>
        <div class="photo-card-meta">
          ${country ? `<span>${country.flag}</span><span>${country.name}</span>` : ''}
          <span class="photo-card-likes">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="${isLiked ? '#FF5C35' : 'none'}" stroke="${isLiked ? '#FF5C35' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            ${photo.likes || 0}
          </span>
        </div>
      </div>
    `;

    div.addEventListener('click', () => window.openPhotoDetail(photo.id));
    div.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.openPhotoDetail(photo.id); });
    grid.appendChild(div);
  });
}

// ============================================================
// HIGHLIGHT QUERY IN TEXT
// ============================================================
function highlightQuery(text, query) {
  if (!query.trim()) return window.escapeHtml(text);
  const escaped = window.escapeHtml(text);
  const q = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return escaped.replace(new RegExp(`(${q})`, 'gi'), '<mark style="background:rgba(255,92,53,0.35);color:inherit;border-radius:2px;padding:0 2px;">$1</mark>');
}

// ============================================================
// OPEN / CLOSE OVERLAY
// ============================================================
let searchOverlay = null;
let searchDebounce = null;

function openSearchOverlay(query) {
  if (!searchOverlay) {
    searchOverlay = createSearchOverlay();
    initSearchOverlayEvents();
  }

  searchOverlay.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  document.getElementById('searchQueryDisplay').textContent = query;
  window.AppState.searchQuery = query;

  // Populate countries in search filter
  const countrySelect = document.getElementById('searchCountryFilter');
  if (countrySelect.options.length === 1) {
    window.COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = `${c.flag} ${c.name}`;
      countrySelect.appendChild(opt);
    });
  }

  runSearch();
}

function closeSearchOverlay() {
  if (!searchOverlay) return;
  searchOverlay.setAttribute('hidden', '');
  document.body.style.overflow = '';
  window.AppState.searchQuery = '';
  document.getElementById('navSearch').value = '';
}

function runSearch() {
  const query = window.AppState.searchQuery;
  const cat = document.getElementById('searchCatFilter')?.value || '';
  const country = document.getElementById('searchCountryFilter')?.value || '';
  const sort = document.getElementById('searchSortFilter')?.value || 'relevant';

  const loading = document.getElementById('searchLoading');
  loading.style.display = 'flex';
  loading.removeAttribute('hidden');

  setTimeout(() => {
    const results = searchPhotos(query, cat, country, sort);
    renderSearchResults(results, query);
  }, 80);
}

// ============================================================
// OVERLAY EVENTS
// ============================================================
function initSearchOverlayEvents() {
  document.getElementById('closeSearchOverlay').addEventListener('click', closeSearchOverlay);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay && !searchOverlay.hasAttribute('hidden')) {
      closeSearchOverlay();
    }
  });

  ['searchCatFilter', 'searchCountryFilter', 'searchSortFilter'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', runSearch);
  });
}

// ============================================================
// TAG SEARCH (clicking a tag on photo detail)
// ============================================================
function initTagSearch() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('photo-tag')) {
      const tag = e.target.textContent.replace('#', '').trim();
      window.AppState.searchQuery = tag;
      document.getElementById('navSearch').value = tag;
      openSearchOverlay(tag);
    }
  });
}

// ============================================================
// INIT NAV SEARCH
// ============================================================
function initNavSearch() {
  const navSearch = document.getElementById('navSearch');

  navSearch.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    const q = navSearch.value.trim();
    if (q.length < 1) {
      if (searchOverlay) closeSearchOverlay();
      return;
    }
    searchDebounce = setTimeout(() => {
      window.AppState.searchQuery = q;
      openSearchOverlay(q);
    }, 300);
  });

  navSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(searchDebounce);
      const q = navSearch.value.trim();
      if (q) {
        window.AppState.searchQuery = q;
        openSearchOverlay(q);
      }
    }
    if (e.key === 'Escape') {
      navSearch.value = '';
      closeSearchOverlay();
    }
  });

  // URL search param on load
  const urlParams = new URLSearchParams(window.location.search);
  const urlQuery = urlParams.get('search') || urlParams.get('q');
  if (urlQuery) {
    navSearch.value = urlQuery;
    window.AppState.searchQuery = urlQuery;
    setTimeout(() => openSearchOverlay(urlQuery), 800);
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavSearch();
  initTagSearch();
});
