/* m3u-parser.js — Coub.xyz
   Client-side M3U/M3U8 playlist parser + live channel browser.
   Fetches external playlists (e.g. iptv-org sports.m3u, 700+ channels)
   directly in the user's browser at runtime.
*/

const M3UParser = (() => {

  // ── PARSE M3U TEXT INTO CHANNEL OBJECTS ──────────────────
  function parse(text) {
    const lines = text.split(/\r?\n/);
    const channels = [];
    let current = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('#EXTINF')) {
        // Extract attributes
        const nameMatch  = line.match(/,(.+)$/);
        const logoMatch  = line.match(/tvg-logo="([^"]*)"/);
        const groupMatch = line.match(/group-title="([^"]*)"/);
        const idMatch    = line.match(/tvg-id="([^"]*)"/);
        const countryMatch = line.match(/tvg-country="([^"]*)"/);
        const langMatch  = line.match(/tvg-language="([^"]*)"/);

        current = {
          name: nameMatch ? nameMatch[1].trim() : 'Unknown Channel',
          logo: logoMatch ? logoMatch[1] : '',
          group: groupMatch ? groupMatch[1] : 'Sports',
          tvgId: idMatch ? idMatch[1] : '',
          country: countryMatch ? countryMatch[1] : '',
          language: langMatch ? langMatch[1] : '',
        };
      } else if (line.startsWith('#EXTVLCOPT') || line.startsWith('#')) {
        // Skip other metadata lines
        continue;
      } else if (line.startsWith('http')) {
        if (current) {
          current.url = line;
          channels.push(current);
          current = null;
        }
      }
    }
    return channels;
  }

  // ── FETCH + PARSE EXTERNAL PLAYLIST ───────────────────────
  async function fetchPlaylist(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return parse(text);
  }

  // ── QUICK STREAM HEALTH CHECK ─────────────────────────────
  // Attempts a HEAD/GET request to verify the stream URL responds.
  // Note: many IPTV streams block HEAD or CORS — this is best-effort.
  async function checkStream(url, timeoutMs = 4000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { method: 'GET', signal: controller.signal, mode: 'cors' });
      clearTimeout(timer);
      return res.ok || res.status === 0; // status 0 = opaque (no-cors) but reachable
    } catch (e) {
      clearTimeout(timer);
      return false;
    }
  }

  return { parse, fetchPlaylist, checkStream };
})();
