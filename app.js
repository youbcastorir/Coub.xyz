/**
 * Peczo.c.la — app.js
 * Core application: theme, i18n, navigation, stats, counters
 */

'use strict';

// ============================================================
// TRANSLATIONS
// ============================================================
const TRANSLATIONS = {
  en: {
    upload: 'Upload',
    trending: 'Trending',
    categories: 'Categories',
    world_map: 'World Map',
    contact: 'Contact',
    live_uploads: 'Live uploads from around the world',
    hero_title1: "The World's",
    hero_title2: 'Open Photo Album',
    hero_sub: 'Upload a photo. No account. No rules. Just the world.',
    share_a_photo: 'Share a Photo',
    explore_gallery: 'Explore Gallery',
    photos_shared: 'Photos shared',
    countries: 'Countries',
    uploaded_today: 'Uploaded today',
    latest: 'Latest',
    random: 'Random',
    most_viewed: 'Most Viewed',
    all_categories: 'All Categories',
    all_countries: 'All Countries',
    browse_by_category: 'Browse by Category',
    cat_sub: 'Discover photos from every corner of human life',
    trending_now: 'Trending Now',
    updated_live: 'Updated live',
    map_sub: 'See where the latest photos come from',
    most_active: 'Most active',
    active: 'Active',
    recent: 'Recent',
    share_your_photo: 'Share Your Photo',
    upload_sub: 'No account needed — just pick a photo and share it with the world.',
    drop_photo: 'Drop your photo here',
    or_click_to_browse: 'or click to browse',
    file_hint: 'JPG, PNG, WebP · Max 10MB',
    title: 'Title',
    title_placeholder: 'Give your photo a title…',
    description: 'Description',
    desc_placeholder: 'Tell the story behind this photo…',
    country: 'Country',
    city: 'City',
    category: 'Category',
    tags: 'Tags',
    tags_placeholder: 'sunrise, mountains, golden-hour…',
    tags_hint: 'Separate with commas',
    select_country: 'Select country…',
    select_category: 'Select category…',
    consent_label: 'I own this photo and agree to share it publicly on Peczo.c.la',
    uploading: 'Uploading…',
    publish_photo: 'Publish Photo',
    share: 'Share',
    report: 'Report',
    copy: 'Copy',
    comments: 'Comments',
    leave_a_comment: 'Leave a comment…',
    post: 'Post',
    report_photo: 'Report Photo',
    report_sub: 'Help keep Peczo a safe place for everyone.',
    report_spam: 'Spam or advertising',
    report_inappropriate: 'Inappropriate or offensive',
    report_copyright: 'Copyright violation',
    report_violence: 'Violence or harmful content',
    report_other: 'Other',
    report_details_placeholder: 'Additional details (optional)…',
    submit_report: 'Submit Report',
    no_photos_yet: 'No photos yet. Be the first to share one!',
    upload_now: 'Upload Now',
    load_more: 'Load More',
    latest_photos: 'Latest Photos',
    explore: 'Explore',
    support: 'Support',
    contact_us: 'Contact Us',
    upload_photo: 'Upload Photo',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    moderation: 'Moderation',
    footer_tagline: "The World's Open Photo Album",
    footer_desc: 'Coub.xyz is an open global photo album where people from all countries can share moments, memories, creativity, and everyday life.',
    copyright: '© 2025 Peczo.c.la · Coub.xyz · All photos belong to their uploaders',
    search_results_for: 'Search results for',
    no_results: 'No results found.',
    photo_uploaded: '🎉 Photo uploaded successfully!',
    report_submitted: 'Report submitted. Thank you!',
    copied: '✓ Link copied!',
    comment_posted: 'Comment posted!',
  },
  ar: {
    upload: 'رفع',
    trending: 'الأكثر تداولاً',
    categories: 'الفئات',
    world_map: 'خريطة العالم',
    contact: 'تواصل معنا',
    live_uploads: 'رفع مباشر من جميع أنحاء العالم',
    hero_title1: 'ألبوم الصور',
    hero_title2: 'المفتوح للعالم',
    hero_sub: 'ارفع صورة. بدون حساب. بدون قيود. فقط العالم.',
    share_a_photo: 'شارك صورة',
    explore_gallery: 'استكشف المعرض',
    photos_shared: 'صور مشتركة',
    countries: 'دولة',
    uploaded_today: 'مرفوعة اليوم',
    latest: 'الأحدث',
    random: 'عشوائي',
    most_viewed: 'الأكثر مشاهدة',
    all_categories: 'جميع الفئات',
    all_countries: 'جميع الدول',
    browse_by_category: 'تصفح حسب الفئة',
    cat_sub: 'اكتشف صوراً من كل زاوية في الحياة',
    trending_now: 'رائج الآن',
    updated_live: 'يتحدث مباشرة',
    map_sub: 'انظر من أين تأتي أحدث الصور',
    most_active: 'الأكثر نشاطاً',
    active: 'نشط',
    recent: 'حديث',
    share_your_photo: 'شارك صورتك',
    upload_sub: 'لا حاجة لحساب — فقط اختر صورة وشاركها مع العالم.',
    drop_photo: 'أفلت صورتك هنا',
    or_click_to_browse: 'أو انقر للتصفح',
    file_hint: 'JPG، PNG، WebP · الحد الأقصى 10MB',
    title: 'العنوان',
    description: 'الوصف',
    country: 'الدولة',
    city: 'المدينة',
    category: 'الفئة',
    tags: 'الوسوم',
    tags_hint: 'افصل بالفواصل',
    select_country: 'اختر دولة…',
    select_category: 'اختر فئة…',
    consent_label: 'أمتلك هذه الصورة وأوافق على مشاركتها علناً على Peczo.c.la',
    uploading: 'جارٍ الرفع…',
    publish_photo: 'نشر الصورة',
    share: 'مشاركة',
    report: 'إبلاغ',
    copy: 'نسخ',
    comments: 'التعليقات',
    post: 'نشر',
    report_photo: 'الإبلاغ عن صورة',
    submit_report: 'إرسال البلاغ',
    no_photos_yet: 'لا توجد صور بعد. كن أول من يشاركها!',
    upload_now: 'ارفع الآن',
    load_more: 'تحميل المزيد',
    latest_photos: 'أحدث الصور',
    explore: 'استكشف',
    support: 'الدعم',
    contact_us: 'اتصل بنا',
    upload_photo: 'رفع صورة',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الاستخدام',
    moderation: 'الإشراف',
    footer_tagline: 'ألبوم الصور المفتوح للعالم',
    footer_desc: 'Coub.xyz هو ألبوم صور عالمي مفتوح حيث يمكن للناس من جميع البلدان مشاركة اللحظات والذكريات والإبداع والحياة اليومية.',
    copyright: '© 2025 Peczo.c.la · Coub.xyz · جميع الصور تعود لأصحابها',
    photo_uploaded: '🎉 تم رفع الصورة بنجاح!',
    report_submitted: 'تم تقديم البلاغ. شكراً!',
    copied: '✓ تم نسخ الرابط!',
    comment_posted: 'تم نشر التعليق!',
  },
  fr: {
    upload: 'Télécharger',
    trending: 'Tendances',
    categories: 'Catégories',
    world_map: 'Carte du monde',
    contact: 'Contact',
    live_uploads: 'Uploads en direct du monde entier',
    hero_title1: "L'album photo",
    hero_title2: 'ouvert au monde',
    hero_sub: 'Partagez une photo. Sans compte. Sans règles. Juste le monde.',
    share_a_photo: 'Partager une Photo',
    explore_gallery: 'Explorer la Galerie',
    photos_shared: 'Photos partagées',
    countries: 'Pays',
    uploaded_today: "Téléchargées aujourd'hui",
    latest: 'Dernières',
    random: 'Aléatoire',
    most_viewed: 'Plus vues',
    all_categories: 'Toutes les catégories',
    all_countries: 'Tous les pays',
    browse_by_category: 'Parcourir par catégorie',
    cat_sub: 'Découvrez des photos de tous les aspects de la vie',
    trending_now: 'Tendances actuelles',
    updated_live: 'Mise à jour en direct',
    map_sub: 'Voyez d'où viennent les dernières photos',
    most_active: 'Les plus actifs',
    active: 'Actif',
    recent: 'Récent',
    share_your_photo: 'Partagez votre photo',
    upload_sub: 'Pas de compte requis — choisissez juste une photo et partagez-la avec le monde.',
    drop_photo: 'Déposez votre photo ici',
    or_click_to_browse: 'ou cliquez pour parcourir',
    file_hint: 'JPG, PNG, WebP · Max 10Mo',
    title: 'Titre',
    description: 'Description',
    country: 'Pays',
    city: 'Ville',
    category: 'Catégorie',
    tags: 'Tags',
    tags_hint: 'Séparez par des virgules',
    select_country: 'Sélectionnez un pays…',
    select_category: 'Sélectionnez une catégorie…',
    consent_label: 'Je possède cette photo et accepte de la partager publiquement sur Peczo.c.la',
    uploading: 'Téléchargement…',
    publish_photo: 'Publier la Photo',
    share: 'Partager',
    report: 'Signaler',
    copy: 'Copier',
    comments: 'Commentaires',
    post: 'Publier',
    report_photo: 'Signaler une photo',
    submit_report: 'Soumettre le signalement',
    no_photos_yet: 'Pas encore de photos. Soyez le premier à en partager une!',
    upload_now: 'Télécharger maintenant',
    load_more: 'Charger plus',
    latest_photos: 'Dernières photos',
    explore: 'Explorer',
    support: 'Support',
    contact_us: 'Contactez-nous',
    upload_photo: 'Télécharger une photo',
    privacy: 'Politique de confidentialité',
    terms: "Conditions d'utilisation",
    moderation: 'Modération',
    footer_tagline: "L'album photo ouvert au monde",
    footer_desc: "Coub.xyz est un album photo mondial ouvert où les gens de tous les pays peuvent partager des moments, des souvenirs, de la créativité et la vie quotidienne.",
    copyright: '© 2025 Peczo.c.la · Coub.xyz · Toutes les photos appartiennent à leurs auteurs',
    photo_uploaded: '🎉 Photo publiée avec succès!',
    report_submitted: 'Signalement soumis. Merci!',
    copied: '✓ Lien copié!',
    comment_posted: 'Commentaire publié!',
  },
  es: {
    upload: 'Subir',
    trending: 'Tendencias',
    categories: 'Categorías',
    world_map: 'Mapa mundial',
    contact: 'Contacto',
    live_uploads: 'Subidas en vivo de todo el mundo',
    hero_title1: 'El álbum de fotos',
    hero_title2: 'abierto al mundo',
    hero_sub: 'Sube una foto. Sin cuenta. Sin reglas. Solo el mundo.',
    share_a_photo: 'Compartir una Foto',
    explore_gallery: 'Explorar la Galería',
    photos_shared: 'Fotos compartidas',
    countries: 'Países',
    uploaded_today: 'Subidas hoy',
    latest: 'Recientes',
    random: 'Aleatorio',
    most_viewed: 'Más vistas',
    all_categories: 'Todas las categorías',
    all_countries: 'Todos los países',
    browse_by_category: 'Explorar por categoría',
    cat_sub: 'Descubre fotos de todos los rincones de la vida',
    trending_now: 'Tendencias ahora',
    updated_live: 'Actualizado en vivo',
    map_sub: 'Mira de dónde vienen las últimas fotos',
    most_active: 'Más activo',
    active: 'Activo',
    recent: 'Reciente',
    share_your_photo: 'Comparte tu foto',
    upload_sub: 'No se necesita cuenta — solo elige una foto y compártela con el mundo.',
    drop_photo: 'Suelta tu foto aquí',
    or_click_to_browse: 'o haz clic para buscar',
    file_hint: 'JPG, PNG, WebP · Máx 10MB',
    title: 'Título',
    description: 'Descripción',
    country: 'País',
    city: 'Ciudad',
    category: 'Categoría',
    tags: 'Etiquetas',
    tags_hint: 'Separar con comas',
    select_country: 'Selecciona un país…',
    select_category: 'Selecciona una categoría…',
    consent_label: 'Soy el propietario de esta foto y acepto compartirla públicamente en Peczo.c.la',
    uploading: 'Subiendo…',
    publish_photo: 'Publicar Foto',
    share: 'Compartir',
    report: 'Reportar',
    copy: 'Copiar',
    comments: 'Comentarios',
    post: 'Publicar',
    report_photo: 'Reportar foto',
    submit_report: 'Enviar reporte',
    no_photos_yet: 'Sin fotos todavía. ¡Sé el primero en compartir una!',
    upload_now: 'Subir ahora',
    load_more: 'Cargar más',
    latest_photos: 'Fotos recientes',
    explore: 'Explorar',
    support: 'Soporte',
    contact_us: 'Contáctanos',
    upload_photo: 'Subir foto',
    privacy: 'Política de privacidad',
    terms: 'Términos de uso',
    moderation: 'Moderación',
    footer_tagline: 'El álbum de fotos abierto al mundo',
    footer_desc: 'Coub.xyz es un álbum de fotos mundial abierto donde personas de todos los países pueden compartir momentos, recuerdos, creatividad y vida cotidiana.',
    copyright: '© 2025 Peczo.c.la · Coub.xyz · Todas las fotos pertenecen a sus autores',
    photo_uploaded: '🎉 ¡Foto publicada con éxito!',
    report_submitted: '¡Reporte enviado. Gracias!',
    copied: '✓ ¡Enlace copiado!',
    comment_posted: '¡Comentario publicado!',
  }
};

