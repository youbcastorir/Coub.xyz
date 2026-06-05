/* app.js — Coub.xyz v3
   Real HLS playback via hls.js + Safari native HLS
   No YouTube embeds (blocked on many sites)
*/
'use strict';

// ── I18N ────────────────────────────────────────────────────
const I18N = {
  en: { live_feed:"Live Feed", channels:"Channels", sports_hub:"Sports Hub", favorites:"Favorites",
        premium:"Premium", contact:"Contact", all_channels:"All Channels",
        channels_sub:"Free-to-air broadcasts & World Cup 2026",
        sports_sub:"World Cup 2026 official free-to-air channels",
        fav_sub:"Your saved and recently watched channels",
        saved:"Saved Channels", recently_watched:"Recently Watched",
        live:"Live", sports:"Sports", no_favorites:"No saved channels yet",
        no_recent:"No recently watched", share_copied:"Link copied!",
        added_fav:"Added to favorites", removed_fav:"Removed from favorites",
        watch_now:"Open Stream", save:"Save", saved_btn:"Saved",
        tap_watch:"Tap to Load Stream", loading:"Loading stream…", error_stream:"Stream unavailable" },
  ar: { live_feed:"البث المباشر", channels:"القنوات", sports_hub:"كأس العالم 2026",
        favorites:"المفضلة", premium:"بريميوم", contact:"التواصل",
        all_channels:"كل القنوات", channels_sub:"قنوات مجانية + ناقلات كأس العالم 2026",
        sports_sub:"القنوات الناقلة الرسمية لكأس العالم 2026 مجاناً",
        fav_sub:"قنواتك المحفوظة والمشاهدة مؤخراً",
        saved:"القنوات المحفوظة", recently_watched:"شوهد مؤخراً",
        live:"مباشر", sports:"رياضة", no_favorites:"لا توجد قنوات محفوظة",
        no_recent:"لا يوجد سجل مشاهدة", share_copied:"تم نسخ الرابط!",
        added_fav:"أضيف للمفضلة", removed_fav:"حُذف من المفضلة",
        watch_now:"فتح البث", save:"حفظ", saved_btn:"محفوظ",
        tap_watch:"اضغط لتشغيل البث", loading:"جاري التحميل…", error_stream:"البث غير متاح" },
  fr: { live_feed:"Direct Live", channels:"Chaînes", sports_hub:"Coupe du Monde 2026",
        favorites:"Favoris", premium:"Premium", contact:"Contact",
        all_channels:"Toutes les chaînes", channels_sub:"Chaînes gratuites + Coupe du Monde 2026",
        sports_sub:"Chaînes officielles gratuites Coupe du Monde 2026",
        fav_sub:"Vos chaînes sauvegardées", saved:"Sauvegardées",
        recently_watched:"Récemment regardé", live:"Direct", sports:"Sport",
        no_favorites:"Pas encore de chaînes", no_recent:"Aucun historique",
        share_copied:"Lien copié!", added_fav:"Ajouté aux favoris",
        removed_fav:"Supprimé des favoris", watch_now:"Ouvrir", save:"Sauv.", saved_btn:"Sauvé",
        tap_watch:"Appuyer pour charger", loading:"Chargement…", error_stream:"Flux indisponible" },
  es: { live_feed:"En Directo", channels:"Canales", sports_hub:"Mundial 2026",
        favorites:"Favoritos", premium:"Premium", contact:"Contacto",
        all_channels:"Todos los canales", channels_sub:"Canales gratuitos + Mundial 2026",
        sports_sub:"Canales oficiales gratuitos del Mundial 2026",
        fav_sub:"Tus canales guardados", saved:"Guardados",
        recently_watched:"Vistos recientemente", live:"En Vivo", sports:"Deporte",
        no_favorites:"Sin canales guardados", no_recent:"Sin historial",
        share_copied:"¡Enlace copiado!", added_fav:"Añadido a favoritos",
        removed_fav:"Eliminado de favoritos", watch_now:"Abrir", save:"Guardar", saved_btn:"Guardado",
        tap_watch:"Pulsar para cargar", loading:"Cargando…", error_stream:"Stream no disponible" }
};

