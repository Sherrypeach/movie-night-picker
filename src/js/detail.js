// ============================================================
// detail.js — movie detail page logic
// ============================================================

import { getMovieDetail, posterUrl, backdropUrl } from './tmdb.js';
import { getTrailerEmbedUrl }                      from './youtube.js';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from './watchlist.js';
import { showToast, updateNavCount }               from './ui.js';

// ── DOM refs ──────────────────────────────────────────────────
const loadingEl      = document.getElementById('detail-loading');
const detailWrap     = document.getElementById('detail-wrap');
const backdropEl     = document.getElementById('detail-backdrop');
const posterEl       = document.getElementById('detail-poster');
const titleEl        = document.getElementById('detail-title');
const yearEl         = document.getElementById('detail-year');
const runtimeEl      = document.getElementById('detail-runtime');
const ratingEl       = document.getElementById('detail-rating');
const genresEl       = document.getElementById('detail-genres');
const overviewEl     = document.getElementById('detail-overview');
const castEl         = document.getElementById('cast-list');
const watchlistBtn   = document.getElementById('detail-watchlist-btn');
const trailerSection = document.getElementById('trailer-section');
const trailerIframe  = document.getElementById('trailer-iframe');

// ── Init ──────────────────────────────────────────────────────
async function init() {
  updateNavCount();

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  if (!id) { window.location.href = 'index.html'; return; }

  try {
    const movie = await getMovieDetail(id);
    renderDetail(movie);

    // Load trailer in background (doesn't block rendering)
    getTrailerEmbedUrl(movie.title, movie.release_date?.slice(0,4) ?? '').then(url => {
      if (url) {
        trailerIframe.src = url;
        trailerSection.hidden = false;
      }
    });

  } catch (err) {
    console.error(err);
    loadingEl.innerHTML = '<p style="color:var(--muted);text-align:center;padding:40px">Could not load movie. Check your API key.</p>';
  }
}

// ── Render ────────────────────────────────────────────────────
function renderDetail(movie) {
  document.title = `${movie.title} – Movie Night Picker`;

  // Backdrop
  const backdrop = backdropUrl(movie.backdrop_path);
  if (backdrop) {
    backdropEl.style.backgroundImage = `url(${backdrop})`;
  }

  // Poster
  const poster = posterUrl(movie.poster_path, 'w500');
  if (poster) {
    posterEl.src = poster;
    posterEl.alt = `${movie.title} poster`;
  } else {
    posterEl.style.display = 'none';
  }

  // Meta
  titleEl.textContent  = movie.title;
  yearEl.textContent   = movie.release_date?.slice(0, 4) ?? '';
  runtimeEl.textContent = movie.runtime ? `${movie.runtime} min` : '';
  ratingEl.textContent = movie.vote_average ? `★ ${movie.vote_average.toFixed(1)}` : '';

  // Genres
  (movie.genres ?? []).forEach(g => {
    const tag = document.createElement('span');
    tag.className = 'genre-tag';
    tag.textContent = g.name;
    genresEl.appendChild(tag);
  });

  // Overview
  overviewEl.textContent = movie.overview || 'No overview available.';

  // Cast (top 8)
  const cast = movie.credits?.cast?.slice(0, 8) ?? [];
  cast.forEach(person => {
    const chip = document.createElement('span');
    chip.className = 'cast-chip';
    chip.textContent = person.name;
    castEl.appendChild(chip);
  });

  // Watchlist button
  updateWatchlistBtn(movie.id);
  watchlistBtn.addEventListener('click', () => {
    const mini = {
      id:      movie.id,
      title:   movie.title,
      year:    movie.release_date?.slice(0,4) ?? '—',
      poster:  posterUrl(movie.poster_path),
      rating:  movie.vote_average?.toFixed(1) ?? 'N/A',
    };
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
      showToast(`Removed "${movie.title}" from watchlist`);
    } else {
      addToWatchlist(mini);
      showToast(`Added "${movie.title}" to watchlist`);
    }
    updateWatchlistBtn(movie.id);
    updateNavCount();
  });

  // Show
  loadingEl.hidden  = true;
  detailWrap.hidden = false;
}

function updateWatchlistBtn(id) {
  const inList = isInWatchlist(id);
  watchlistBtn.textContent = inList ? '✓ In Watchlist' : '+ Add to Watchlist';
  watchlistBtn.classList.toggle('in-watchlist', inList);
}

init();
