/* app.js — Coub.xyz Main Application
   Mobile-first TikTok-style live TV platform
*/

'use strict';

// ── I18N ─────────────────────────────────────────────────────
const I18N = {
  en: {
    live_feed: "Live Feed", channels: "Channels", sports_hub: "Sports Hub",
    favorites: "Favorites", premium: "Premium", contact: "Contact",
    all_channels: "All Channels", channels_sub: "Browse free-to-air broadcasts worldwide",
    sports_sub: "Free live sports from official sources",
    fav_sub: "Your saved and recently watched channels",
    saved: "Saved Channels", recently_watched: "Recently Watched",
    live: "Live", sports: "Sports",
    no_favorites: "No saved channels yet", no_recent: "No recently watched",
    share_copied: "Link copied!", added_fav: "Added to favorites", removed_fav: "Removed from favorites",
    watch_now: "Watch Now", save: "Save", saved_btn: "Saved",
  },
  ar: {
    live_feed: "البث المباشر", channels: "القنوات", sports_hub: "مركز الرياضة",
    favorites: "المفضلة", premium: "بريميوم", contact: "التواصل",
    all_channels: "كل القنوات", channels_sub: "تصفح قنوات البث المجاني حول العالم",
    sports_sub: "الرياضة المجانية من المصادر الرسمية",
    fav_sub: "قنواتك المحفوظة والمشاهدة مؤخراً",
    saved: "القنوات المحفوظة", recently_watched: "شوهد مؤخراً",
    live: "مباشر", sports: "رياضة",
    no_favorites: "لا توجد قنوات محفوظة", no_recent: "لا يوجد سجل مشاهدة",
    share_copied: "تم نسخ الرابط!", added_fav: "أضيف للمفضلة", removed_fav: "حُذف من المفضلة",
    watch_now: "شاهد الآن", save: "حفظ", saved_btn: "محفوظ",
  },
  fr: {
    live_feed: "Direct Live", channels: "Chaînes", sports_hub: "Hub Sport",
    favorites: "Favoris", premium: "Premium", contact: "Contact",
    all_channels: "Toutes les chaînes", channels_sub: "Parcourir les chaînes gratuites du monde entier",
    sports_sub: "Sport en direct depuis les sources officielles",
    fav_sub: "Vos chaînes sauvegardées et récemment regardées",
    saved: "Chaînes sauvegardées", recently_watched: "Récemment regardé",
    live: "Direct", sports: "Sport",
    no_favorites: "Pas encore de chaînes sauvegardées", no_recent: "Aucun historique",
    share_copied: "Lien copié!", added_fav: "Ajouté aux favoris", removed_fav: "Supprimé des favoris",
    watch_now: "Regarder", save: "Sauvegarder", saved_btn: "Sauvegardé",
  },
  es: {
    live_feed: "En Directo", channels: "Canales", sports_hub: "Hub Deportes",
    favorites: "Favoritos", premium: "Premium", contact: "Contacto",
    all_channels: "Todos los canales", channels_sub: "Explorar canales gratuitos de todo el mundo",
    sports_sub: "Deportes en vivo de fuentes oficiales",
    fav_sub: "Tus canales guardados y vistos recientemente",
    saved: "Canales guardados", recently_watched: "Vistos recientemente",
    live: "En Vivo", sports: "Deporte",
    no_favorites: "Aún no hay canales guardados", no_recent: "Sin historial",
    share_copied: "¡Enlace copiado!", added_fav: "Añadido a favoritos", removed_fav: "Eliminado de favoritos",
    watch_now: "Ver Ahora", save: "Guardar", saved_btn: "Guardado",
  }
};

// ── APP STATE ─────────────────────────────────────────────────
const State = {
  lang: localStorage.getItem('coub_lang') || 'en',
  currentView: 'feed',
  currentCategory: 'All',
  searchFilter: 'all',
  favorites: JSON.parse(localStorage.getItem('coub_favs') || '[]'),
  recentlyWatched: JSON.parse(localStorage.getItem('coub_recent') || '[]'),
  feedChannels: [],
  feedIndex: 0,
  muted: true,
  previousView: null,
};

// ── UTILS ─────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const t = key => (I18N[State.lang] && I18N[State.lang][key]) || I18N.en[key] || key;

function showToast(msg, duration = 2200) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

function saveFavorites() {
  localStorage.setItem('coub_favs', JSON.stringify(State.favorites));
}