// ── STATE ────────────────────────────────────────────────────
const State = {
  lang: localStorage.getItem('coub_lang') || 'en',
  currentView: 'feed',
  currentCategory: 'All',
  searchFilter: 'all',
  favorites: JSON.parse(localStorage.getItem('coub_favs') || '[]'),
  recentlyWatched: JSON.parse(localStorage.getItem('coub_recent') || '[]'),
  feedChannels: [],
  previousView: null,
  hlsInstances: {},   // hls instance per channel id
};

const $ = id => document.getElementById(id);
const t = key => (I18N[State.lang]||{})[key] || I18N.en[key] || key;

function showToast(msg, dur=2200) {
  let el = document.querySelector('.toast');
  if (!el) { el=document.createElement('div'); el.className='toast'; document.body.appendChild(el); }
  el.textContent=msg; el.classList.add('show');
  clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'), dur);
}

function saveFavorites(){ localStorage.setItem('coub_favs', JSON.stringify(State.favorites)); }
function saveRecent()   { localStorage.setItem('coub_recent', JSON.stringify(State.recentlyWatched.slice(0,20))); }
function addRecent(id)  { State.recentlyWatched=[id,...State.recentlyWatched.filter(x=>x!==id)].slice(0,20); saveRecent(); }
function isFav(id)      { return State.favorites.includes(id); }
function toggleFav(id)  {
  if(isFav(id)){ State.favorites=State.favorites.filter(x=>x!==id); showToast(t('removed_fav')); }
  else         { State.favorites=[id,...State.favorites]; showToast(t('added_fav')); }
  saveFavorites();
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n');
    if(I18N[State.lang]?.[k]) el.textContent=I18N[State.lang][k];
  });
  document.body.setAttribute('data-lang', State.lang);
  document.documentElement.dir = State.lang==='ar'?'rtl':'ltr';
  $('langBtn').textContent = State.lang.toUpperCase();
  document.querySelectorAll('.lang-opt,.lang-modal-opt').forEach(b=>b.classList.toggle('active',b.dataset.langOpt===State.lang));
}

// ── VIEW NAV ─────────────────────────────────────────────────
function showView(id) {
  State.previousView=State.currentView; State.currentView=id;
  document.querySelectorAll('.view').forEach(v=>{
    v.classList.toggle('active', v.id===`view-${id}`);
    v.classList.toggle('hidden', v.id!==`view-${id}`);
  });
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
  document.querySelectorAll('.drawer-link').forEach(l=>l.classList.toggle('active',l.dataset.view===id));
  if(id==='feed')      renderFeed();
  if(id==='directory') renderDirectory();
  if(id==='sports')    renderSports();
  if(id==='favorites') renderFavorites();
  closeDrawer(); window.scrollTo(0,0);
}

// ── HLS PLAYER ───────────────────────────────────────────────
function createVideoPlayer(ch, container, onReady, onError) {
  const video = document.createElement('video');
  video.muted   = true;
  video.autoplay = true;
  video.playsinline = true;
  video.controls = false;
  video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;background:#000;';

  const url = ch.streamUrl;
  if (!url) { onError && onError(); return null; }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari / iOS — native HLS support
    video.src = url;
    video.addEventListener('canplay', ()=>{ video.play().catch(()=>{}); onReady && onReady(video); }, {once:true});
    video.addEventListener('error', ()=>{ onError && onError(); }, {once:true});
  } else if (window.Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 30,
      maxBufferLength: 20,
      maxMaxBufferLength: 60,
    });
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, ()=>{
      video.play().catch(()=>{});
      onReady && onReady(video);
    });
    hls.on(Hls.Events.ERROR, (e, data)=>{
      if (data.fatal) { hls.destroy(); onError && onError(); }
    });
    // Store hls instance so we can destroy it later
    if (State.hlsInstances[ch.id]) State.hlsInstances[ch.id].destroy();
    State.hlsInstances[ch.id] = hls;
  } else {
    // MSE not supported fallback
    onError && onError();
    return null;
  }

  container.appendChild(video);
  return video;
}

function destroyPlayer(chId) {
  if (State.hlsInstances[chId]) {
    State.hlsInstances[chId].destroy();
    delete State.hlsInstances[chId];
  }
}

