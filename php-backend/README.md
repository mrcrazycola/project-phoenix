# PHP Backend — Refactored Structure

This is the split version of the original monolithic `index.php`.

## Directory Structure

```
php-backend/
├── index.php                    # Main entry point (skeleton HTML)
├── config/
│   ├── auth.php                 # WebView + IP access control
│   ├── database.php             # MySQL connection ($conn)
│   ├── session.php              # Session ID from ?name= query param
│   └── websocket.php            # WebSocket config + wsSend() helper
├── api/
│   ├── router.php               # Routes $_POST['action'] → handler files
│   ├── clear.php                # Clear presentation display
│   ├── current_song.php         # Get current song from WS server
│   ├── history_song.php         # Fetch today's song history
│   ├── history_verse.php        # Fetch today's verse history
│   ├── schedule_clear.php       # Clear entire song schedule
│   ├── schedule_clear_one.php   # Remove single scheduled song
│   ├── schedule_fetch.php       # Fetch scheduled song content
│   ├── schedule_options.php     # Get schedule dropdown options
│   ├── schedule_song.php        # Add song to schedule
│   ├── song_add.php             # Add new song manually
│   ├── song_add_url.php         # Scrape & add song from URL
│   ├── song_click_line.php      # Present clicked line via WS
│   ├── song_click_song.php      # Send full song to lead + history
│   ├── song_delete.php          # Delete a song
│   ├── song_get.php             # Fetch song stanzas
│   ├── song_rename.php          # Rename a song
│   ├── song_save.php            # Save edited song
│   ├── song_search.php          # Search songs by name
│   ├── song_search_word.php     # Search songs by English lyrics
│   ├── song_stanza.php          # Toggle stanza via WS
│   ├── sthothira_baligal.php    # Sthothira Baligal operations
│   └── verse_display.php        # All verse operations
└── assets/
    ├── css/
    │   └── main.css             # All styles (from original <style> block)
    └── js/
        ├── tabs.js              # Tab switching logic
        ├── websocket.js         # WebSocket connection + handlers
        ├── songs.js             # Song search, display, edit, CRUD
        ├── verse.js             # Verse display, navigation, history
        ├── media.js             # File browser, upload, image/video
        ├── sthothira.js         # Sthothira Baligal UI logic
        ├── utils.js             # Snackbar, helpers
        └── bible-data.js        # bookChapterLimits, verseCountMapping
```

## Constraint Followed
- NO variable names changed
- NO database column references changed
- NO SQL queries modified
- Only the "skin" and "structure" changed, the "engine" is identical

## Deployment
Copy this entire folder to your LAMP server, replacing the old index.php.
Ensure `vendor/`, `jquery-3.6.0.min.js`, `css/all.min.css`, etc. remain alongside.
