// ============================================================
// youtube.js — YouTube Data API trailer lookup
// ============================================================

const YT_KEY  = 'YOUR_YOUTUBE_API_KEY_HERE'; // ← replace with your key
const YT_BASE = 'https://www.googleapis.com/youtube/v3';

// ── Cache ────────────────────────────────────────────────────
function cacheGet(key) {
  try {
    const item = localStorage.getItem(`yt:${key}`);
    if (!item) return null;
    const { data, ts } = JSON.parse(item);
    // Cache trailers for 24 hours
    if (Date.now() - ts > 1000 * 60 * 60 * 24) { localStorage.removeItem(`yt:${key}`); return null; }
    return data;
  } catch { return null; }
}

function cacheSet(key, data) {
  try {
    localStorage.setItem(`yt:${key}`, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* storage full — skip */ }
}

/**
 * Search YouTube for an official trailer for a movie.
 * Returns an embed URL or null if not found.
 * @param {string} title  Movie title
 * @param {string} year   Release year (for accuracy)
 */
export async function getTrailerEmbedUrl(title, year) {
  const query = `${title} ${year} official trailer`;
  const cached = cacheGet(query);
  if (cached !== null) return cached;

  const url = new URL(`${YT_BASE}/search`);
  url.searchParams.set('key', YT_KEY);
  url.searchParams.set('q', query);
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '1');
  url.searchParams.set('videoEmbeddable', 'true');

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube ${res.status}`);
    const json = await res.json();
    const videoId = json.items?.[0]?.id?.videoId ?? null;
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    cacheSet(query, embedUrl);
    return embedUrl;
  } catch (err) {
    console.warn('YouTube trailer fetch failed:', err.message);
    return null;
  }
}
