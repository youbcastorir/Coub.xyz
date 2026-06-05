/* app.js — Coub.xyz v2
   FIXED: Real video playback via YouTube embed + hls.js fallback
*/
'use strict';

// ── I18N ─────────────────────────────────────────────────────
const I18N = {
  en: {
    live_feed:"Live Feed", channels:"Channels", sports_hub:"Sports Hub",
    favorites:"Favorites", premium:"Premium", contact:"Contact",
    all_channels:"All Channels", channels_sub:"Browse free-to-air broadcasts worldwide",
    sports_sub:"Free live sports from official sources",
    fav_sub:"Your saved and recently watched channels",
    saved:"Saved Channels", recently_watched:"Recently Watched",
    live:"Live", sports:"Sports",
    no_favorites:"No saved channels yet", no_recent:"No recently watched",
    share_copied:"Link copied!", added_fav:"Added to favorites", removed_fav:"Removed from favorites",
    watch_now:"Watch Now", save:"Save", saved_btn:"Saved",
  },
  ar: {
    live_feed:"البث المباشر", channels:"القنوات", sports_hub:"مركز الرياضة",
    favorites:"المفضلة", premium:"بريميوم", contact:"التواصل",
    all_channels:"كل القنوات", channels_sub:"تصفح قنوات البث المجاني حول العالم",
    sports_sub:"الرياضة المجانية من المصادر الرسمية",
    fav_sub:"قنواتك المحفوظة والمشاهدة مؤخراً",
    saved:"القنوات المحفوظة", recently_watched:"شوهد مؤخراً",
    live:"مباشر", sports:"رياضة",
    no_favorites:"لا توجد قنوات محفوظة", no_recent:"لا يوجد سجل مشاهدة",
    share_copied:"تم نسخ الرابط!", added_fav:"أضيف للمفضلة", removed_fav:"حُذف من المفضلة",
    watch_now:"شاهد الآن", save:"حفظ", saved_btn:"محفوظ",
  },
  fr: {
    live_feed:"Direct Live", channels:"Chaînes", sports_hub:"Hub Sport",
    favorites:"Favoris", premium:"Premium", contact:"Contact",
    all_channels:"Toutes les chaînes", channels_sub:"Parcourir les chaînes gratuites du monde entier",
    sports_sub:"Sport en direct depuis les sources officielles",
    fav_sub:"Vos chaînes sauvegardées et récemment regardées",
    saved:"Chaînes sauvegardées", recently_watched:"Récemment regardé",
    live:"Direct", sports:"Sport",
    no_favorites:"Pas encore de chaînes sauvegardées", no_recent:"Aucun historique",
    share_copied:"Lien copié!", added_fav:"Ajouté aux favoris", removed_fav:"Supprimé des favoris",
    watch_now:"Regarder", save:"Sauvegarder", saved_btn:"Sauvegardé",
  },
  es: {
    live_feed:"En Directo", channels:"Canales", sports_hub:"Hub Deportes",
    favorites:"Favoritos", premium:"Premium", contact:"Contacto",
    all_channels:"Todos los canales", channels_sub:"Explorar canales gratuitos de todo el mundo",
    sports_sub:"Deportes en vivo de fuentes oficiales",
    fav_sub:"Tus canales guardados y vistos recientemente",
    saved:"Canales guardados", recently_watched:"Vistos recientemente",
    live:"En Vivo", sports:"Deporte",
    no_favorites:"Aún no hay canales guardados", no_recent:"Sin historial",
    share_copied:"¡Enlace copiado!", added_fav:"Añadido a favoritos", removed_fav:"Eliminado de favoritos",
    watch_now:"Ver Ahora", save:"Guardar", saved_btn:"Guardado",
  }
};

