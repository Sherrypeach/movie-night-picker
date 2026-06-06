// ============================================================
// picker.js — random movie selection logic
// ============================================================

/**
 * Pick a random item from an array.
 * Returns null if the array is empty.
 */
export function pickRandom(movies) {
  if (!movies || movies.length === 0) return null;
  const index = Math.floor(Math.random() * movies.length);
  return movies[index];
}