// ============================================================
// COUNTRIES LIST
// ============================================================
const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', lat: 33.93, lng: 67.71 },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', lat: 41.15, lng: 20.17 },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', lat: 28.03, lng: 1.66 },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', lat: -38.42, lng: -63.62 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', lat: -25.27, lng: 133.78 },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', lat: 47.52, lng: 14.55 },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', lat: 23.68, lng: 90.36 },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', lat: 50.50, lng: 4.47 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', lat: -14.24, lng: -51.93 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', lat: 56.13, lng: -106.35 },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', lat: -35.68, lng: -71.54 },
  { code: 'CN', name: 'China', flag: '🇨🇳', lat: 35.86, lng: 104.20 },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', lat: 4.57, lng: -74.30 },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', lat: 45.10, lng: 15.20 },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', lat: 49.82, lng: 15.47 },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', lat: 56.26, lng: 9.50 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', lat: 26.82, lng: 30.80 },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', lat: 9.14, lng: 40.49 },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', lat: 61.92, lng: 25.75 },
  { code: 'FR', name: 'France', flag: '🇫🇷', lat: 46.23, lng: 2.21 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', lat: 51.17, lng: 10.45 },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', lat: 7.95, lng: -1.02 },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', lat: 39.07, lng: 21.82 },
  { code: 'IN', name: 'India', flag: '🇮🇳', lat: 20.59, lng: 78.96 },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', lat: -0.79, lng: 113.92 },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', lat: 32.43, lng: 53.69 },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', lat: 33.22, lng: 43.68 },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', lat: 53.41, lng: -8.24 },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', lat: 31.05, lng: 34.85 },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', lat: 41.87, lng: 12.57 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', lat: 36.20, lng: 138.25 },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', lat: 30.59, lng: 36.24 },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', lat: 48.02, lng: 66.92 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', lat: -0.02, lng: 37.91 },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', lat: 35.91, lng: 127.77 },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', lat: 29.31, lng: 47.48 },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', lat: 33.85, lng: 35.86 },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', lat: 26.33, lng: 17.23 },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', lat: 4.21, lng: 108.96 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', lat: 23.63, lng: -102.55 },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', lat: 31.79, lng: -7.09 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', lat: 52.13, lng: 5.29 },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', lat: -40.90, lng: 174.89 },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', lat: 9.08, lng: 8.68 },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', lat: 60.47, lng: 8.47 },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', lat: 30.38, lng: 69.35 },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', lat: -9.19, lng: -75.02 },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', lat: 12.88, lng: 121.77 },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', lat: 51.92, lng: 19.15 },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', lat: 39.40, lng: -8.22 },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', lat: 25.35, lng: 51.18 },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', lat: 45.94, lng: 24.97 },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', lat: 61.52, lng: 105.32 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', lat: 23.89, lng: 45.08 },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', lat: 14.50, lng: -14.45 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', lat: -30.56, lng: 22.94 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', lat: 40.46, lng: -3.75 },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', lat: 60.13, lng: 18.64 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', lat: 46.82, lng: 8.23 },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', lat: 34.80, lng: 38.99 },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', lat: 23.70, lng: 120.96 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', lat: 15.87, lng: 100.99 },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', lat: 33.89, lng: 9.54 },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', lat: 38.96, lng: 35.24 },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', lat: 48.38, lng: 31.17 },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', lat: 23.42, lng: 53.85 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', lat: 55.38, lng: -3.44 },
  { code: 'US', name: 'United States', flag: '🇺🇸', lat: 37.09, lng: -95.71 },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', lat: 14.06, lng: 108.28 },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', lat: 15.55, lng: 48.52 },
];

