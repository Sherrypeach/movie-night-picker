# Movie Night Picker

A web app for browsing movies, filtering by genre, saving a personal watchlist, and picking a random movie when no one can agree.

**Live site:** <!-- add your GitHub Pages or Render URL here -->

**Trello Board:** https://trello.com/b/759tVjNg/sleep-outside

---

## Setup

### 1. Get API Keys

**TMDB (The Movie Database)**
1. Create a free account at https://www.themoviedb.org/
2. Go to Settings → API → Request an API key
3. Copy your **API Key (v3 auth)**

**YouTube Data API**
1. Go to https://console.developers.google.com/
2. Create a new project → Enable "YouTube Data API v3"
3. Create credentials → API Key

### 2. Add Your Keys

Open `src/js/tmdb.js` and replace:
```js
const API_KEY = 'YOUR_TMDB_API_KEY_HERE';
```

Open `src/js/youtube.js` and replace:
```js
const YT_KEY = 'YOUR_YOUTUBE_API_KEY_HERE';
```

### 3. Run Locally

Because the app uses ES Modules (`type="module"`), you need a local server — you cannot just open `index.html` directly in a browser.

**Option A — VS Code Live Server**
Install the Live Server extension, right-click `index.html` → Open with Live Server.

**Option B — Python**
```bash
python -m http.server 5500
```
Then open http://localhost:5500

### 4. Deploy to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to repo Settings → Pages
3. Source: **Deploy from branch** → `main` → `/ (root)`
4. Your live URL will be `https://yourusername.github.io/movie-night-picker/`

---

## File Structure

```
movie-night-picker/
├── index.html          ← Search / home page
├── detail.html         ← Single movie detail page
├── watchlist.html      ← Saved movies page
├── README.md
└── src/
    ├── css/
    │   ├── style.css       ← Global styles + theme
    │   └── animations.css  ← Keyframe animations
    └── js/
        ├── main.js         ← Search page logic
        ├── detail.js       ← Detail page logic
        ├── watchlist-page.js ← Watchlist page logic
        ├── tmdb.js         ← TMDB API fetch functions
        ├── youtube.js      ← YouTube trailer fetch
        ├── watchlist.js    ← localStorage watchlist CRUD
        ├── render.js       ← DOM rendering (movie cards)
        ├── filter.js       ← Genre chip filter
        ├── picker.js       ← Random movie selection
        └── ui.js           ← Toast, history, nav count
```

---

## Features

- Search movies by title with debounced input
- Browse by genre (chips populated from TMDB)
- Movie detail page with trailer embed (YouTube)
- Personal watchlist saved in localStorage
- Random "Pick for Me" button
- Search history chips
- Fully responsive (mobile → desktop)
- CSS animations and card hover effects