// ── STATE ─────────────────────────────────────────────────────
const State = {
  lang: localStorage.getItem('coub_lang') || 'en',
  currentView: 'feed',
  currentCategory: 'All',
  searchFilter: 'all',
  favorites: JSON.parse(localStorage.getItem('coub_favs') || '[]'),
  recentlyWatched: JSON.parse(localStorage.getItem('coub_recent') || '[]'),
  feedChannels: [],
  muted: true,
  previousView: null,
  activeCardId: null,
};

// ── UTILS ─────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const t = key => (I18N[State.lang]||{})[key] || I18N.en[key] || key;

function showToast(msg, dur = 2200) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), dur);
}

function saveFavorites() { localStorage.setItem('coub_favs', JSON.stringify(State.favorites)); }
function saveRecent()    { localStorage.setItem('coub_recent', JSON.stringify(State.recentlyWatched.slice(0,20))); }
function addRecent(id)   { State.recentlyWatched = [id,...State.recentlyWatched.filter(x=>x!==id)].slice(0,20); saveRecent(); }
function isFav(id)       { return State.favorites.includes(id); }
function toggleFav(id)   {
  if (isFav(id)) { State.favorites = State.favorites.filter(x=>x!==id); showToast(t('removed_fav')); }
  else           { State.favorites = [id,...State.favorites]; showToast(t('added_fav')); }
  saveFavorites();
}

// ── I18N APPLY ────────────────────────────────────────────────
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (I18N[State.lang]?.[k]) el.textContent = I18N[State.lang][k];
  });
  document.body.setAttribute('data-lang', State.lang);
  document.documentElement.dir = State.lang === 'ar' ? 'rtl' : 'ltr';
  $('langBtn').textContent = State.lang.toUpperCase();
  document.querySelectorAll('.lang-opt,.lang-modal-opt').forEach(b => b.classList.toggle('active', b.dataset.langOpt===State.lang));
}

// ── VIEW NAV ──────────────────────────────────────────────────
function showView(id) {
  State.previousView = State.currentView;
  State.currentView = id;
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('active', v.id===`view-${id}`);
    v.classList.toggle('hidden', v.id!==`view-${id}`);
  });
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view===id));
  document.querySelectorAll('.drawer-link').forEach(l => l.classList.toggle('active', l.dataset.view===id));
  if (id==='feed')      renderFeed();
  if (id==='directory') renderDirectory();
  if (id==='sports')    renderSports();
  if (id==='favorites') renderFavorites();
  closeDrawer();
  window.scrollTo(0,0);
}

// ── VIDEO EMBED BUILDER ───────────────────────────────────────
// Returns an <iframe> src for the channel.
// Priority: youtubeId → streamUrl (HLS via hls.js) → null
function getEmbedSrc(ch) {
  if (ch.youtubeId) {
    // autoplay=1, mute=1 required by browsers; controls=0 for clean reels look
    return `https://www.youtube.com/embed/${ch.youtubeId}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${ch.youtubeId}&modestbranding=1&rel=0`;
  }
  return null;
}

// For HLS-only channels (no YouTube), we create a <video> element
function buildHlsVideo(streamUrl) {
  const v = document.createElement('video');
  v.muted = true;
  v.autoplay = true;
  v.playsinline = true;
  v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;';

  if (v.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari / iOS — native HLS
    v.src = streamUrl;
    v.play().catch(()=>{});
  } else if (window.Hls && Hls.isSupported()) {
    const hls = new Hls({ maxBufferLength: 10, maxMaxBufferLength: 30 });
    hls.loadSource(streamUrl);
    hls.attachMedia(v);
    hls.on(Hls.Events.MANIFEST_PARSED, () => v.play().catch(()=>{}));
  }
  return v;
}

