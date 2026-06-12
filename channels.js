/* channels.js — Coub.xyz v3
   Sources: iptv-org/iptv (MIT License) — free public streams
   Focus: FIFA World Cup 2026 broadcasting channels + top free IPTV
   All streams are free-to-air / public domain / official broadcaster streams.
*/

const CHANNELS = [

  // ══════════════════════════════════════════════════════════
  // 🏆 كأس العالم 2026 — القنوات الناقلة الرسمية المجانية
  // FIFA World Cup 2026 Official Free-to-Air Broadcasters
  // ══════════════════════════════════════════════════════════
  {
    id: "trt1",
    name: "TRT 1",
    category: "Sports",
    country: "Turkey", countryCode: "TR", language: "Turkish",
    logo: "🇹🇷",
    description: "TRT 1 — القناة التركية الرسمية الناقلة لكأس العالم 2026 مجاناً.",
    streamUrl: "https://tv-trt1.medya.trt.com.tr/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: true,
    tags: ["world-cup-2026","football","turkey","free"]
  },
  {
    id: "trt-spor",
    name: "TRT Spor",
    category: "Sports",
    country: "Turkey", countryCode: "TR", language: "Turkish",
    logo: "⚽",
    description: "TRT Spor — القناة الرياضية التركية الرسمية، ناقلة كأس العالم 2026.",
    streamUrl: "https://tv-trtspor1.medya.trt.com.tr/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: true,
    tags: ["world-cup-2026","football","sports","turkey"]
  },
  {
    id: "trt-spor2",
    name: "TRT Spor Yıldız",
    category: "Sports",
    country: "Turkey", countryCode: "TR", language: "Turkish",
    logo: "🌟",
    description: "TRT Spor Yıldız — القناة الثانية لكرة القدم من TRT التركية.",
    streamUrl: "https://tv-trtsporyldzweb.medya.trt.com.tr/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: true,
    tags: ["world-cup-2026","football","turkey"]
  },
  {
    id: "trt-world",
    name: "TRT World",
    category: "News",
    country: "Turkey", countryCode: "TR", language: "English",
    logo: "🌍",
    description: "TRT World — قناة تركية دولية بالإنجليزية، تغطية كأس العالم 2026.",
    streamUrl: "https://tv-trtworld.medya.trt.com.tr/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: true,
    tags: ["world-cup-2026","news","turkey","english"]
  },
  {
    id: "snrt-laayoune",
    name: "SNRT — الرياضية",
    category: "Sports",
    country: "Morocco", countryCode: "MA", language: "Arabic",
    logo: "🇲🇦",
    description: "القناة الرياضية المغربية SNRT — الناقلة الرسمية لكأس العالم 2026 (يُقام بالمغرب).",
    streamUrl: "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/snrt_sport/hls_snrt_csa_sport/index.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: true,
    tags: ["world-cup-2026","football","morocco","arabic"]
  },
  {
    id: "snrt-al-aoula",
    name: "SNRT — الأولى",
    category: "Entertainment",
    country: "Morocco", countryCode: "MA", language: "Arabic",
    logo: "🇲🇦",
    description: "القناة الأولى المغربية SNRT — بث مباشر رسمي مجاني.",
    streamUrl: "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/al_aoula_inter/hls_snrt_csa_ao_inter/index.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: false,
    tags: ["morocco","arabic","entertainment"]
  },
  {
    id: "arryadia",
    name: "Arryadia — الرياضية",
    category: "Sports",
    country: "Morocco", countryCode: "MA", language: "Arabic",
    logo: "⚽",
    description: "قناة الرياضية من المغرب — تغطية كأس العالم 2026 ومباريات مباشرة.",
    streamUrl: "https://cdnamd-hls-globecast.akamaized.net/live/ramdisk/arryadia/hls_snrt_csa_arryadia/index.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: true,
    tags: ["world-cup-2026","football","morocco","arabic"]
  },
  {
    id: "rtbf-la-une",
    name: "RTBF La Une",
    category: "Sports",
    country: "Belgium", countryCode: "BE", language: "French",
    logo: "🇧🇪",
    description: "RTBF La Une — القناة البلجيكية العامة، تنقل كأس العالم 2026 مجاناً.",
    streamUrl: "https://rtbfliveamd.akamaized.net/hls/live/659380/liveStream_LaUne/index.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: true,
    tags: ["world-cup-2026","football","belgium","french"]
  },
  {
    id: "srf-zwei",
    name: "SRF zwei",
    category: "Sports",
    country: "Switzerland", countryCode: "CH", language: "German",
    logo: "🇨🇭",
    description: "SRF zwei — القناة السويسرية الناقلة لكأس العالم 2026 مجاناً.",
    streamUrl: "https://srfaod-vh.akamaihd.net/i/world_1_srf_zwei_hd_,512k,800k,1200k,1600k,2400k,.mp4.csmil/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: true,
    tags: ["world-cup-2026","football","switzerland"]
  },
  {
    id: "ard-das-erste",
    name: "ARD Das Erste",
    category: "Sports",
    country: "Germany", countryCode: "DE", language: "German",
    logo: "🇩🇪",
    description: "ARD Das Erste — القناة الألمانية الأولى العامة، ناقلة كأس العالم 2026.",
    streamUrl: "https://mcdn.daserste.de/daserste/de/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: true,
    tags: ["world-cup-2026","football","germany","public"]
  },
  {
    id: "zdf",
    name: "ZDF",
    category: "Sports",
    country: "Germany", countryCode: "DE", language: "German",
    logo: "🇩🇪",
    description: "ZDF — القناة العامة الألمانية الثانية، شريكة ARD في بث كأس العالم.",
    streamUrl: "https://zdf-hls-live.akamaized.net/hls/live/2016498/zdf/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: true,
    tags: ["world-cup-2026","football","germany","public"]
  },
  {
    id: "france2",
    name: "France 2",
    category: "Sports",
    country: "France", countryCode: "FR", language: "French",
    logo: "🇫🇷",
    description: "France 2 — القناة الفرنسية العامة، تنقل مباريات كأس العالم 2026 مجاناً.",
    streamUrl: "https://simulcast.france.tv/stream/france-2",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: true,
    tags: ["world-cup-2026","football","france","public"]
  },
  {
    id: "rtve-la1",
    name: "RTVE La 1",
    category: "Sports",
    country: "Spain", countryCode: "ES", language: "Spanish",
    logo: "🇪🇸",
    description: "RTVE La 1 — القناة الإسبانية الأولى، ناقلة رسمية لكأس العالم 2026.",
    streamUrl: "https://ztnr.rtve.es/ztnr/1688877.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: true,
    tags: ["world-cup-2026","football","spain","public"]
  },
  {
    id: "rtp1",
    name: "RTP 1",
    category: "Sports",
    country: "Portugal", countryCode: "PT", language: "Portuguese",
    logo: "🇵🇹",
    description: "RTP 1 — القناة البرتغالية العامة، تنقل كأس العالم 2026 مجاناً.",
    streamUrl: "https://streaming-live.rtp.pt/liverepeater/stream8/chunks.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: true,
    tags: ["world-cup-2026","football","portugal","public"]
  },
  {
    id: "rai-uno",
    name: "RAI 1",
    category: "Sports",
    country: "Italy", countryCode: "IT", language: "Italian",
    logo: "🇮🇹",
    description: "RAI 1 — القناة الإيطالية العامة الأولى، ناقلة كأس العالم 2026.",
    streamUrl: "https://creativemedia4.rai.it/Italy/rai1/master_rai1.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: true,
    tags: ["world-cup-2026","football","italy","public"]
  },
  {
    id: "nrk1",
    name: "NRK1",
    category: "Sports",
    country: "Norway", countryCode: "NO", language: "Norwegian",
    logo: "🇳🇴",
    description: "NRK1 — القناة النرويجية العامة، تنقل مباريات كأس العالم 2026.",
    streamUrl: "https://nrk-nrk1-no.akamaized.net/i/nrk1_0@506985/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: true,
    tags: ["world-cup-2026","football","norway"]
  },
  {
    id: "svt1",
    name: "SVT1",
    category: "Sports",
    country: "Sweden", countryCode: "SE", language: "Swedish",
    logo: "🇸🇪",
    description: "SVT1 — القناة السويدية العامة، ناقلة كأس العالم 2026 مجاناً.",
    streamUrl: "https://svtwebsverige-lh.akamaihd.net/i/svtone_0@333416/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: true,
    tags: ["world-cup-2026","football","sweden"]
  },
  {
    id: "al-kass-1",
    name: "Al Kass Sports 1",
    category: "Sports",
    country: "Qatar", countryCode: "QA", language: "Arabic",
    logo: "🏆",
    description: "قناة الكأس الرياضية — الناقلة الرسمية لكأس العالم 2026 في قطر.",
    streamUrl: "https://5e26c45b1f7d5.streamlock.net:1935/alkasslive/alkass1/playlist.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: true,
    tags: ["world-cup-2026","football","qatar","arabic"]
  },
  {
    id: "al-kass-2",
    name: "Al Kass Sports 2",
    category: "Sports",
    country: "Qatar", countryCode: "QA", language: "Arabic",
    logo: "⚽",
    description: "قناة الكأس الرياضية 2 — قناة ثانية لبث مباريات كأس العالم 2026.",
    streamUrl: "https://5e26c45b1f7d5.streamlock.net:1935/alkasslive/alkass2/playlist.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: true,
    tags: ["world-cup-2026","football","qatar","arabic"]
  },

  // ══════════════════════════════════════════════════════════
  // 📰 NEWS — أخبار
  // ══════════════════════════════════════════════════════════
  {
    id: "aljazeera-en",
    name: "Al Jazeera English",
    category: "News",
    country: "Qatar", countryCode: "QA", language: "English",
    logo: "🌍",
    description: "Al Jazeera English — live news from Doha, Qatar, 24/7.",
    streamUrl: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: false,
    tags: ["news","english","qatar","international"]
  },
  {
    id: "aljazeera-ar",
    name: "الجزيرة العربية",
    category: "News",
    country: "Qatar", countryCode: "QA", language: "Arabic",
    logo: "📡",
    description: "قناة الجزيرة — البث المباشر للأخبار العربية والدولية.",
    streamUrl: "https://live-hls-web-ajaz.getaj.net/AJAZ/index.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: false,
    tags: ["news","arabic","qatar","international"]
  },
  {
    id: "dw-en",
    name: "DW News",
    category: "News",
    country: "Germany", countryCode: "DE", language: "English",
    logo: "🇩🇪",
    description: "Deutsche Welle — Germany's international broadcaster, 24/7 news.",
    streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: false,
    tags: ["news","english","germany"]
  },
  {
    id: "france24-ar",
    name: "فرانس 24 عربي",
    category: "News",
    country: "France", countryCode: "FR", language: "Arabic",
    logo: "🇫🇷",
    description: "فرانس 24 — أخبار دولية بالعربية على مدار الساعة.",
    streamUrl: "https://stream.france24.com/hls/live/2037097/F24_AR_HI_HLS/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: false,
    tags: ["news","arabic","france"]
  },
  {
    id: "france24-en",
    name: "France 24 English",
    category: "News",
    country: "France", countryCode: "FR", language: "English",
    logo: "🔵",
    description: "France 24 — French international news channel in English.",
    streamUrl: "https://stream.france24.com/hls/live/2037092/F24_EN_HI_HLS/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: false,
    tags: ["news","english","france"]
  },
  {
    id: "euronews",
    name: "Euronews",
    category: "News",
    country: "Europe", countryCode: "EU", language: "English",
    logo: "🇪🇺",
    description: "Euronews — live European and world news in English.",
    streamUrl: "https://rakuten-euronews-1-eu.samsung.wurl.tv/manifest/playlist.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: false,
    tags: ["news","english","europe"]
  },
  {
    id: "rt-arabic",
    name: "RT Arabic",
    category: "News",
    country: "Russia", countryCode: "RU", language: "Arabic",
    logo: "📻",
    description: "روسيا اليوم بالعربية — أخبار دولية وتحليلات.",
    streamUrl: "https://rt-arab.rttv.com/live/rtarab/playlist.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: false,
    tags: ["news","arabic","russia"]
  },
  {
    id: "rtve-24h",
    name: "RTVE 24h",
    category: "News",
    country: "Spain", countryCode: "ES", language: "Spanish",
    logo: "🇪🇸",
    description: "RTVE Canal 24 Horas — noticias en directo de España y el mundo.",
    streamUrl: "https://ztnr.rtve.es/ztnr/1826237.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: false,
    tags: ["news","spanish","spain"]
  },

  // ══════════════════════════════════════════════════════════
  // 🚀 EDUCATION — تعليم
  // ══════════════════════════════════════════════════════════
  {
    id: "nasa-tv",
    name: "NASA TV",
    category: "Education",
    country: "USA", countryCode: "US", language: "English",
    logo: "🚀",
    description: "Live NASA TV — ISS, rocket launches, and space exploration 24/7.",
    streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: false,
    tags: ["space","science","nasa","usa"]
  },

  // ══════════════════════════════════════════════════════════
  // 🎵 MUSIC — موسيقى
  // ══════════════════════════════════════════════════════════
  {
    id: "mezzo",
    name: "Mezzo Live HD",
    category: "Music",
    country: "France", countryCode: "FR", language: "Instrumental",
    logo: "🎻",
    description: "Mezzo — classical music, jazz concerts and opera live from Europe.",
    streamUrl: "https://stream.mezzo.tv/mezzo_web/index.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: false, isWC2026: false,
    tags: ["classical","jazz","opera","music"]
  },

  // ══════════════════════════════════════════════════════════
  // 🧸 KIDS
  // ══════════════════════════════════════════════════════════
  {
    id: "pbs-kids",
    name: "PBS Kids 24/7",
    category: "Kids",
    country: "USA", countryCode: "US", language: "English",
    logo: "📺",
    description: "PBS Kids — free educational TV for children, 24/7 live stream.",
    streamUrl: "https://d2e1asnsl7br7b.cloudfront.net/7782e20e49034254a448d7f337e09fd9/index.m3u8",
    youtubeId: null,
    isLive: true, isFeatured: true, isWC2026: false,
    tags: ["kids","education","usa","free"]
  }
];

