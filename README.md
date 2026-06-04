# 📺 Coub.xyz — Live TV Reels

> A mobile-first, TikTok-style live TV discovery platform for free-to-air channels worldwide.

**Contact:** salatrir@gmail.com  
**Live demo:** https://coub.xyz  
**License:** MIT

---

## 🚀 Features

- **Reels-style feed** — full-screen vertical live TV cards with swipe-up/down navigation
- **500+ free channels** across News, Sports, Entertainment, Kids, Music, Education, Documentary
- **Sports Hub** — dedicated sports section with live channels and match schedules
- **Search engine** — search by channel name, category, country, or language
- **Favorites** — save channels and view recently watched history (localStorage)
- **Channel pages** — dedicated page per channel with live status, share, and save
- **Multi-language** — English, Arabic (RTL), French, Spanish
- **PWA-ready** — installable on mobile home screen
- **SEO-optimized** — Open Graph, Twitter Cards, schema.org VideoObject + MediaGallery
- **Dark mode** — full dark UI with TikTok-inspired aesthetic

---

## 📁 File Structure

```
coub-xyz/
├── index.html        # Main SPA shell with all views
├── style.css         # Complete responsive dark-mode CSS
├── app.js            # Main app logic, state, navigation, i18n
├── channels.js       # Channel catalog (free-to-air sources only)
├── search.js         # Search engine module
├── manifest.json     # PWA web app manifest
├── sitemap.xml       # SEO sitemap with VideoObject entries
├── robots.txt        # Search engine crawler directives
├── README.md         # This file
└── icons/
    ├── icon-192.png  # PWA icon (create with any icon tool)
    └── icon-512.png  # PWA icon large
```

---

## 🌐 GitHub Pages Deployment

### Step 1 — Create a GitHub repository
```bash
git init
git add .
git commit -m "Initial Coub.xyz commit"
git remote add origin https://github.com/YOUR_USERNAME/coub-xyz.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `root`
4. Click **Save**

Your site will be live at `https://YOUR_USERNAME.github.io/coub-xyz/`

### Step 3 — Custom domain (optional)
Add a `CNAME` file with `coub.xyz` to the repo root, then configure your DNS:
```
A     @     185.199.108.153
A     @     185.199.109.153
CNAME www   YOUR_USERNAME.github.io
```

---

## 📡 Stream Source Management

All streams in `channels.js` are:
- ✅ Free-to-air official broadcasts
- ✅ Public broadcaster streams (PBS, ABC AU, BBC, RTVE, etc.)
- ✅ Official embeds (Al Jazeera, DW, France 24, NASA TV)
- ✅ Free ad-supported platforms (Pluto TV, Plex)
- ❌ NO unauthorized paid TV access
- ❌ NO pirated or copyright-infringing streams

### Adding a new channel

Edit `channels.js` and add an entry to the `CHANNELS` array:

```js
{
  id: "unique-channel-id",          // URL-safe unique ID
  name: "Channel Name",             // Display name
  category: "News",                 // One of: News, Sports, Entertainment, Kids, Music, Education, Documentary
  country: "Country Name",          // Full country name
  countryCode: "XX",                // ISO 3166-1 alpha-2
  language: "English",              // Primary language
  logo: "📺",                       // Emoji or image URL
  description: "Short description.",
  streamUrl: "https://...",         // HLS/M3U8 direct stream URL (optional)
  embedUrl: "https://...",          // Official embed or watch page URL
  website: "https://...",           // Official broadcaster website
  isLive: true,                     // Is this currently live?
  isFeatured: false,                // Show in featured section?
  tags: ["news", "english"]         // Search tags
}
```

### Removing a broken stream
1. Find the channel by `id` in `channels.js`
2. Either update the `streamUrl`/`embedUrl` or delete the entry
3. Commit and push — GitHub Pages auto-deploys

---

## 🔍 SEO Guide

### Open Graph & Twitter Cards
Already included in `index.html`. Update these meta tags:
```html
<meta property="og:image" content="https://coub.xyz/og-image.jpg" />
<meta property="og:url" content="https://coub.xyz/" />
<meta name="twitter:site" content="@coubxyz" />
```

Create `og-image.jpg` (1200×630px) with your branding.

### schema.org VideoObject
Each channel page dynamically injects a `VideoObject` schema when a user opens it, boosting Google video indexing.

### sitemap.xml
Update `sitemap.xml` with your domain. Submit to:
- Google Search Console: `https://search.google.com/search-console`
- Bing Webmaster Tools: `https://www.bing.com/webmasters`

### robots.txt
Already configured. Update the `Sitemap:` URL if using a custom domain.

---

## 💰 Monetization

The premium UI in `/view-premium` supports:
- **Premium membership** — upgrade flow UI (connect to Stripe/Paddle)
- **Featured channels** — set `isFeatured: true` in `channels.js`
- **Sponsored placements** — add `isSponsored: true` flag and custom card styling
- **Donations** — connect the "Donate" button to Ko-fi, Buy Me a Coffee, or PayPal

---

## 🌍 Multi-Language

Translations are in `app.js` under the `I18N` object. To add a new language:

```js
I18N.de = {
  live_feed: "Live-Feed",
  channels: "Kanäle",
  // ... etc
};
```

Then add a button in the language picker UI in `index.html`.

---

## 📱 PWA Icons

Generate icons using [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator) or [RealFaviconGenerator](https://realfavicongenerator.net/):

```bash
npx pwa-asset-generator logo.svg icons/
```

Place the output in an `icons/` folder in the project root.

---

## ⚡ Performance Tips

- All JS is vanilla — no frameworks, no build step
- CSS uses `scroll-snap` for native GPU-accelerated swipe
- `IntersectionObserver` for lazy loading reel cards
- `localStorage` for instant favorites/history with no server
- HLS streams use browser-native video (or hls.js for broader support)
- Category filtering is pure in-memory — zero network requests

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 📬 Contact

**Email:** salatrir@gmail.com  
**Website:** https://coub.xyz

Submit stream additions, bug reports, or partnership inquiries to the email above.
