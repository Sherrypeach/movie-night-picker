
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
