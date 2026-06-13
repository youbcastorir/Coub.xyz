# ◉ Peczo.c.la — The World's Open Photo Album

**Live at [coub.xyz](https://coub.xyz)**

> *"A giant public photo wall for the whole planet."*

Peczo is a free, open, no-account-required photo-sharing platform where anyone on Earth can upload a photo and share it with the world instantly. Think of it as humanity's shared visual diary — a mix of early-internet image boards, modern social feeds, and a global postcard wall.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📸 Instant Upload | Drag, drop, paste, or click — no account needed |
| 🌍 Global Photo Wall | Masonry gallery with Latest / Trending / Random / Most Viewed |
| 🗺️ World Map | Interactive Leaflet map showing upload origins |
| 🔍 Live Search | Real-time keyword, tag, country, and category search |
| 🏷️ 10 Categories | Travel, Nature, Cities, Art, Animals, Sports, Food, Tech, Architecture, History |
| ❤️ Likes & Comments | No login required |
| 🚩 Moderation | Report button, spam detection, rate limiting, auto-hide |
| 🌐 4 Languages | English, Arabic (RTL), French, Spanish |
| 🌙 Dark / Light Mode | Persistent theme preference |
| 📱 PWA | Installable, mobile-first, offline-ready |
| 🔗 Share | One-click copy link for every photo |
| ⚡ Performance | Lazy loading, image compression, IntersectionObserver |

---

## 🗂️ Project Structure

```
coub/
├── index.html        # Main HTML — structure, modals, SEO meta
├── style.css         # Full design system (CSS variables, dark/light, RTL)
├── app.js            # Core app: i18n, theme, modals, stats, routing
├── gallery.js        # Storage layer (localStorage) + gallery/categories/trending/map
├── upload.js         # Drag-and-drop upload, compression, validation
├── search.js         # Live search overlay, scoring, filtering
├── moderation.js     # Spam detection, rate limiting, report system, content flags
├── manifest.json     # PWA manifest
├── sitemap.xml       # SEO sitemap (homepage, categories, countries)
├── robots.txt        # Search engine instructions
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Option 1 — Open directly in browser
```bash
# Just open index.html in any modern browser
open index.html
```
No server needed. All data is stored in the browser's `localStorage`.

### Option 2 — Local dev server
```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .

# VS Code: use Live Server extension
```
Then visit `http://localhost:8080`

---

## 🌐 GitHub Pages Deployment

### Step 1 — Initialize repository
```bash
git init
git add .
git commit -m "Launch Coub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/coub.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages
1. Go to your repo on GitHub
2. **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / `/ (root)`
5. Click **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/coub/`

### Step 3 — Custom domain (coub.xyz)
1. In GitHub Pages settings, add your custom domain: `coub.xyz`
2. Create a `CNAME` file in your repo root:
   ```
   coub.xyz
   ```
3. At your DNS provider, add:
   ```
   A     @    185.199.108.153
   A     @    185.199.109.153
   A     @    185.199.110.153
   A     @    185.199.111.153
   CNAME www  YOUR_USERNAME.github.io
   ```
4. Enable "Enforce HTTPS" in GitHub Pages settings

---

## 💾 Storage Integration Guide

The default setup uses **`localStorage`** — data lives in the visitor's browser. To make photos truly persistent and shared between users, integrate one of these:

### Option A — Firebase Firestore + Storage (Recommended)
```javascript
// In gallery.js, replace PeczoStore.add() with:
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadString } from 'firebase/storage';

async function uploadToFirebase(photo) {
  // Upload image to Storage
  const imgRef = ref(storage, `photos/${photo.id}.jpg`);
  await uploadString(imgRef, photo.dataUrl, 'data_url');
  const url = await getDownloadURL(imgRef);

  // Save metadata to Firestore
  await addDoc(collection(db, 'photos'), { ...photo, url, dataUrl: null });
}
```

### Option B — Supabase (Postgres + Storage)
```javascript
const { data, error } = await supabase.storage
  .from('photos')
  .upload(`${photo.id}.jpg`, file);

await supabase.from('photos').insert({ ...meta, url: data.path });
```

### Option C — Cloudinary (Image CDN)
```javascript
const form = new FormData();
form.append('file', dataUrl);
form.append('upload_preset', 'peczo_unsigned');

const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD/image/upload', {
  method: 'POST', body: form
});
const { secure_url } = await res.json();
```

### Option D — GitHub Issues as a backend (zero-cost hack)
Use GitHub Issues API to store photo metadata (title, tags, country) and link to Cloudinary/imgBB for the actual image. Works for low-traffic sites.

---

## 🛡️ Moderation Guide

### Built-in tools (moderation.js)

| Tool | Details |
|---|---|
| **Rate limiting** | Max 15 uploads/hour, 5 comments/minute per browser |
| **Spam detection** | Regex patterns for URLs, repeated chars, ALL CAPS, banned words |
| **Report system** | 5 reports = auto-hide; stored in localStorage |
| **Image validation** | Type + size check before processing |
| **Text sanitization** | HTML stripping, XSS prevention |

### Extending moderation

**Add banned words:**
```javascript
// In moderation.js
MOD_CONFIG.bannedWords.push('yourword', 'anotherword');
```

**Add spam pattern:**
```javascript
MOD_CONFIG.spamPatterns.push(/your_pattern/i);
```

**Lower auto-hide threshold:**
```javascript
MOD_CONFIG.autoHideReportThreshold = 3; // 3 reports = hide
```

### For production moderation
- Integrate [Perspective API](https://perspectiveapi.com) (free) for AI toxicity scoring
- Add [hCaptcha](https://hcaptcha.com) on upload form
- Set up a simple admin endpoint to review flagged photos
- Email alerts: send report notifications to `salatrir@gmail.com` via EmailJS or Formspree

---

## 🔍 SEO Guide

### What's already included
- `<title>`, `<meta description>`, `<meta keywords>`
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Card (`summary_large_image`)
- `schema.org/WebSite` with `SearchAction` (enables Google Sitelinks search)
- `schema.org/ImageGallery`
- `hreflang` tags for EN/AR/FR/ES
- `sitemap.xml` covering homepage, all categories, top countries
- `robots.txt` with bot allow/block rules
- Canonical URL tag
- Mobile-first, fast-loading (lazy images, minimal JS)

### Recommended next steps
1. **Submit sitemap** to Google Search Console: `https://coub.xyz/sitemap.xml`
2. **Generate an og-image** (1200×630px) and host at `https://coub.xyz/og-image.jpg`
3. **Add per-photo URLs** (e.g., `/photo/pz_abc123`) for individual photo indexing
4. **Structured data for photos**: add `schema.org/ImageObject` to each photo page
5. **Create a blog** (e.g., "Best Travel Photos This Week") to attract long-tail traffic

### Target keywords already optimized
- photo sharing
- public photo album
- image gallery
- free image upload
- global photo community
- online photo gallery
- share photos free

---

## 📧 Contact

**Email:** [salatrir@gmail.com](mailto:salatrir@gmail.com)

For support, moderation requests, partnership inquiries, or to report abuse, email us directly. We respond within 48 hours.

---

## 📄 License

This project is released under the **MIT License**. You are free to fork, modify, and deploy it. All photos uploaded to the platform remain the property of their original creators.

---

## 🌍 About Peczo

> *Coub.xyz is an open global photo album where people from all countries can share moments, memories, creativity, and everyday life.*

We believe that photography is the most universal language. Every photo is a window into someone's world. Peczo exists to keep that window open — free, borderless, and without friction.

**No account. No algorithm. No ads. Just the world.**

---

*Built with ◉ by the Peczo team · [coub.xyz](https://coub.xyz) · salatrir@gmail.com*
