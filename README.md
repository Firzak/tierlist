# Tier List Maker

A simple, lightweight web app for creating one tier list at a time from a CSV file.

## Features

- Import a CSV list of items
- Supports games, movies, TV shows, books, albums, and other content
- Automatically searches for covers/posters when possible
- Retry missing cover searches
- Manually replace a missing cover with an image file or URL
- Drag and drop items into S, A, B, C, and D tiers
- Add items manually with the + card
- Remove items with the trash button
- Automatically saves the current tier list in your browser
- Importing a new CSV replaces the current tier list

## CSV format

The CSV must contain exactly these two required columns:

```csv
 title,type
 Dune,film
 Dune,book
 The Last of Us,game
 The Last of Us,tv
```

Supported types:

- `game`
- `film`
- `tv`
- `book`
- `album`
- `other`

Use the exact official title whenever possible. Keep capitalization, spaces, punctuation, accents, numbers, subtitles, and other characters accurate. For ambiguous titles, the `type` column tells the app which kind of content to search for.

For best cover matching, it is a good idea to have an AI or another reliable source check your list before importing it.

## Usage

1. Open the site.
2. Click **Import Tier List**.
3. Select your CSV file.
4. The app creates the cards and starts searching for covers.
5. Drag the cards into the tiers.
6. Your work is saved automatically in your browser.

Importing another CSV replaces the current tier list after confirmation.

## Privacy

No account is required. The current tier list is stored locally in your browser.