function saveRecent() {
  localStorage.setItem('coub_recent', JSON.stringify(State.recentlyWatched.slice(0, 20)));
}

function addRecent(channelId) {
  State.recentlyWatched = [channelId, ...State.recentlyWatched.filter(id => id !== channelId)].slice(0, 20);
  saveRecent();
}

function isFav(channelId) {
  return State.favorites.includes(channelId);
}

function toggleFav(channelId) {
  if (isFav(channelId)) {
    State.favorites = State.favorites.filter(id => id !== channelId);
    showToast(t('removed_fav'));
  } else {
    State.favorites = [channelId, ...State.favorites];
    showToast(t('added_fav'));
  }
  saveFavorites();
}

// ── APPLY I18N ────────────────────────────────────────────────
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[State.lang] && I18N[State.lang][key]) el.textContent = I18N[State.lang][key];
  });
  document.body.setAttribute('data-lang', State.lang);
  const isRTL = State.lang === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  $('langBtn').textContent = State.lang.toUpperCase();

  // Update active lang opts
  document.querySelectorAll('.lang-opt, .lang-modal-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.langOpt === State.lang);
  });
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.classList.toggle('active', link.dataset.view === State.currentView);
  });
}

// ── VIEW NAVIGATION ───────────────────────────────────────────
function showView(viewId) {
  State.previousView = State.currentView;
  State.currentView = viewId;

  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('active', v.id === `view-${viewId}`);
    v.classList.toggle('hidden', v.id !== `view-${viewId}`);
  });

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewId);
  });

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.classList.toggle('active', link.dataset.view === viewId);
  });

  // Render view content
  if (viewId === 'feed') renderFeed();
  if (viewId === 'directory') renderDirectory();
  if (viewId === 'sports') renderSports();
  if (viewId === 'favorites') renderFavorites();

  closeDrawer();
  window.scrollTo(0, 0);
}

// ── CHANNEL CARD HTML ─────────────────────────────────────────
function buildChannelThumb(ch) {
  return `
    <div class="dir-card-thumb">
      <span style="font-size:36px">${ch.logo}</span>
      ${ch.isLive ? `<div class="dir-card-live-badge">LIVE</div>` : ''}
    </div>
    <div class="dir-card-body">
      <div class="dir-card-name">${ch.name}</div>
      <div class="dir-card-meta">${ch.country} · ${ch.category}</div>
    </div>
  `;
}

// ── REEL FEED ─────────────────────────────────────────────────
function buildFeedList() {
  let pool = State.currentCategory === 'All'
    ? [...CHANNELS]
    : CHANNELS.filter(ch => ch.category === State.currentCategory);
  // Shuffle for variety
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

function renderFeed() {
  State.feedChannels = buildFeedList();
  const feed = $('reelFeed');
  feed.innerHTML = '';

  State.feedChannels.forEach((ch, idx) => {
    const card = createReelCard(ch, idx);
    feed.appendChild(card);
  });

  // Lazy load intersection observer
  observeReelCards();
}

function createReelCard(ch, idx) {
  const card = document.createElement('div');
  card.className = 'reel-card';
  card.dataset.channelId = ch.id;
  card.dataset.idx = idx;

  const favActive = isFav(ch.id) ? 'active' : '';

  card.innerHTML = `
    <div class="reel-bg">
      <div class="reel-emoji">${ch.logo}</div>
    </div>
    <div class="reel-live-badge">LIVE</div>
    <button class="reel-mute" data-action="mute" aria-label="Mute">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <line x1="23" y1="9" x2="17" y2="15" class="mute-x1"/><line x1="17" y1="9" x2="23" y2="15" class="mute-x2"/>
      </svg>
    </button>
    <div class="reel-actions">
      <button class="reel-action-btn ${favActive}" data-action="fav" aria-label="Favorite">
        <div class="reel-action-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav(ch.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <span class="reel-action-label">Save</span>
      </button>
      <button class="reel-action-btn" data-action="share" aria-label="Share">
        <div class="reel-action-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </div>
        <span class="reel-action-label">Share</span>
      </button>
      <button class="reel-action-btn" data-action="info" aria-label="Info">
        <div class="reel-action-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <span class="reel-action-label">Info</span>
      </button>
    </div>
    <div class="reel-info">
      <div class="reel-channel-row">
        <div class="reel-channel-logo">${ch.logo}</div>
        <div>
          <div class="reel-channel-name">${ch.name}</div>
          <div class="reel-channel-country">${ch.country} · ${ch.language}</div>
        </div>
      </div>
      <div class="reel-desc">${ch.description}</div>
      <span class="reel-cat-tag">${ch.category}</span>
    </div>
    <div class="reel-play-overlay" data-action="play">
      <div class="play-icon-big">▶</div>
    </div>
  `;

  // Event delegation on card
  card.addEventListener('click', e => handleReelAction(e, ch));
  return card;
}

function handleReelAction(e, ch) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  if (action === 'fav') {
    toggleFav(ch.id);
    const icon = btn.querySelector('path');
    const isFavNow = isFav(ch.id);
    if (icon) icon.setAttribute('fill', isFavNow ? 'currentColor' : 'none');
    btn.classList.toggle('active', isFavNow);
  }
  else if (action === 'share') {
    const url = `${location.origin}${location.pathname}?ch=${ch.id}`;
    if (navigator.share) {
      navigator.share({ title: ch.name, text: ch.description, url });
    } else {
      navigator.clipboard.writeText(url).then(() => showToast(t('share_copied')));
    }
  }
  else if (action === 'info') {
    openChannelPage(ch.id);
  }
  else if (action === 'play') {
    openChannelPage(ch.id);
  }
  else if (action === 'mute') {
    State.muted = !State.muted;
    showToast(State.muted ? '🔇 Muted' : '🔊 Unmuted');
  }
}