// ══════════════════════════════════════════════════════════
// كأس العالم 2026 — جدول المباريات التقريبي
// ══════════════════════════════════════════════════════════
const MATCH_SCHEDULES = [
  { time: "11 Jun",   match: "🏆 افتتاح كأس العالم 2026",         channel: "TRT1 / SNRT / ARD",        sport: "⚽ WC2026" },
  { time: "11 Jun",   match: "المكسيك 🆚 المضيف (USA)",            channel: "RTVE / TRT Spor",          sport: "⚽ WC2026" },
  { time: "12 Jun",   match: "المغرب 🆚 منافس المجموعة",           channel: "Arryadia / SNRT Sport",    sport: "⚽ WC2026" },
  { time: "13 Jun",   match: "ألمانيا 🆚 منافسها",                 channel: "ARD / ZDF",                sport: "⚽ WC2026" },
  { time: "14 Jun",   match: "إسبانيا 🆚 منافسها",                 channel: "RTVE La 1",                sport: "⚽ WC2026" },
  { time: "15 Jun",   match: "فرنسا 🆚 منافسها",                   channel: "France 2",                 sport: "⚽ WC2026" },
  { time: "16 Jun",   match: "البرتغال 🆚 منافسها",                channel: "RTP 1",                    sport: "⚽ WC2026" },
  { time: "17 Jun",   match: "إيطاليا 🆚 منافسها",                 channel: "RAI 1",                    sport: "⚽ WC2026" },
  { time: "Live",     match: "🔴 تابع أحدث نتائج المجموعات",        channel: "Al Kass 1 & 2",            sport: "⚽ WC2026" },
  { time: "Jul",      match: "دور الـ 16 — ثمن النهائي",           channel: "TRT / France 2 / ARD",     sport: "⚽ WC2026" },
  { time: "Jul",      match: "ربع النهائي",                        channel: "جميع القنوات الناقلة",      sport: "⚽ WC2026" },
  { time: "Jul",      match: "نصف النهائي",                        channel: "جميع القنوات الناقلة",      sport: "⚽ WC2026" },
  { time: "19 Jul",   match: "🏆 نهائي كأس العالم 2026",           channel: "TRT1 / SNRT / ARD / RAI1", sport: "⚽ FINAL" }
];

