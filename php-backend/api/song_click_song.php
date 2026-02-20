<?php
/**
 * API: Send full song to worship lead + log to song_history
 * POST: action=click_song, clicked_song=..., name=...
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/websocket.php';
require_once __DIR__ . '/../config/session.php';

$clicked_line = $_POST['clicked_song'];
$songname     = $_POST['name'];

if ($songname !== "Not from DB") {
    $sql = "
        INSERT INTO song_history (songname, timestamp)
        SELECT '$songname', NOW()
        FROM DUAL
        WHERE NOT EXISTS (
            SELECT 1 
            FROM song_history 
            WHERE songname = '$songname' 
            AND DATE(`timestamp`) = CURDATE()
        )";
    $conn->query($sql);
}

wsSend($websocketURL, [
    'type'       => 'update_song_to_lead',
    'song'       => $clicked_line,
    'name'       => $songname,
    'session_id' => $session_id
]);

echo "Success";