// ── REEL FEED ─────────────────────────────────────────────────
function buildFeedList() {
  let pool = State.currentCategory==='All' ? [...CHANNELS] : CHANNELS.filter(c=>c.category===State.currentCategory);
  // Shuffle
  for (let i=pool.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  return pool;
}

function renderFeed() {
  State.feedChannels = buildFeedList();
  const feed = $('reelFeed');
  feed.innerHTML = '';
  State.feedChannels.forEach((ch,idx) => feed.appendChild(createReelCard(ch,idx)));
  initReelObserver();
}

function createReelCard(ch, idx) {
  const card = document.createElement('div');
  card.className = 'reel-card';
  card.dataset.channelId = ch.id;
  card.dataset.idx = idx;

  const embedSrc = getEmbedSrc(ch);

  card.innerHTML = `
    <!-- Background pattern / fallback -->
    <div class="reel-bg" style="background:${bgGradient(idx)}">
      <div class="reel-emoji">${ch.logo}</div>
    </div>

    <!-- Video layer (lazy — injected on visible) -->
    <div class="reel-video-wrap" id="vid-${ch.id}"></div>

    <!-- Overlays -->
    <div class="reel-live-badge">LIVE</div>
    <button class="reel-mute" data-action="mute" aria-label="Toggle mute">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
      </svg>
    </button>

    <div class="reel-actions">
      <button class="reel-action-btn ${isFav(ch.id)?'active':''}" data-action="fav">
        <div class="reel-action-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav(ch.id)?'currentColor':'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <span class="reel-action-label">Save</span>
      </button>
      <button class="reel-action-btn" data-action="share">
        <div class="reel-action-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </div>
        <span class="reel-action-label">Share</span>
      </button>
      <button class="reel-action-btn" data-action="info">
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

    <!-- Tap-to-watch overlay (shown before video loads) -->
    <div class="reel-tap-overlay" data-action="watch" id="tap-${ch.id}">
      <div class="tap-play-btn">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
      <div class="tap-label">Tap to Watch</div>
    </div>
  `;

  card.addEventListener('click', e => handleReelAction(e, ch));
  return card;
}

// colour variety per card
function bgGradient(idx) {
  const palettes = [
    'linear-gradient(135deg,#0d1b2a,#1b4f72)','linear-gradient(135deg,#1a0a2e,#4a1e8c)',
    'linear-gradient(135deg,#0a2e1a,#1a6e3a)','linear-gradient(135deg,#2e0a0a,#8c1a1a)',
    'linear-gradient(135deg,#1a1a0a,#6e5a1a)','linear-gradient(135deg,#0a1a2e,#1a4e6e)',
    'linear-gradient(135deg,#2a0a1a,#8c1a4a)','linear-gradient(135deg,#0a2a2a,#1a6e6e)',
  ];
  return palettes[idx % palettes.length];
}

// Inject iframe when card enters viewport
function initReelObserver() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const card = entry.target;
      const chId = card.dataset.channelId;
      const ch = CoubSearch.getById(chId);
      if (!ch) return;

      const wrap = card.querySelector(`#vid-${chId}`);
      const tapOverlay = card.querySelector(`#tap-${chId}`);

      if (entry.isIntersecting) {
        // Load embed only once
        if (wrap && !wrap.dataset.loaded) {
          wrap.dataset.loaded = '1';
          const src = getEmbedSrc(ch);
          if (src) {
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;z-index:0;';
            wrap.appendChild(iframe);
            // Hide tap overlay once iframe loads
            iframe.onload = () => {
              if (tapOverlay) tapOverlay.classList.add('hidden');
            };
          } else if (ch.streamUrl) {
            const vid = buildHlsVideo(ch.streamUrl);
            wrap.appendChild(vid);
            if (tapOverlay) tapOverlay.classList.add('hidden');
          }
          addRecent(chId);
        }
      } else {
        // Pause: remove iframe to save memory when scrolled far away
        if (wrap && wrap.dataset.loaded) {
          const cardRect = card.getBoundingClientRect();
          // Only remove if more than 2 screens away
          if (Math.abs(cardRect.top) > window.innerHeight * 2.5) {
            wrap.innerHTML = '';
            delete wrap.dataset.loaded;
            if (tapOverlay) tapOverlay.classList.remove('hidden');
          }
        }
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.reel-card').forEach(c => io.observe(c));
}

function handleReelAction(e, ch) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === 'fav') {
    toggleFav(ch.id);
    const svg = btn.querySelector('path');
    if (svg) svg.setAttribute('fill', isFav(ch.id) ? 'currentColor' : 'none');
    btn.classList.toggle('active', isFav(ch.id));
  }
  else if (action === 'share') {
    const url = `${location.origin}${location.pathname}?ch=${ch.id}`;
    navigator.share ? navigator.share({title:ch.name,url}) : navigator.clipboard.writeText(url).then(()=>showToast(t('share_copied')));
  }
  else if (action === 'info' || action === 'watch') {
    openChannelPage(ch.id);
  }
  else if (action === 'mute') {
    State.muted = !State.muted;
    // Toggle mute on all active iframes via postMessage (YouTube API)
    document.querySelectorAll('.reel-video-wrap iframe').forEach(iframe => {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command', func: State.muted ? 'mute' : 'unMute', args: []
      }), '*');
    });
    showToast(State.muted ? '🔇 Muted' : '🔊 Unmuted');
    btn.querySelector('svg')?.setAttribute('opacity', State.muted ? '1' : '0.5');
  }
}

