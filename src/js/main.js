// ============================================================
// main.js — app init, search, genre filter, pick for me
// ============================================================

import { searchMovies, discoverMovies, normalise } from './tmdb.js';
import { renderMovies, refreshCardButton }         from './render.js';
import { initGenreFilter }                         from './filter.js';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from './watchlist.js';
import { pickRandom }                              from './picker.js';
import { showToast, updateNavCount, addToHistory, renderHistory } from './ui.js';

// ── DOM refs ──────────────────────────────────────────────────
const searchInput    = document.getElementById('search-input');
const pickBtn        = document.getElementById('pick-btn');
const genreRow       = document.getElementById('genre-row');
const resultsSection = document.getElementById('results-section');
const resultsGrid    = document.getElementById('results-grid');
const resultsHeading = document.getElementById('results-heading');
const resultsCount   = document.getElementById('results-count');
const loadMoreWrap   = document.getElementById('load-more-wrap');
const loadMoreBtn    = document.getElementById('load-more-btn');
const emptyState     = document.getElementById('empty-state');
const historyEl      = document.getElementById('search-history');

// ── State ─────────────────────────────────────────────────────
let currentMovies  = [];
let currentPage    = 1;
let totalPages     = 1;
let activeQuery    = '';
let activeGenreId  = null;
let isLoading      = false;

// ── Init ──────────────────────────────────────────────────────
async function init() {
  updateNavCount();
  renderHistory(historyEl, runSearch);

  await initGenreFilter(genreRow, (genreId) => {
    activeGenreId = genreId;
    activeQuery   = '';
    searchInput.value = '';
    currentPage = 1;
    loadResults(true);
  });

  // Load popular movies on page open
  loadResults(true);
}

// ── Search with debounce ──────────────────────────────────────
let debounceTimer = null;

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    activeQuery = searchInput.value.trim();
    currentPage = 1;
    loadResults(true);
  }, 400);
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    clearTimeout(debounceTimer);
    activeQuery = searchInput.value.trim();
    currentPage = 1;
    loadResults(true);
  }
});

// ── Load results ──────────────────────────────────────────────
async function loadResults(replace = true) {
  if (isLoading) return;
  isLoading = true;
  if (replace) resultsGrid.innerHTML = '<div class="spinner" style="margin:40px auto"></div>';

  try {
    let data;
    if (activeQuery) {
      data = await searchMovies(activeQuery, currentPage);
      if (activeQuery) {
        addToHistory(activeQuery);
        renderHistory(historyEl, runSearch);
      }
    } else {
      data = await discoverMovies(activeGenreId, currentPage);
    }

    const movies = (data.results || []).map(normalise);
    totalPages = data.total_pages ?? 1;

    if (replace) currentMovies = movies;
    else currentMovies = [...currentMovies, ...movies];

    runSearch(); // update heading
    renderMovies(currentMovies, resultsGrid, { replace });

    resultsSection.hidden = false;
    emptyState.hidden = currentMovies.length > 0;
    loadMoreWrap.hidden = currentPage >= totalPages;

    if (!replace) {
      // restore scroll position roughly
    }

  } catch (err) {
    console.error(err);
    showToast('Could not load movies. Check your API key.');
  } finally {
    isLoading = false;
  }
}

function runSearch(query) {
  if (query !== undefined) {
    searchInput.value = query;
    activeQuery = query;
    currentPage = 1;
    loadResults(true);
    return;
  }
  // just update heading
  if (activeQuery) {
    resultsHeading.textContent = `Results for "${activeQuery}"`;
    resultsCount.textContent   = `${currentMovies.length} movies`;
  } else {
    const genreChip = document.querySelector('.genre-chip.active');
    resultsHeading.textContent = genreChip && genreChip.dataset.genreId
      ? genreChip.textContent
      : 'Popular Movies';
    resultsCount.textContent = '';
  }
}

// ── Load More ─────────────────────────────────────────────────
loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  loadResults(false);
  loadMoreWrap.hidden = true;
});

// ── Pick for Me ───────────────────────────────────────────────
pickBtn.addEventListener('click', () => {
  if (currentMovies.length === 0) { showToast('No movies to pick from!'); return; }

  // Spin animation
  pickBtn.classList.add('spinning');
  pickBtn.addEventListener('animationend', () => pickBtn.classList.remove('spinning'), { once: true });

  const picked = pickRandom(currentMovies);
  if (picked) {
    setTimeout(() => {
      window.location.href = `detail.html?id=${picked.id}`;
    }, 700);
  }
});

// ── Card clicks (event delegation) ───────────────────────────
resultsGrid.addEventListener('click', e => {
  // Add/remove watchlist button
  const addBtn = e.target.closest('.card-add-btn');
  if (addBtn) {
    e.stopPropagation();
    const id = Number(addBtn.dataset.id);
    const movie = currentMovies.find(m => m.id === id);
    if (!movie) return;

    if (isInWatchlist(id)) {
      removeFromWatchlist(id);
      showToast(`Removed "${movie.title}" from watchlist`);
    } else {
      addToWatchlist(movie);
      showToast(`Added "${movie.title}" to watchlist`);
    }
    refreshCardButton(id);
    updateNavCount();
    return;
  }

  // Card click → detail page
  const card = e.target.closest('.movie-card');
  if (card) {
    window.location.href = `detail.html?id=${card.dataset.id}`;
  }
});

// ── Start ──────────────────────────────────────────────────────
init();
