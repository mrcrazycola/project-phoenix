<?php
/**
 * API: Send a clicked song line to presentation via WebSocket
 * POST: action=click_line, clicked_line=..., name=...
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/websocket.php';
require_once __DIR__ . '/../config/session.php';

$clicked_line = $_POST['clicked_line'];
$songname     = $_POST['name'];

wsSend($websocketURL, [
    'type'       => 'update_song',
    'song'       => $clicked_line,
    'name'       => $songname,
    'session_id' => $session_id
]);

echo "Presenting: " . $clicked_line;