// ── DIRECTORY ─────────────────────────────────────────────────
function buildChannelThumb(ch) {
  return `
    <div class="dir-card-thumb" style="background:${bgGradient(CHANNELS.indexOf(ch))}">
      <span style="font-size:36px">${ch.logo}</span>
      ${ch.isLive ? `<div class="dir-card-live-badge">LIVE</div>` : ''}
    </div>
    <div class="dir-card-body">
      <div class="dir-card-name">${ch.name}</div>
      <div class="dir-card-meta">${ch.country} · ${ch.category}</div>
    </div>`;
}

function renderDirectory(filterCat='All') {
  const catBox = $('dirCategories');
  const grid   = $('dirGrid');
  catBox.innerHTML = CATEGORIES.map(c=>`
    <button class="dir-cat-chip ${filterCat===c.id?'active':''}" data-cat="${c.id}">${c.emoji} ${c.label}</button>
  `).join('');
  catBox.onclick = e => { const chip=e.target.closest('.dir-cat-chip'); if(chip) renderDirectory(chip.dataset.cat); };

  const list = filterCat==='All' ? CHANNELS : CHANNELS.filter(c=>c.category===filterCat);
  grid.innerHTML = '';
  list.forEach((ch,i)=>{
    const card = document.createElement('div');
    card.className = 'dir-card slide-up';
    card.style.animationDelay = `${i*0.03}s`;
    card.innerHTML = buildChannelThumb(ch);
    card.onclick = () => openChannelPage(ch.id);
    grid.appendChild(card);
  });
}

// ── SPORTS ────────────────────────────────────────────────────
function renderSports() {
  const sports = CHANNELS.filter(c=>c.category==='Sports');
  const grid = $('sportsGrid');
  grid.innerHTML = '';
  sports.forEach((ch,i)=>{
    const card = document.createElement('div');
    card.className = 'sports-card slide-up';
    card.style.animationDelay = `${i*0.04}s`;
    card.innerHTML = `
      <div class="sports-card-icon">${ch.logo}</div>
      <div class="sports-card-name">${ch.name}</div>
      <div class="sports-card-meta">${ch.country}</div>`;
    card.onclick = ()=>openChannelPage(ch.id);
    grid.appendChild(card);
  });
  $('scheduleList').innerHTML = MATCH_SCHEDULES.map(m=>`
    <div class="schedule-item fade-in">
      <div class="schedule-time">${m.time}</div>
      <div class="schedule-info">
        <div class="schedule-match">${m.match}</div>
        <div class="schedule-channel">${m.channel}</div>
      </div>
      <span class="schedule-sport">${m.sport}</span>
    </div>`).join('');
}

