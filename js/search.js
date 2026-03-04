/**
 * TC MARKET SHOP - Search & Filter
 */

'use strict';

/* ── Search products with debounce ──────────────────────────── */
const debouncedSearch = TCUtils.debounce((query, onResults) => {
  const results = TCProducts.searchProducts(query);
  onResults(results);
}, 250);

/* ── Filter products ────────────────────────────────────────── */
function filterProducts({ query = '', category = '', minPrice = 0, maxPrice = Infinity, minRating = 0, sort = 'relevance', storeId = '' } = {}) {
  return TCProducts.searchProducts(query, { category, minPrice, maxPrice, minRating, sort, storeId });
}

/* ── Search stores ──────────────────────────────────────────── */
function searchStores(query) {
  const q = query.toLowerCase();
  return TCStore.getAllStores().filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q)
  );
}

/* ── Get URL search params as object ────────────────────────── */
function getSearchParams() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(params.entries());
}

/* ── Build query string ─────────────────────────────────────── */
function buildQueryString(params) {
  return '?' + new URLSearchParams(params).toString();
}

/* ── Navigate to explore with query ────────────────────────── */
function searchRedirect(query) {
  window.location.href = 'explore.html?q=' + encodeURIComponent(query);
}

window.TCSearch = { debouncedSearch, filterProducts, searchStores, getSearchParams, buildQueryString, searchRedirect };