// ============================================================
// APP STATE
// ============================================================
const AppState = {
  lang: localStorage.getItem('pz_lang') || 'en',
  theme: localStorage.getItem('pz_theme') || 'dark',
  currentFilter: 'latest',
  currentCategory: '',
  currentCountry: '',
  searchQuery: '',
  uploadModalOpen: false,
  photoModalOpen: false,
  currentPhotoId: null,
};

// ============================================================
// UTILS
// ============================================================
function t(key) {
  return (TRANSLATIONS[AppState.lang] && TRANSLATIONS[AppState.lang][key]) || TRANSLATIONS.en[key] || key;
}

function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

function animateCounter(el, target, duration = 1200) {
  const start = parseInt(el.textContent.replace(/,/g, '')) || 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(AppState.lang === 'ar' ? 'ar-EG' : undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function getCountry(code) {
  return COUNTRIES.find(c => c.code === code) || null;
}

// ============================================================
// THEME
// ============================================================
function applyTheme(theme) {
  AppState.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('pz_theme', theme);
}

function initTheme() {
  applyTheme(AppState.theme);
  document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(AppState.theme === 'dark' ? 'light' : 'dark');
  });
}

// ============================================================
// LANGUAGE / i18n
// ============================================================
function applyLang(lang) {
  AppState.lang = lang;
  localStorage.setItem('pz_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('currentLang').textContent = lang.toUpperCase();

  // Translate all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const txt = t(key);
    if (txt) el.textContent = txt;
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const txt = t(key);
    if (txt) el.placeholder = txt;
  });
}

