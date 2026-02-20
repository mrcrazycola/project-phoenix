<?php
/**
 * API: Clear a single scheduled song
 * POST: action=clear_scheduled_song, song_name=...
 */

require_once __DIR__ . '/../config/database.php';

$song_name = $_POST['song_name'];

$stmt = $conn->prepare("DELETE FROM `schedule_song` WHERE `name` = ?");
$stmt->bind_param("s", $song_name);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
$stmt->close();