function observeReelCards() {
  if (!window.IntersectionObserver) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('fade-in');
        // Mark as seen
        const chId = card.dataset.channelId;
        if (chId) addRecent(chId);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.reel-card').forEach(card => observer.observe(card));
}

// ── DIRECTORY ─────────────────────────────────────────────────
function renderDirectory(filterCat = 'All') {
  const catContainer = $('dirCategories');
  const grid = $('dirGrid');

  // Category pills
  catContainer.innerHTML = CATEGORIES.map(c => `
    <button class="dir-cat-chip ${filterCat === c.id ? 'active' : ''}" data-cat="${c.id}">
      ${c.emoji} ${c.label}
    </button>
  `).join('');

  catContainer.addEventListener('click', e => {
    const chip = e.target.closest('.dir-cat-chip');
    if (chip) renderDirectory(chip.dataset.cat);
  });

  const channels = filterCat === 'All' ? CHANNELS : CHANNELS.filter(ch => ch.category === filterCat);

  grid.innerHTML = '';
  channels.forEach((ch, i) => {
    const card = document.createElement('div');
    card.className = 'dir-card slide-up';
    card.style.animationDelay = `${i * 0.03}s`;
    card.innerHTML = buildChannelThumb(ch);
    card.addEventListener('click', () => openChannelPage(ch.id));
    grid.appendChild(card);
  });
}

// ── SPORTS HUB ────────────────────────────────────────────────
function renderSports() {
  const sports = CHANNELS.filter(ch => ch.category === 'Sports');
  const grid = $('sportsGrid');
  grid.innerHTML = '';

  sports.forEach((ch, i) => {
    const card = document.createElement('div');
    card.className = 'sports-card slide-up';
    card.style.animationDelay = `${i * 0.04}s`;
    card.innerHTML = `
      <div class="sports-card-icon">${ch.logo}</div>
      <div class="sports-card-name">${ch.name}</div>
      <div class="sports-card-meta">${ch.country}</div>
    `;
    card.addEventListener('click', () => openChannelPage(ch.id));
    grid.appendChild(card);
  });

  // Schedule
  const schedList = $('scheduleList');
  schedList.innerHTML = MATCH_SCHEDULES.map(m => `
    <div class="schedule-item fade-in">
      <div class="schedule-time">${m.time}</div>
      <div class="schedule-info">
        <div class="schedule-match">${m.match}</div>
        <div class="schedule-channel">${m.channel}</div>
      </div>
      <span class="schedule-sport">${m.sport}</span>
    </div>
  `).join('');
}

// ── FAVORITES ─────────────────────────────────────────────────
function renderFavorites() {
  renderFavGrid($('savedGrid'), State.favorites, t('no_favorites'));
  renderFavGrid($('recentGrid'), State.recentlyWatched, t('no_recent'));
}