// ── REEL CARD ────────────────────────────────────────────────
const BG_GRADIENTS = [
  'linear-gradient(160deg,#0d1b2a,#1b4f72)','linear-gradient(160deg,#1a0a2e,#3d1080)',
  'linear-gradient(160deg,#0a2e1a,#0d6e3a)','linear-gradient(160deg,#2e0a0a,#7a1a1a)',
  'linear-gradient(160deg,#1a1a0a,#5e4a0a)','linear-gradient(160deg,#0a1a2e,#0a3e6e)',
  'linear-gradient(160deg,#2a0a1a,#7a1a4a)','linear-gradient(160deg,#0a2a2a,#0a5e5e)',
  'linear-gradient(160deg,#1a0a0a,#6e2a0a)','linear-gradient(160deg,#0a0a2a,#2a0a6e)',
];

function bgOf(idx){ return BG_GRADIENTS[idx % BG_GRADIENTS.length]; }

function buildFeedList() {
  let pool = State.currentCategory==='All' ? [...CHANNELS]
           : CHANNELS.filter(c=>c.category===State.currentCategory);
  // WC2026 channels first, then shuffle rest
  const wc    = pool.filter(c=>c.isWC2026);
  const other = pool.filter(c=>!c.isWC2026);
  for(let i=other.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [other[i],other[j]]=[other[j],other[i]]; }
  return [...wc, ...other];
}

function renderFeed() {
  // Destroy all existing hls instances to free memory
  Object.keys(State.hlsInstances).forEach(id=>destroyPlayer(id));

  State.feedChannels = buildFeedList();
  const feed = $('reelFeed');
  feed.innerHTML = '';
  State.feedChannels.forEach((ch,idx)=> feed.appendChild(createReelCard(ch, idx)));
  initReelObserver();
}

function createReelCard(ch, idx) {
  const card = document.createElement('div');
  card.className = 'reel-card';
  card.dataset.channelId = ch.id;

  const wcBadge = ch.isWC2026
    ? `<div class="reel-wc-badge">🏆 WC2026</div>` : '';

  card.innerHTML = `
    <div class="reel-bg" style="background:${bgOf(idx)}">
      <div class="reel-emoji">${ch.logo}</div>
    </div>
    <div class="reel-video-wrap" id="vid-${ch.id}"></div>

    <div class="reel-live-badge">● LIVE</div>
    ${wcBadge}

    <button class="reel-mute" id="mute-${ch.id}" data-action="mute">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">
        <span class="reel-cat-tag">${ch.category}</span>
        ${ch.isWC2026?'<span class="reel-cat-tag" style="background:rgba(255,215,0,0.2);color:#ffd700">⚽ WC2026</span>':''}
      </div>
    </div>

    <!-- Loading / tap overlay -->
    <div class="reel-tap-overlay" id="tap-${ch.id}">
      <div class="tap-spinner" id="spin-${ch.id}" style="display:none">
        <div class="spinner-ring"></div>
        <div class="spinner-label">${t('loading')}</div>
      </div>
      <div class="tap-play-btn" id="tapbtn-${ch.id}">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>
      <div class="tap-label">${t('tap_watch')}</div>
    </div>
  `;

  card.addEventListener('click', e => handleReelAction(e, ch));
  return card;
}

function loadCardStream(ch) {
  const wrap    = document.getElementById(`vid-${ch.id}`);
  const tapOver = document.getElementById(`tap-${ch.id}`);
  const spinner = document.getElementById(`spin-${ch.id}`);
  const tapBtn  = document.getElementById(`tapbtn-${ch.id}`);
  if (!wrap || wrap.dataset.loaded) return;

  wrap.dataset.loaded = '1';
  // Show spinner, hide play button
  if (spinner) spinner.style.display='flex';
  if (tapBtn)  tapBtn.style.display='none';

  createVideoPlayer(ch, wrap,
    (video) => {
      // Success — hide overlay
      if (tapOver) { tapOver.style.opacity='0'; setTimeout(()=>tapOver.style.display='none', 600); }
      addRecent(ch.id);
    },
    () => {
      // Error — show fallback
      delete wrap.dataset.loaded;
      if (spinner) spinner.style.display='none';
      if (tapBtn)  tapBtn.style.display='flex';
      if (tapOver) {
        tapOver.querySelector('.tap-label').textContent = t('error_stream');
        tapOver.querySelector('.tap-label').style.color = '#ff6b6b';
      }
    }
  );
}