function initI18n() {
  applyLang(AppState.lang);

  // Nav lang button
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', langDropdown.classList.contains('open'));
  });
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
      applyLang(btn.dataset.lang);
      langDropdown.classList.remove('open');
    });
  });
  document.querySelectorAll('.footer-langs button, [data-lang]').forEach(btn => {
    if (!btn.classList.contains('lang-option')) {
      btn.addEventListener('click', () => {
        if (btn.dataset.lang) applyLang(btn.dataset.lang);
      });
    }
  });
  document.addEventListener('click', () => langDropdown.classList.remove('open'));
}

// ============================================================
// POPULATE COUNTRY DROPDOWNS
// ============================================================
function populateCountries() {
  const selects = ['photoCountry', 'countryFilter'];
  selects.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const isFilter = id === 'countryFilter';
    sel.innerHTML = isFilter
      ? `<option value="">${t('all_countries')}</option>`
      : `<option value="">${t('select_country')}</option>`;
    COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = `${c.flag} ${c.name}`;
      sel.appendChild(opt);
    });
  });
}

// ============================================================
// STATS COUNTERS
// ============================================================
function updateStats() {
  const photos = PeczoStore.getAll();
  const today = new Date().toDateString();
  const todayCount = photos.filter(p => new Date(p.uploadedAt).toDateString() === today).length;
  const countries = new Set(photos.map(p => p.country).filter(Boolean)).size;

  animateCounter(document.getElementById('statPhotos'), photos.length);
  animateCounter(document.getElementById('statCountries'), Math.max(countries, 42));
  animateCounter(document.getElementById('statToday'), todayCount);
  document.getElementById('liveCount').textContent = photos.length.toLocaleString();
}

