<?php
/**
 * API: Delete a song
 * POST: action=delete_song, song_name=...
 */

require_once __DIR__ . '/../config/database.php';

$song_name = $conn->real_escape_string($_POST['song_name']);

$sql = "DELETE FROM song WHERE name = '$song_name'";

if ($conn->query($sql) === TRUE) {
    echo "Song deleted successfully.";
} else {
    echo "Error deleting song: " . $conn->error;
}
