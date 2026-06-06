// ============================================================
// render.js — DOM rendering functions
// ============================================================

import { isInWatchlist } from './watchlist.js';

/**
 * Build a movie card element.
 * @param {Object} movie  Normalised movie object
 * @param {number} index  Card index for stagger animation
 * @returns {HTMLElement}
 */
export function createMovieCard(movie, index = 0) {
  const card = document.createElement('article');
  card.className = 'movie-card';
  card.dataset.id = movie.id;
  card.style.setProperty('--i', index);

  const inList = isInWatchlist(movie.id);

  card.innerHTML = `
    <div class="card-poster-wrap">
      ${movie.poster
        ? `<img class="card-poster" src="${movie.poster}" alt="${escapeHtml(movie.title)} poster" loading="lazy" />`
        : `<div class="card-no-poster">🎬</div>`
      }
      <span class="rating-badge">${movie.rating}</span>
      <button
        class="card-add-btn ${inList ? 'in-watchlist' : ''}"
        data-id="${movie.id}"
        title="${inList ? 'Remove from watchlist' : 'Add to watchlist'}"
        aria-label="${inList ? 'Remove from watchlist' : 'Add to watchlist'}"
      >${inList ? '✓' : '+'}</button>
    </div>
    <div class="card-body">
      <p class="card-title">${escapeHtml(movie.title)}</p>
      <span class="card-year">${movie.year}</span>
    </div>
  `;

  return card;
}

/**
 * Render a list of movies into a grid container.
 * Clears existing cards if replace=true, otherwise appends.
 */
export function renderMovies(movies, container, { replace = true } = {}) {
  if (replace) container.innerHTML = '';
  const offset = replace ? 0 : container.children.length;
  movies.forEach((movie, i) => {
    container.appendChild(createMovieCard(movie, offset + i));
  });
}

/**
 * Update a card's add-button to reflect current watchlist state.
 */
export function refreshCardButton(movieId) {
  const btn = document.querySelector(`.card-add-btn[data-id="${movieId}"]`);
  if (!btn) return;
  const inList = isInWatchlist(movieId);
  btn.textContent = inList ? '✓' : '+';
  btn.title = inList ? 'Remove from watchlist' : 'Add to watchlist';
  btn.classList.toggle('in-watchlist', inList);
}

// ── Utility ──────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
