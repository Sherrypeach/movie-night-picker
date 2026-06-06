// ============================================================
// filter.js — genre chip population and filter logic
// ============================================================

import { getGenres } from './tmdb.js';

let activeGenreId = null;
let onFilterChange = null; // callback(genreId)

/**
 * Load genres from TMDB and render chips into the container.
 * Calls callback(genreId) whenever the active genre changes.
 */
export async function initGenreFilter(container, callback) {
  onFilterChange = callback;
  try {
    const genres = await getGenres();
    renderGenreChips(genres, container);
  } catch (err) {
    console.warn('Could not load genres:', err.message);
  }
}

function renderGenreChips(genres, container) {
  container.innerHTML = '';

  // "All" chip
  const allChip = makeChip('All', null);
  allChip.classList.add('active');
  container.appendChild(allChip);

  genres.forEach(genre => {
    container.appendChild(makeChip(genre.name, genre.id));
  });
}

function makeChip(label, genreId) {
  const btn = document.createElement('button');
  btn.className = 'genre-chip';
  btn.textContent = label;
  btn.dataset.genreId = genreId ?? '';

  btn.addEventListener('click', () => {
    activeGenreId = genreId;

    // Update active state
    document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');

    if (onFilterChange) onFilterChange(genreId);
  });

  return btn;
}

export function getActiveGenreId() {
  return activeGenreId;
}
