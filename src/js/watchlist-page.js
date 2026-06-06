// ============================================================
// watchlist-page.js — watchlist page logic
// ============================================================

import { getWatchlist, removeFromWatchlist, toggleWatched } from './watchlist.js';
import { showToast, updateNavCount }                        from './ui.js';
import { pickRandom }                                       from './picker.js';

const grid        = document.getElementById('watchlist-grid');
const emptyState  = document.getElementById('watchlist-empty');
const sortSelect  = document.getElementById('watchlist-sort');
const pickBtn     = document.getElementById('watchlist-pick-btn');

function init() {
  updateNavCount();
  render();
}

function getSorted() {
  const list = getWatchlist();
  const sort = sortSelect.value;
  if (sort === 'rating')   return [...list].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  if (sort === 'title')    return [...list].sort((a, b) => a.title.localeCompare(b.title));
  return list; // 'added' — already newest first
}

function render() {
  const list = getSorted();
  grid.innerHTML = '';

  if (list.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  list.forEach((movie, i) => {
    const card = document.createElement('article');
    card.className = `movie-card${movie.watched ? ' watched' : ''}`;
    card.dataset.id = movie.id;
    card.style.setProperty('--i', i);

    card.innerHTML = `
      <div class="card-poster-wrap">
        ${movie.poster
          ? `<img class="card-poster" src="${movie.poster}" alt="${movie.title}" loading="lazy" />`
          : `<div class="card-no-poster">🎬</div>`
        }
        <span class="rating-badge">${movie.rating}</span>
      </div>
      <div class="card-body">
        <p class="card-title">${movie.title}</p>
        <span class="card-year">${movie.year}</span>
        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
          <button class="btn-secondary" style="font-size:0.75rem;padding:4px 10px" data-action="watched">
            ${movie.watched ? '↩ Unwatch' : '✓ Mark watched'}
          </button>
          <button class="btn-secondary" style="font-size:0.75rem;padding:4px 10px;color:var(--accent)" data-action="remove">
            Remove
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ── Events ────────────────────────────────────────────────────
sortSelect.addEventListener('change', render);

grid.addEventListener('click', e => {
  const actionBtn = e.target.closest('[data-action]');
  if (actionBtn) {
    e.stopPropagation();
    const card = actionBtn.closest('.movie-card');
    const id   = Number(card.dataset.id);
    if (actionBtn.dataset.action === 'remove') {
      const list = getWatchlist();
      const movie = list.find(m => m.id === id);
      removeFromWatchlist(id);
      showToast(`Removed "${movie?.title ?? 'movie'}" from watchlist`);
      updateNavCount();
      render();
    } else if (actionBtn.dataset.action === 'watched') {
      toggleWatched(id);
      render();
    }
    return;
  }

  const card = e.target.closest('.movie-card');
  if (card) window.location.href = `detail.html?id=${card.dataset.id}`;
});

pickBtn.addEventListener('click', () => {
  const unwatched = getWatchlist().filter(m => !m.watched);
  const pool      = unwatched.length > 0 ? unwatched : getWatchlist();
  const picked    = pickRandom(pool);
  if (!picked) { showToast('Watchlist is empty!'); return; }
  showToast(`Picked: ${picked.title}!`);
  setTimeout(() => { window.location.href = `detail.html?id=${picked.id}`; }, 800);
});

init();
