# Tier List Maker

A lightweight, generic tier-list maker that runs entirely in the browser.

## Features

- Import one tier list at a time from a simple CSV
- Supports games, films, TV shows, books, albums and other content
- Automatic cover search with source fallbacks
- Drag-and-drop tiers with automatic page scrolling
- Local browser saving
- Add or remove items at any time
- Retry missing covers and repair them manually
- No account, framework or build step required

## CSV format

Your CSV needs exactly these two columns:

```csv
title,type
Dune,film
Dune,book
Dune,game
```

Accepted types:

`game`, `film`, `tv`, `book`, `album`, `other`

Use the exact official title whenever possible. The `type` is important when different media share the same title.

## GitHub Pages / networking

The app is designed as a static GitHub Pages site. It does **not** require PHP, Python, Node.js, a database, or a private API key.

CORS-enabled public APIs are requested directly from the browser where possible. A small public reader fallback is used only for sources that cannot be queried directly from a static browser page (for example some Steam/SteamGridDB searches). If that fallback is unavailable, the rest of the app still works and the item can be repaired manually from the missing-covers panel.

Do not put private API keys in the repository. Services such as TMDB and the official SteamGridDB API require authentication; exposing those credentials in `index.html` would make them public.

GitHub Pages supports static sites but does not run server-side PHP, Ruby or Python. A `.nojekyll` file is included so the modular project can be served directly from the repository root.

## Project structure

- `index.html` — application entry point
- `css/app.css` — application styles
- `js/config.js` — shared configuration and source routing
- `js/matching.js` — title normalization, aliases and confidence scoring
- `js/storage.js` — application state, persistence and cover cache
- `js/cards.js` — card rendering and manual item actions
- `js/drag.js` — pointer-based drag-and-drop and auto-scroll
- `js/covers.js` — cover providers, routing and image validation
- `js/import.js` — CSV parsing and import
- `js/ui.js` — rendering, filtering and UI helpers
- `js/app.js` — startup and event wiring

## Local use

Open `index.html` in a modern browser, or serve the folder from any simple local static web server. The application state is saved in that browser's local storage.

## License

See the repository license for usage and distribution terms.
