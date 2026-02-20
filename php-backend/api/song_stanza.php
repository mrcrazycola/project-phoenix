<?php
/**
 * API: Send a toggled stanza via WebSocket
 * POST: action=stanza, clicked_line=..., song_name=...
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/websocket.php';
require_once __DIR__ . '/../config/session.php';

$clicked_line = $_POST['clicked_line'];
$songname     = $_POST['song_name'];

wsSend($websocketURL, [
    'type'       => 'update_stanza',
    'song'       => $clicked_line,
    'name'       => $songname,
    'session_id' => $session_id
]);

echo "Presenting: " . $clicked_line;