function initReelObserver() {
  if (!window.IntersectionObserver) { State.feedChannels.forEach(ch=>loadCardStream(ch)); return; }

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const card  = entry.target;
      const chId  = card.dataset.channelId;
      const ch    = CoubSearch.getById(chId);
      if (!ch) return;

      if (entry.isIntersecting) {
        loadCardStream(ch);
      } else {
        // Free memory for cards far off-screen (>2 screens away)
        const rect = card.getBoundingClientRect();
        if (Math.abs(rect.top) > window.innerHeight * 2.5) {
          destroyPlayer(chId);
          const wrap = document.getElementById(`vid-${chId}`);
          if (wrap) { wrap.innerHTML=''; delete wrap.dataset.loaded; }
          const tap = document.getElementById(`tap-${chId}`);
          if (tap) { tap.style.display='flex'; tap.style.opacity='1'; }
          const lbl = tap?.querySelector('.tap-label');
          if (lbl) { lbl.textContent=t('tap_watch'); lbl.style.color=''; }
          const spin=document.getElementById(`spin-${chId}`);
          if (spin) spin.style.display='none';
          const tapBtn=document.getElementById(`tapbtn-${chId}`);
          if (tapBtn) tapBtn.style.display='flex';
        }
      }
    });
  }, { threshold: 0.55 });

  document.querySelectorAll('.reel-card').forEach(c=>io.observe(c));
}

function handleReelAction(e, ch) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;

  if (action==='fav') {
    toggleFav(ch.id);
    btn.querySelector('path')?.setAttribute('fill', isFav(ch.id)?'currentColor':'none');
    btn.classList.toggle('active', isFav(ch.id));
  }
  else if (action==='share') {
    const url=`${location.origin}${location.pathname}?ch=${ch.id}`;
    navigator.share?navigator.share({title:ch.name,url}):navigator.clipboard.writeText(url).then(()=>showToast(t('share_copied')));
  }
  else if (action==='info') { openChannelPage(ch.id); }
  else if (action==='mute') {
    const vid = document.querySelector(`#vid-${ch.id} video`);
    if (vid) { vid.muted=!vid.muted; showToast(vid.muted?'🔇 Muted':'🔊 Unmuted'); }
  }
}

// ── DIRECTORY ────────────────────────────────────────────────
function buildChannelThumb(ch, idx) {
  return `
    <div class="dir-card-thumb" style="background:${bgOf(idx||0)}">
      <span style="font-size:36px">${ch.logo}</span>
      ${ch.isLive?`<div class="dir-card-live-badge">LIVE</div>`:''}
      ${ch.isWC2026?`<div class="dir-card-wc-badge">⚽ WC</div>`:''}
    </div>
    <div class="dir-card-body">
      <div class="dir-card-name">${ch.name}</div>
      <div class="dir-card-meta">${ch.country} · ${ch.category}</div>
    </div>`;
}

function renderDirectory(filterCat='All') {
  const catBox=$('dirCategories'), grid=$('dirGrid');
  catBox.innerHTML=CATEGORIES.map(c=>`
    <button class="dir-cat-chip ${filterCat===c.id?'active':''}" data-cat="${c.id}">${c.emoji} ${c.label}</button>
  `).join('');
  catBox.onclick=e=>{ const ch=e.target.closest('.dir-cat-chip'); if(ch) renderDirectory(ch.dataset.cat); };
  const list = filterCat==='All'?CHANNELS:CHANNELS.filter(c=>c.category===filterCat);
  grid.innerHTML='';
  list.forEach((ch,i)=>{
    const card=document.createElement('div');
    card.className='dir-card slide-up';
    card.style.animationDelay=`${i*0.03}s`;
    card.innerHTML=buildChannelThumb(ch,i);
    card.onclick=()=>openChannelPage(ch.id);
    grid.appendChild(card);
  });
}

