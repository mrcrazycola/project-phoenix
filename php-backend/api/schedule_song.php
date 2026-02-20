<?php
/**
 * API: Schedule a song
 * POST: action=schedule_song, song_name=...
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/websocket.php';

$song_name = $conn->real_escape_string($_POST['song_name']);

try {
    $sqlInsertSchedule = "INSERT INTO schedule_song (name) VALUES ('$song_name')";
    if ($conn->query($sqlInsertSchedule)) {
        echo "Song successfully scheduled!";

        wsSend($websocketURL, ['type' => 'schedule_update']);
    }
} catch (mysqli_sql_exception $e) {
    if ($e->getCode() == 1062) {
        echo "This song is already scheduled!";
    } else {
        echo "Database error: " . $e->getMessage();
    }
}