function renderFavGrid(container, ids, emptyMsg) {
  container.innerHTML = '';
  if (!ids.length) {
    container.innerHTML = `
      <div class="fav-empty">
        <div class="fav-empty-icon">📭</div>
        <div>${emptyMsg}</div>
      </div>`;
    return;
  }
  ids.forEach(id => {
    const ch = CoubSearch.getById(id);
    if (!ch) return;
    const card = document.createElement('div');
    card.className = 'dir-card fade-in';
    card.innerHTML = buildChannelThumb(ch);
    card.addEventListener('click', () => openChannelPage(ch.id));
    container.appendChild(card);
  });
}

// ── CHANNEL PAGE ──────────────────────────────────────────────
function openChannelPage(channelId) {
  const ch = CoubSearch.getById(channelId);
  if (!ch) return;

  addRecent(channelId);

  const page = $('channelPage');
  const isFavCh = isFav(channelId);

  page.innerHTML = `
    <div class="ch-hero">
      <div class="ch-hero-bg">${ch.logo}</div>
      <div class="ch-logo">${ch.logo}</div>
      <button class="ch-back" id="chBackBtn" aria-label="Back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
    </div>
    <div class="ch-meta">
      <div class="ch-name">${ch.name}</div>
      <div class="ch-tags">
        ${ch.isLive ? `<span class="ch-tag live">● LIVE</span>` : ''}
        <span class="ch-tag">${ch.category}</span>
        <span class="ch-tag">🌐 ${ch.country}</span>
        <span class="ch-tag">${ch.language}</span>
      </div>
      <p class="ch-desc">${ch.description}</p>
      <div class="ch-actions">
        <button class="ch-btn ch-btn-watch" id="chWatchBtn">${t('watch_now')}</button>
        <button class="ch-btn ch-btn-fav ${isFavCh ? 'active' : ''}" id="chFavBtn">
          ${isFavCh ? t('saved_btn') : t('save')}
        </button>
        <button class="ch-btn ch-btn-share" id="chShareBtn" aria-label="Share">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Schema.org VideoObject
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": ch.name,
    "description": ch.description,
    "thumbnailUrl": `https://coub.xyz/thumbs/${ch.id}.jpg`,
    "uploadDate": new Date().toISOString(),
    "contentUrl": ch.streamUrl || ch.embedUrl,
    "publisher": { "@type": "Organization", "name": "Coub.xyz" }
  });
  page.appendChild(schema);

  showView('channel');

  // Back
  $('chBackBtn').onclick = () => showView(State.previousView || 'feed');

  // Watch
  $('chWatchBtn').onclick = () => launchStream(ch);

  // Fav
  $('chFavBtn').onclick = () => {
    toggleFav(channelId);
    const btn = $('chFavBtn');
    const f = isFav(channelId);
    btn.textContent = f ? t('saved_btn') : t('save');
    btn.classList.toggle('active', f);
  };

  // Share
  $('chShareBtn').onclick = () => {
    const url = `${location.origin}${location.pathname}?ch=${channelId}`;
    if (navigator.share) {
      navigator.share({ title: ch.name, url });
    } else {
      navigator.clipboard.writeText(url).then(() => showToast(t('share_copied')));
    }
  };
}

// ── STREAM LAUNCHER ───────────────────────────────────────────
function launchStream(ch) {
  const target = ch.embedUrl || ch.website;
  if (!target) { showToast('No stream URL available'); return; }

  // Open in new tab (GitHub Pages compatible, no iframe sandbox issues)
  window.open(target, '_blank', 'noopener,noreferrer');
  showToast(`Opening ${ch.name}…`);
}

// ── SEARCH ────────────────────────────────────────────────────
function initSearch() {
  const overlay   = $('searchOverlay');
  const input     = $('searchInput');
  const clearBtn  = $('searchClear');
  const results   = $('searchResults');

  $('searchToggleBtn').onclick = () => {
    overlay.classList.remove('hidden');
    setTimeout(() => input.focus(), 200);
  };

  $('searchBack').onclick = () => overlay.classList.add('hidden');

  clearBtn.onclick = () => {
    input.value = '';
    clearBtn.classList.add('hidden');
    renderSearchResults([]);
  };

  input.addEventListener('input', () => {
    clearBtn.classList.toggle('hidden', !input.value);
    CoubSearch.liveSearch(input.value, State.searchFilter, renderSearchResults);
  });

  // Filter chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      State.searchFilter = chip.dataset.filter;
      CoubSearch.liveSearch(input.value, State.searchFilter, renderSearchResults);
    });
  });
}

