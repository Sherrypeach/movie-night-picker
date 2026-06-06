// ============================================================
// watchlist.js — add/remove/read watchlist from localStorage
// ============================================================

const KEY = 'mnp-watchlist';

/**
 * Read the full watchlist array from localStorage.
 * @returns {Array}
 */
export function getWatchlist() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveWatchlist(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

/**
 * Check if a movie is already in the watchlist.
 */
export function isInWatchlist(movieId) {
  return getWatchlist().some(m => m.id === movieId);
}

/**
 * Add a normalised movie object to the watchlist.
 * Stores only essential fields to keep localStorage small.
 */
export function addToWatchlist(movie) {
  const list = getWatchlist();
  if (list.some(m => m.id === movie.id)) return; // already saved
  list.unshift({
    id:      movie.id,
    title:   movie.title,
    year:    movie.year,
    poster:  movie.poster,
    rating:  movie.rating,
    watched: false,
    addedAt: Date.now(),
  });
  saveWatchlist(list);
}

/**
 * Remove a movie from the watchlist by id.
 */
export function removeFromWatchlist(movieId) {
  saveWatchlist(getWatchlist().filter(m => m.id !== movieId));
}

/**
 * Toggle the watched/unwatched state of a movie.
 */
export function toggleWatched(movieId) {
  const list = getWatchlist().map(m =>
    m.id === movieId ? { ...m, watched: !m.watched } : m
  );
  saveWatchlist(list);
}

/**
 * Return count of movies in the watchlist.
 */
export function watchlistCount() {
  return getWatchlist().length;
}
