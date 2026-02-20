<?php
/**
 * API Router — maps $_POST['action'] to the correct handler file.
 * Include this from index.php to handle all AJAX requests before rendering HTML.
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') return;

$action = isset($_POST['action']) ? $_POST['action'] : null;

// Non-action POST handlers
if (isset($_POST['fetchHistory'])) {
    require __DIR__ . '/history_verse.php';
    exit;
}
if (isset($_POST['fetchSongHistorycall'])) {
    require __DIR__ . '/history_song.php';
    exit;
}
if (isset($_POST['old_name'], $_POST['name']) && !$action) {
    require __DIR__ . '/song_rename.php';
    exit;
}

if (!$action) return;

$routes = [
    'clear'                      => 'clear.php',
    'search'                     => 'song_search.php',
    'search_song_word'           => 'song_search_word.php',
    'get_song'                   => 'song_get.php',
    'click_line'                 => 'song_click_line.php',
    'click_song'                 => 'song_click_song.php',
    'stanza'                     => 'song_stanza.php',
    'save_edited_song'           => 'song_save.php',
    'save_new_song'              => 'song_add.php',
    'add_new_song'               => 'song_add_url.php',
    'delete_song'                => 'song_delete.php',
    'schedule_song'              => 'schedule_song.php',
    'fetch_scheduled_song'       => 'schedule_fetch.php',
    'fetch_options'              => 'schedule_options.php',
    'clear-schedule'             => 'schedule_clear.php',
    'clear_scheduled_song'       => 'schedule_clear_one.php',
    'getCurrentSongreq'          => 'current_song.php',
    'display-sthothira-button'   => 'sthothira_baligal.php',
    'previous-sthothira-button'  => 'sthothira_baligal.php',
    'next-sthothira-button'      => 'sthothira_baligal.php',
    // Verse actions
    'display'       => 'verse_display.php',
    'next'          => 'verse_display.php',
    'previous'      => 'verse_display.php',
    'higlitbut'     => 'verse_display.php',
    'history'       => 'verse_display.php',
    'scheduleverse' => 'verse_display.php',
    'searchChapter' => 'verse_display.php',
    'clearverse'    => 'verse_display.php',
    'searchword'    => 'verse_display.php',
    'previewVerse'  => 'verse_display.php',
];

if (isset($routes[$action])) {
    require __DIR__ . '/' . $routes[$action];
    exit;
}