// ── FAVORITES ─────────────────────────────────────────────────
function renderFavorites() {
  renderFavGrid($('savedGrid'), State.favorites, t('no_favorites'));
  renderFavGrid($('recentGrid'), State.recentlyWatched, t('no_recent'));
}
function renderFavGrid(container, ids, emptyMsg) {
  container.innerHTML = '';
  if (!ids.length) {
    container.innerHTML = `<div class="fav-empty"><div class="fav-empty-icon">📭</div><div>${emptyMsg}</div></div>`;
    return;
  }
  ids.forEach(id => {
    const ch = CoubSearch.getById(id);
    if (!ch) return;
    const card = document.createElement('div');
    card.className = 'dir-card fade-in';
    card.innerHTML = buildChannelThumb(ch);
    card.onclick = ()=>openChannelPage(ch.id);
    container.appendChild(card);
  });
}

// ── CHANNEL PAGE ──────────────────────────────────────────────
function openChannelPage(channelId) {
  const ch = CoubSearch.getById(channelId);
  if (!ch) return;
  addRecent(channelId);
  const page = $('channelPage');
  const embedSrc = getEmbedSrc(ch);

  page.innerHTML = `
    <div class="ch-hero" style="background:${bgGradient(CHANNELS.indexOf(ch))}">
      ${embedSrc
        ? `<iframe class="ch-hero-video" src="${embedSrc}" allow="autoplay;fullscreen;encrypted-media" allowfullscreen></iframe>`
        : `<div class="ch-hero-emoji">${ch.logo}</div>`
      }
      <div class="ch-hero-gradient"></div>
      <button class="ch-back" id="chBackBtn">
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
        <button class="ch-btn ch-btn-fav ${isFav(channelId)?'active':''}" id="chFavBtn">
          ${isFav(channelId)?t('saved_btn'):t('save')}
        </button>
        <button class="ch-btn ch-btn-share" id="chShareBtn" aria-label="Share">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
    </div>`;

  showView('channel');

  $('chBackBtn').onclick  = ()=>showView(State.previousView||'feed');
  $('chWatchBtn').onclick = ()=> window.open(ch.website||`https://youtube.com/watch?v=${ch.youtubeId}`,'_blank','noopener');
  $('chFavBtn').onclick   = ()=>{
    toggleFav(channelId);
    const f=isFav(channelId);
    $('chFavBtn').textContent = f?t('saved_btn'):t('save');
    $('chFavBtn').classList.toggle('active',f);
  };
  $('chShareBtn').onclick = ()=>{
    const url=`${location.origin}${location.pathname}?ch=${channelId}`;
    navigator.share?navigator.share({title:ch.name,url}):navigator.clipboard.writeText(url).then(()=>showToast(t('share_copied')));
  };
}

// ── SEARCH ────────────────────────────────────────────────────
function initSearch() {
  const overlay=$('searchOverlay'), input=$('searchInput'), clearBtn=$('searchClear'), results=$('searchResults');
  $('searchToggleBtn').onclick = ()=>{ overlay.classList.remove('hidden'); setTimeout(()=>input.focus(),200); };
  $('searchBack').onclick      = ()=> overlay.classList.add('hidden');
  clearBtn.onclick             = ()=>{ input.value=''; clearBtn.classList.add('hidden'); renderSearchResults([]); };
  input.addEventListener('input',()=>{
    clearBtn.classList.toggle('hidden',!input.value);
    CoubSearch.liveSearch(input.value, State.searchFilter, renderSearchResults);
  });
  document.querySelectorAll('.filter-chip').forEach(chip=>{
    chip.onclick=()=>{
      document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      State.searchFilter=chip.dataset.filter;
      CoubSearch.liveSearch(input.value, State.searchFilter, renderSearchResults);
    };
  });
}