// ============================================================
// MOBILE MENU
// ============================================================
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-nav a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ============================================================
// MODALS
// ============================================================
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  const firstFocusable = modal.querySelector('button, input, select, textarea');
  if (firstFocusable) setTimeout(() => firstFocusable.focus(), 100);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

function initModals() {
  // Upload modal triggers
  ['openUploadBtn', 'heroUploadBtn', 'emptyUploadBtn', 'fabUpload', 'footerUploadLink'].forEach(id => {
    const el = document.getElementById(id) || document.querySelector(`#${id}`);
    if (el) el.addEventListener('click', (e) => { e.preventDefault(); openModal('uploadModal'); });
  });

  document.getElementById('closeUploadBtn').addEventListener('click', () => closeModal('uploadModal'));
  document.getElementById('closePhotoBtn').addEventListener('click', () => closeModal('photoModal'));
  document.getElementById('closeReportBtn').addEventListener('click', () => closeModal('reportModal'));

  // Close on overlay click
  ['uploadModal', 'photoModal', 'reportModal'].forEach(id => {
    document.getElementById(id).addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal(id);
    });
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['uploadModal', 'photoModal', 'reportModal'].forEach(closeModal);
    }
    if (e.key === 'ArrowLeft') document.getElementById('photoPrev')?.click();
    if (e.key === 'ArrowRight') document.getElementById('photoNext')?.click();
  });
}