function renderSearchResults(channels) {
  const container = $('searchResults');
  if (!channels.length) {
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <div>No channels found</div>
      </div>`;
    return;
  }
  container.innerHTML = channels.map(ch => `
    <div class="search-result-item" data-id="${ch.id}">
      <div class="result-thumb">${ch.logo}</div>
      <div class="result-info">
        <div class="result-name">${ch.name}</div>
        <div class="result-meta">${ch.category} · ${ch.country} · ${ch.language}</div>
      </div>
      ${ch.isLive ? `<div class="result-live">LIVE</div>` : ''}
    </div>
  `).join('');

  container.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      $('searchOverlay').classList.add('hidden');
      openChannelPage(item.dataset.id);
    });
  });
}

// ── DRAWER ────────────────────────────────────────────────────
function openDrawer() {
  $('drawer').classList.remove('hidden');
  $('drawerBackdrop').classList.remove('hidden');
}
function closeDrawer() {
  $('drawer').classList.add('hidden');
  $('drawerBackdrop').classList.add('hidden');
}

// ── LANGUAGE ──────────────────────────────────────────────────
function setLang(lang) {
  State.lang = lang;
  localStorage.setItem('coub_lang', lang);
  applyI18n();
}

function showLangModal() {
  const modal = document.createElement('div');
  modal.className = 'lang-modal';
  modal.innerHTML = `
    <div class="lang-modal-content">
      <div class="lang-modal-title">Choose Language</div>
      <div class="lang-modal-opts">
        <button class="lang-modal-opt ${State.lang==='en'?'active':''}" data-lang-opt="en"><span class="lang-flag">🇬🇧</span> English</button>
        <button class="lang-modal-opt ${State.lang==='ar'?'active':''}" data-lang-opt="ar"><span class="lang-flag">🇸🇦</span> العربية</button>
        <button class="lang-modal-opt ${State.lang==='fr'?'active':''}" data-lang-opt="fr"><span class="lang-flag">🇫🇷</span> Français</button>
        <button class="lang-modal-opt ${State.lang==='es'?'active':''}" data-lang-opt="es"><span class="lang-flag">🇪🇸</span> Español</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => {
    const btn = e.target.closest('[data-lang-opt]');
    if (btn) { setLang(btn.dataset.langOpt); modal.remove(); }
    else if (e.target === modal) modal.remove();
  });
}

// ── CATEGORY RAIL ─────────────────────────────────────────────
function initCategoryRail() {
  $('categoryRail').addEventListener('click', e => {
    const pill = e.target.closest('.cat-pill');
    if (!pill) return;
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    State.currentCategory = pill.dataset.cat;
    renderFeed();
  });
}

// ── URL DEEP LINK ─────────────────────────────────────────────
function handleDeepLink() {
  const params = new URLSearchParams(location.search);
  const chId = params.get('ch');
  if (chId && CoubSearch.getById(chId)) {
    openChannelPage(chId);
  }
}

// ── SWIPE GESTURE (touch) ─────────────────────────────────────
function initSwipeGestures() {
  let startY = 0;
  const feed = $('reelFeed');
  feed.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
  feed.addEventListener('touchend', e => {
    const dy = startY - e.changedTouches[0].clientY;
    // Snap handled natively by CSS scroll-snap; this is for haptic-like feedback only
  }, { passive: true });
}

// ── INIT ──────────────────────────────────────────────────────
function init() {
  // Splash → App
  setTimeout(() => {
    $('splash').classList.add('hidden');
    $('app').classList.remove('hidden');
    renderFeed();
    applyI18n();
    initSearch();
    initCategoryRail();
    initSwipeGestures();
    handleDeepLink();
  }, 2400);

  // Bottom nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  // Drawer links
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showView(link.dataset.view);
    });
  });

  // Menu / drawer
  $('menuBtn').onclick = openDrawer;
  $('drawerClose').onclick = closeDrawer;
  $('drawerBackdrop').onclick = closeDrawer;
  $('homeBtn').onclick = () => showView('feed');

  // Language
  $('langBtn').onclick = showLangModal;
  document.querySelectorAll('.lang-opt').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.langOpt));
  });
}

document.addEventListener('DOMContentLoaded', init);