function renderSearchResults(channels) {
  const c=$('searchResults');
  if (!channels.length) { c.innerHTML=`<div class="no-results"><div class="no-results-icon">🔍</div><div>No channels found</div></div>`; return; }
  c.innerHTML=channels.map(ch=>`
    <div class="search-result-item" data-id="${ch.id}">
      <div class="result-thumb">${ch.logo}</div>
      <div class="result-info">
        <div class="result-name">${ch.name}</div>
        <div class="result-meta">${ch.category} · ${ch.country} · ${ch.language}</div>
      </div>
      ${ch.isLive?`<div class="result-live">LIVE</div>`:''}
    </div>`).join('');
  c.querySelectorAll('.search-result-item').forEach(item=>{
    item.onclick=()=>{ $('searchOverlay').classList.add('hidden'); openChannelPage(item.dataset.id); };
  });
}

// ── DRAWER ────────────────────────────────────────────────────
function openDrawer()  { $('drawer').classList.remove('hidden'); $('drawerBackdrop').classList.remove('hidden'); }
function closeDrawer() { $('drawer').classList.add('hidden');    $('drawerBackdrop').classList.add('hidden'); }

// ── LANGUAGE ──────────────────────────────────────────────────
function setLang(lang) { State.lang=lang; localStorage.setItem('coub_lang',lang); applyI18n(); }
function showLangModal() {
  const modal=document.createElement('div'); modal.className='lang-modal';
  modal.innerHTML=`<div class="lang-modal-content">
    <div class="lang-modal-title">Choose Language</div>
    <div class="lang-modal-opts">
      <button class="lang-modal-opt ${State.lang==='en'?'active':''}" data-lang-opt="en"><span class="lang-flag">🇬🇧</span> English</button>
      <button class="lang-modal-opt ${State.lang==='ar'?'active':''}" data-lang-opt="ar"><span class="lang-flag">🇸🇦</span> العربية</button>
      <button class="lang-modal-opt ${State.lang==='fr'?'active':''}" data-lang-opt="fr"><span class="lang-flag">🇫🇷</span> Français</button>
      <button class="lang-modal-opt ${State.lang==='es'?'active':''}" data-lang-opt="es"><span class="lang-flag">🇪🇸</span> Español</button>
    </div></div>`;
  document.body.appendChild(modal);
  modal.onclick=e=>{ const b=e.target.closest('[data-lang-opt]'); if(b){setLang(b.dataset.langOpt);modal.remove();}else if(e.target===modal)modal.remove(); };
}

// ── CATEGORY RAIL ─────────────────────────────────────────────
function initCategoryRail() {
  $('categoryRail').onclick=e=>{
    const pill=e.target.closest('.cat-pill'); if(!pill) return;
    document.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));
    pill.classList.add('active');
    State.currentCategory=pill.dataset.cat;
    renderFeed();
  };
}

// ── DEEP LINK ─────────────────────────────────────────────────
function handleDeepLink() {
  const ch = new URLSearchParams(location.search).get('ch');
  if (ch && CoubSearch.getById(ch)) openChannelPage(ch);
}

// ── INIT ──────────────────────────────────────────────────────
function init() {
  setTimeout(()=>{
    $('splash').classList.add('hidden');
    $('app').classList.remove('hidden');
    renderFeed();
    applyI18n();
    initSearch();
    initCategoryRail();
    handleDeepLink();
  }, 2200);

  document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>showView(b.dataset.view));
  document.querySelectorAll('.drawer-link').forEach(l=>l.onclick=e=>{e.preventDefault();showView(l.dataset.view);});
  document.querySelectorAll('.lang-opt').forEach(b=>b.onclick=()=>setLang(b.dataset.langOpt));

  $('menuBtn').onclick           = openDrawer;
  $('drawerClose').onclick       = closeDrawer;
  $('drawerBackdrop').onclick    = closeDrawer;
  $('homeBtn').onclick           = ()=>showView('feed');
  $('langBtn').onclick           = showLangModal;
}

document.addEventListener('DOMContentLoaded', init);