// ── SPORTS ───────────────────────────────────────────────────
function renderSports() {
  const wc26 = CHANNELS.filter(c=>c.isWC2026);
  const grid=$('sportsGrid');
  grid.innerHTML='';
  wc26.forEach((ch,i)=>{
    const card=document.createElement('div');
    card.className='sports-card slide-up';
    card.style.animationDelay=`${i*0.04}s`;
    card.innerHTML=`
      <div class="sports-card-icon">${ch.logo}</div>
      <div class="sports-card-name">${ch.name}</div>
      <div class="sports-card-meta">${ch.country} — ${ch.language}</div>
      <div class="sports-card-wc">🏆 WC2026</div>`;
    card.onclick=()=>openChannelPage(ch.id);
    grid.appendChild(card);
  });
  $('scheduleList').innerHTML=MATCH_SCHEDULES.map(m=>`
    <div class="schedule-item fade-in">
      <div class="schedule-time">${m.time}</div>
      <div class="schedule-info">
        <div class="schedule-match">${m.match}</div>
        <div class="schedule-channel">${m.channel}</div>
      </div>
      <span class="schedule-sport">${m.sport}</span>
    </div>`).join('');
}

// ── FAVORITES ────────────────────────────────────────────────
function renderFavorites() {
  renderFavGrid($('savedGrid'), State.favorites, t('no_favorites'));
  renderFavGrid($('recentGrid'), State.recentlyWatched, t('no_recent'));
}
function renderFavGrid(container, ids, emptyMsg) {
  container.innerHTML='';
  if(!ids.length){
    container.innerHTML=`<div class="fav-empty"><div class="fav-empty-icon">📭</div><div>${emptyMsg}</div></div>`;
    return;
  }
  ids.forEach((id,i)=>{
    const ch=CoubSearch.getById(id); if(!ch) return;
    const card=document.createElement('div');
    card.className='dir-card fade-in';
    card.innerHTML=buildChannelThumb(ch,i);
    card.onclick=()=>openChannelPage(ch.id);
    container.appendChild(card);
  });
}

// ── CHANNEL PAGE ─────────────────────────────────────────────
function openChannelPage(channelId) {
  const ch=CoubSearch.getById(channelId); if(!ch) return;
  addRecent(channelId);
  const page=$('channelPage');
  const idx=CHANNELS.indexOf(ch);

  page.innerHTML=`
    <div class="ch-hero" style="background:${bgOf(idx)}">
      <div class="ch-hero-video-wrap" id="chvid-${ch.id}"></div>
      <div class="ch-hero-emoji" id="chbg-${ch.id}">${ch.logo}</div>
      <div class="ch-hero-gradient"></div>
      <button class="ch-back" id="chBackBtn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="ch-loading" id="ch-loading-${ch.id}">
        <div class="spinner-ring"></div>
      </div>
    </div>
    <div class="ch-meta">
      <div class="ch-name">${ch.name}</div>
      <div class="ch-tags">
        ${ch.isLive?`<span class="ch-tag live">● LIVE</span>`:''}
        ${ch.isWC2026?`<span class="ch-tag wc">⚽ WC2026</span>`:''}
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
        <button class="ch-btn ch-btn-share" id="chShareBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
    </div>`;

  showView('channel');

  // Auto-play in channel page hero
  const heroWrap=document.getElementById(`chvid-${ch.id}`);
  const heroBg=document.getElementById(`chbg-${ch.id}`);
  const heroLoad=document.getElementById(`ch-loading-${ch.id}`);

  if (ch.streamUrl) {
    createVideoPlayer(ch, heroWrap,
      ()=>{ if(heroBg) heroBg.style.display='none'; if(heroLoad) heroLoad.style.display='none'; },
      ()=>{ if(heroLoad) heroLoad.style.display='none'; }
    );
  } else {
    if(heroLoad) heroLoad.style.display='none';
  }

  $('chBackBtn').onclick=()=>{ destroyPlayer(channelId); showView(State.previousView||'feed'); };
  $('chWatchBtn').onclick=()=>{ if(ch.streamUrl) window.open(ch.streamUrl,'_blank','noopener'); };
  $('chFavBtn').onclick=()=>{
    toggleFav(channelId);
    $('chFavBtn').textContent=isFav(channelId)?t('saved_btn'):t('save');
    $('chFavBtn').classList.toggle('active',isFav(channelId));
  };
  $('chShareBtn').onclick=()=>{
    const url=`${location.origin}${location.pathname}?ch=${channelId}`;
    navigator.share?navigator.share({title:ch.name,url}):navigator.clipboard.writeText(url).then(()=>showToast(t('share_copied')));
  };
}