// ============================================================
// SHARE PANEL
// ============================================================
function initSharePanel() {
  document.getElementById('photoShareBtn').addEventListener('click', () => {
    const panel = document.getElementById('sharePanel');
    const url = document.getElementById('shareUrl');
    url.value = `https://coub.xyz/photo/${AppState.currentPhotoId}`;
    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');
  });

  document.getElementById('copyShareUrl').addEventListener('click', () => {
    const url = document.getElementById('shareUrl');
    navigator.clipboard?.writeText(url.value).catch(() => {
      url.select();
      document.execCommand('copy');
    });
    showToast(t('copied'), 'success');
  });
}

// ============================================================
// REPORT MODAL
// ============================================================
function initReport() {
  document.getElementById('photoReportBtn').addEventListener('click', () => {
    closeModal('photoModal');
    openModal('reportModal');
  });

  document.getElementById('submitReport').addEventListener('click', () => {
    const reason = document.querySelector('input[name="reportReason"]:checked');
    if (!reason) return;
    ModerationSystem.flagPhoto(AppState.currentPhotoId, reason.value);
    closeModal('reportModal');
    showToast(t('report_submitted'), 'success');
  });
}

// ============================================================
// COMMENTS
// ============================================================
function renderComments(photoId) {
  const comments = PeczoStore.getComments(photoId);
  const list = document.getElementById('commentList');
  if (!comments.length) {
    list.innerHTML = `<p style="font-size:0.8rem;color:var(--clr-text3);text-align:center;padding:12px 0">No comments yet.</p>`;
    return;
  }
  list.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div class="comment-avatar">${(c.author || 'A').charAt(0).toUpperCase()}</div>
      <div class="comment-body">
        <div class="comment-author">${escapeHtml(c.author || 'Anonymous')}</div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
      </div>
    </div>
  `).join('');
}

function initComments() {
  document.getElementById('submitComment').addEventListener('click', () => {
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    if (!text || !AppState.currentPhotoId) return;
    if (ModerationSystem.isSpam(text)) {
      showToast('Comment flagged as spam.', 'error');
      return;
    }
    PeczoStore.addComment(AppState.currentPhotoId, { text, author: 'Anonymous', ts: Date.now() });
    input.value = '';
    renderComments(AppState.currentPhotoId);
    showToast(t('comment_posted'), 'success');
  });
  document.getElementById('commentInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('submitComment').click();
  });
}

// ============================================================
// LIKE
// ============================================================
function initLike() {
  document.getElementById('photoLikeBtn').addEventListener('click', () => {
    if (!AppState.currentPhotoId) return;
    const liked = PeczoStore.toggleLike(AppState.currentPhotoId);
    const btn = document.getElementById('photoLikeBtn');
    const count = document.getElementById('photoLikeCount');
    const photo = PeczoStore.get(AppState.currentPhotoId);
    if (photo) {
      count.textContent = photo.likes;
      btn.classList.toggle('liked', liked);
    }
  });
}

// ============================================================
// OPEN PHOTO DETAIL
// ============================================================
function openPhotoDetail(photoId) {
  const photo = PeczoStore.get(photoId);
  if (!photo) return;

  AppState.currentPhotoId = photoId;
  PeczoStore.incrementView(photoId);

  document.getElementById('photoModalImg').src = photo.dataUrl || photo.url || '';
  document.getElementById('photoModalImg').alt = photo.title || '';
  document.getElementById('photoModalTitle').textContent = photo.title || 'Untitled';
  document.getElementById('photoModalDesc').textContent = photo.description || '';

  // Meta
  const country = getCountry(photo.country);
  document.getElementById('photoModalCountry').textContent = country ? `${country.flag} ${country.name}` : '';
  const cityEl = document.getElementById('photoModalCity');
  cityEl.textContent = photo.city || '';
  cityEl.style.display = photo.city ? '' : 'none';
  document.getElementById('photoModalDate').textContent = formatDate(photo.uploadedAt);

  // Stats
  document.getElementById('photoLikeCount').textContent = photo.likes || 0;
  document.getElementById('photoViewCount').textContent = photo.views || 1;
  const liked = PeczoStore.isLiked(photoId);
  document.getElementById('photoLikeBtn').classList.toggle('liked', liked);

  // Tags
  const tagsEl = document.getElementById('photoModalTags');
  const tags = (photo.tags || []).concat(photo.category ? [photo.category] : []);
  tagsEl.innerHTML = tags.map(tag => `<span class="photo-tag">#${escapeHtml(tag)}</span>`).join('');

  // Comments
  renderComments(photoId);

  // Share panel
  document.getElementById('sharePanel').setAttribute('hidden', '');

  openModal('photoModal');

  // Prev / next
  const all = PeczoStore.getAll();
  const idx = all.findIndex(p => p.id === photoId);
  document.getElementById('photoPrev').onclick = () => {
    if (idx > 0) openPhotoDetail(all[idx - 1].id);
  };
  document.getElementById('photoNext').onclick = () => {
    if (idx < all.length - 1) openPhotoDetail(all[idx + 1].id);
  };
  document.getElementById('photoPrev').disabled = idx === 0;
  document.getElementById('photoNext').disabled = idx === all.length - 1;
}

