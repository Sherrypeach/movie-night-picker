// ============================================================
// tmdb.js — all TMDB API fetch functions
// ============================================================

const API_KEY = 'a142757266d6619ea9749c209510a606';
const BASE    = 'https://api.themoviedb.org/3';
const IMG     = 'https://image.tmdb.org/t/p';

// ── Cache helpers ────────────────────────────────────────────
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function cacheGet(key) {
  try {
    const item = localStorage.getItem(`tmdb:${key}`);
    if (!item) return null;
    const { data, ts } = JSON.parse(item);
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(`tmdb:${key}`); return null; }
    return data;
  } catch { return null; }
}

function cacheSet(key, data) {
  try {
    localStorage.setItem(`tmdb:${key}`, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* storage full — skip */ }
}

// ── Core fetch ───────────────────────────────────────────────
async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${BASE}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const cacheKey = url.search;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  const json = await res.json();
  cacheSet(cacheKey, json);
  return json;
}

// ── Public helpers ───────────────────────────────────────────
export function posterUrl(path, size = 'w342') {
  return path ? `${IMG}/${size}${path}` : null;
}

export function backdropUrl(path, size = 'w1280') {
  return path ? `${IMG}/${size}${path}` : null;
}

// ── API functions ─────────────────────────────────────────────

/**
 * Search movies by title query.
 * @param {string} query
 * @param {number} page
 */
export async function searchMovies(query, page = 1) {
  const data = await tmdbFetch('/search/movie', { query, page, include_adult: false });
  return data; // { results, total_results, total_pages, page }
}

/**
 * Discover movies, optionally filtered by genre id.
 * @param {number|null} genreId
 * @param {number} page
 */
export async function discoverMovies(genreId = null, page = 1) {
  const params = { sort_by: 'popularity.desc', page };
  if (genreId) params.with_genres = genreId;
  return tmdbFetch('/discover/movie', params);
}

/**
 * Fetch detailed info for a single movie including credits.
 * @param {number} id
 */
export async function getMovieDetail(id) {
  return tmdbFetch(`/movie/${id}`, { append_to_response: 'credits' });
}

/**
 * Fetch the list of official TMDB genres.
 */
export async function getGenres() {
  const data = await tmdbFetch('/genre/movie/list');
  return data.genres; // [{ id, name }, ...]
}

/**
 * Normalise a raw TMDB movie object to what the app needs.
 */
export function normalise(movie) {
  return {
    id:       movie.id,
    title:    movie.title || movie.original_title,
    year:     movie.release_date ? movie.release_date.slice(0, 4) : '—',
    rating:   movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
    votes:    movie.vote_count ?? 0,
    poster:   posterUrl(movie.poster_path),
    backdrop: backdropUrl(movie.backdrop_path),
    overview: movie.overview || '',
    genreIds: movie.genre_ids || [],
  };
}