// ── SEARCH ───────────────────────────────────────────────────
function initSearch() {
  const overlay=$('searchOverlay'),input=$('searchInput'),clearBtn=$('searchClear'),results=$('searchResults');
  $('searchToggleBtn').onclick=()=>{ overlay.classList.remove('hidden'); setTimeout(()=>input.focus(),200); };
  $('searchBack').onclick=()=>overlay.classList.add('hidden');
  clearBtn.onclick=()=>{ input.value=''; clearBtn.classList.add('hidden'); renderSearchResults([]); };
  input.addEventListener('input',()=>{
    clearBtn.classList.toggle('hidden',!input.value);
    CoubSearch.liveSearch(input.value,State.searchFilter,renderSearchResults);
  });
  document.querySelectorAll('.filter-chip').forEach(chip=>{
    chip.onclick=()=>{
      document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active'); State.searchFilter=chip.dataset.filter;
      CoubSearch.liveSearch(input.value,State.searchFilter,renderSearchResults);
    };
  });
}
function renderSearchResults(channels) {
  const c=$('searchResults');
  if(!channels.length){ c.innerHTML=`<div class="no-results"><div class="no-results-icon">🔍</div><div>No channels found</div></div>`; return; }
  c.innerHTML=channels.map(ch=>`
    <div class="search-result-item" data-id="${ch.id}">
      <div class="result-thumb">${ch.logo}</div>
      <div class="result-info">
        <div class="result-name">${ch.name}</div>
        <div class="result-meta">${ch.category} · ${ch.country} · ${ch.language}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
        ${ch.isLive?`<div class="result-live">LIVE</div>`:''}
        ${ch.isWC2026?`<div class="result-live" style="background:#c8a600;color:#000">WC26</div>`:''}
      </div>
    </div>`).join('');
  c.querySelectorAll('.search-result-item').forEach(item=>{
    item.onclick=()=>{ $('searchOverlay').classList.add('hidden'); openChannelPage(item.dataset.id); };
  });
}

// ── DRAWER ───────────────────────────────────────────────────
function openDrawer() { $('drawer').classList.remove('hidden'); $('drawerBackdrop').classList.remove('hidden'); }
function closeDrawer(){ $('drawer').classList.add('hidden');    $('drawerBackdrop').classList.add('hidden'); }

// ── LANGUAGE ─────────────────────────────────────────────────
function setLang(lang){ State.lang=lang; localStorage.setItem('coub_lang',lang); applyI18n(); }
function showLangModal(){
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

// ── CATEGORY RAIL ────────────────────────────────────────────
function initCategoryRail(){
  $('categoryRail').onclick=e=>{
    const pill=e.target.closest('.cat-pill'); if(!pill) return;
    document.querySelectorAll('.cat-pill').forEach(p=>p.classList.remove('active'));
    pill.classList.add('active'); State.currentCategory=pill.dataset.cat; renderFeed();
  };
}

// ── DEEP LINK ────────────────────────────────────────────────
function handleDeepLink(){
  const ch=new URLSearchParams(location.search).get('ch');
  if(ch && CoubSearch.getById(ch)) openChannelPage(ch);
}

// ── INIT ─────────────────────────────────────────────────────
function init(){
  setTimeout(()=>{
    $('splash').classList.add('hidden');
    $('app').classList.remove('hidden');
    renderFeed(); applyI18n(); initSearch(); initCategoryRail(); handleDeepLink();
  }, 2000);
  document.querySelectorAll('.nav-item').forEach(b=>b.onclick=()=>showView(b.dataset.view));
  document.querySelectorAll('.drawer-link').forEach(l=>l.onclick=e=>{e.preventDefault();showView(l.dataset.view);});
  document.querySelectorAll('.lang-opt').forEach(b=>b.onclick=()=>setLang(b.dataset.langOpt));
  $('menuBtn').onclick=$('homeBtn').onclick=()=>{ if($('menuBtn')===event.target||$('menuBtn').contains(event.target)) openDrawer(); else showView('feed'); };
  $('menuBtn').onclick=openDrawer;
  $('homeBtn').onclick=()=>showView('feed');
  $('drawerClose').onclick=$('drawerBackdrop').onclick=closeDrawer;
  $('langBtn').onclick=showLangModal;
}

document.addEventListener('DOMContentLoaded', init);
