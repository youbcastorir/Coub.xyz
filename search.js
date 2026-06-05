/* search.js — Coub.xyz Search Engine
   Handles channel search by name, category, country, language, and tags.
*/

const CoubSearch = (() => {

  // ── NORMALIZE ─────────────────────────────────────────────
  function normalize(str) {
    return String(str || '').toLowerCase().trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // ── SCORE RELEVANCE ───────────────────────────────────────
  function score(channel, query) {
    const q = normalize(query);
    if (!q) return 0;
    let points = 0;

    if (normalize(channel.name).includes(q))        points += 10;
    if (normalize(channel.name).startsWith(q))      points += 5;
    if (normalize(channel.category).includes(q))    points += 6;
    if (normalize(channel.country).includes(q))     points += 4;
    if (normalize(channel.language).includes(q))    points += 4;
    if (normalize(channel.description).includes(q)) points += 2;
    if (channel.tags && channel.tags.some(t => normalize(t).includes(q))) points += 3;
    if (channel.isLive) points += 1;
    if (channel.isFeatured) points += 2;

    return points;
  }

  // ── SEARCH ────────────────────────────────────────────────
  function search(query, filterCategory = 'all') {
    let results = CHANNELS.map(ch => ({ ...ch, _score: score(ch, query) }));

    // Apply category filter
    if (filterCategory && filterCategory !== 'all') {
      results = results.filter(ch => ch.category === filterCategory);
    }

    // Filter out zero-score when there's a query
    if (query.trim()) {
      results = results.filter(ch => ch._score > 0);
    }

    // Sort by score desc, then alphabetically
    results.sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return a.name.localeCompare(b.name);
    });

    return results;
  }

  // ── FILTER BY CATEGORY ────────────────────────────────────
  function filterByCategory(category) {
    if (!category || category === 'All') return [...CHANNELS];
    return CHANNELS.filter(ch => ch.category === category);
  }

  // ── FILTER BY COUNTRY ─────────────────────────────────────
  function filterByCountry(country) {
    const c = normalize(country);
    return CHANNELS.filter(ch => normalize(ch.country).includes(c) || normalize(ch.countryCode).includes(c));
  }

  // ── FILTER BY LANGUAGE ────────────────────────────────────
  function filterByLanguage(lang) {
    const l = normalize(lang);
    return CHANNELS.filter(ch => normalize(ch.language).includes(l));
  }

  // ── GET UNIQUE VALUES ─────────────────────────────────────
  function getCountries() {
    return [...new Set(CHANNELS.map(ch => ch.country))].sort();
  }

  function getLanguages() {
    return [...new Set(CHANNELS.map(ch => ch.language))].sort();
  }

  function getCategories() {
    return [...new Set(CHANNELS.map(ch => ch.category))].sort();
  }

  // ── GET BY ID ─────────────────────────────────────────────
  function getById(id) {
    return CHANNELS.find(ch => ch.id === id) || null;
  }

  // ── GET FEATURED ──────────────────────────────────────────
  function getFeatured() {
    return CHANNELS.filter(ch => ch.isFeatured);
  }

  // ── GET LIVE ──────────────────────────────────────────────
  function getLive() {
    return CHANNELS.filter(ch => ch.isLive);
  }

  // ── LIVE SEARCH (debounced) ───────────────────────────────
  let _debounceTimer = null;
  function liveSearch(query, filterCategory, callback, delay = 220) {
    clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(() => {
      callback(search(query, filterCategory));
    }, delay);
  }

  // ── PUBLIC API ────────────────────────────────────────────
  return {
    search,
    liveSearch,
    filterByCategory,
    filterByCountry,
    filterByLanguage,
    getCountries,
    getLanguages,
    getCategories,
    getById,
    getFeatured,
    getLive
  };

})();
