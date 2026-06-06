// ============================================================
// ui.js — shared UI helpers
// ============================================================

import { watchlistCount } from './watchlist.js';

// ── Toast ────────────────────────────────────────────────────
let toastTimer = null;

export function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── Watchlist count badge ────────────────────────────────────
export function updateNavCount() {
  document.querySelectorAll('#nav-watchlist-count').forEach(el => {
    const count = watchlistCount();
    el.textContent = count;
    el.dataset.count = count;
  });
}

// ── Search history chips ─────────────────────────────────────
const HISTORY_KEY = 'mnp-history';
const MAX_HISTORY = 8;

export function addToHistory(query) {
  query = query.trim();
  if (!query) return;
  let history = getHistory().filter(q => q !== query);
  history.unshift(query);
  if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch { /* ignore */ }
}

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? []; } catch { return []; }
}

/**
 * Render search history chips.
 * onChipClick(query) is called when a chip is clicked.
 */
export function renderHistory(container, onChipClick) {
  const history = getHistory();
  container.innerHTML = '';
  history.forEach(query => {
    const chip = document.createElement('button');
    chip.className = 'history-chip';
    chip.textContent = query;
    chip.addEventListener('click', () => onChipClick(query));
    container.appendChild(chip);
  });
}