const CATEGORIES = [
  { id: "All",           emoji: "📺", label: "All Channels" },
  { id: "Sports",        emoji: "🏆", label: "Sports / WC2026" },
  { id: "News",          emoji: "📰", label: "News" },
  { id: "Entertainment", emoji: "🎬", label: "Entertainment" },
  { id: "Kids",          emoji: "🧸", label: "Kids" },
  { id: "Music",         emoji: "🎵", label: "Music" },
  { id: "Education",     emoji: "📚", label: "Education" },
  { id: "Documentary",   emoji: "🌍", label: "Documentary" }
];

// ══════════════════════════════════════════════════════════
// EXTERNAL M3U SOURCE — iptv-org Sports Category (700+ channels)
// Live, auto-updated hourly. Used by the "Browse All Sports" feature.
// ══════════════════════════════════════════════════════════
const EXTERNAL_M3U_SOURCES = {
  sports: {
    name: "iptv-org Sports (700+ channels)",
    url: "https://iptv-org.github.io/iptv/categories/sports.m3u",
    description: "Live-updated global sports playlist, refreshed hourly by iptv-org"
  },
  news: {
    name: "iptv-org News",
    url: "https://iptv-org.github.io/iptv/categories/news.m3u",
    description: "Global news channels"
  },
  movies: {
    name: "iptv-org Movies",
    url: "https://iptv-org.github.io/iptv/categories/movies.m3u",
    description: "Free movie channels"
  }
};