// ============================================================
// FILTER TABS
// ============================================================
function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      AppState.currentFilter = tab.dataset.filter;
      if (typeof renderGallery === 'function') renderGallery();
    });
  });

  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    AppState.currentCategory = e.target.value;
    if (typeof renderGallery === 'function') renderGallery();
  });

  document.getElementById('countryFilter').addEventListener('change', (e) => {
    AppState.currentCountry = e.target.value;
    if (typeof renderGallery === 'function') renderGallery();
  });
}

// ============================================================
// CATEGORY LINKS IN FOOTER
// ============================================================
function initCategoryLinks() {
  document.querySelectorAll('[data-category]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      AppState.currentCategory = a.dataset.category;
      document.getElementById('categoryFilter').value = AppState.currentCategory;
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
      if (typeof renderGallery === 'function') renderGallery();
    });
  });
}

// ============================================================
// ESCAPE HTML
// ============================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initI18n();
  populateCountries();
  initMobileMenu();
  initModals();
  initSharePanel();
  initReport();
  initComments();
  initLike();
  initFilterTabs();
  initCategoryLinks();

  // Stats with slight delay for drama
  setTimeout(updateStats, 600);

  // Re-run stats when photos change
  document.addEventListener('peczo:photosUpdated', updateStats);

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 10 ? 'var(--clr-border2)' : 'var(--clr-border)';
  });
});

// Export openPhotoDetail for use in gallery.js
window.openPhotoDetail = openPhotoDetail;
window.showToast = showToast;
window.t = t;
window.COUNTRIES = COUNTRIES;
window.AppState = AppState;
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
window.getCountry = getCountry;
