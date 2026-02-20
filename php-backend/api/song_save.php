<?php
/**
 * API: Save edited song
 * POST: action=save_edited_song, song_name=..., edited_song=...
 */

require_once __DIR__ . '/../config/database.php';

$song_name   = $conn->real_escape_string($_POST['song_name']);
$edited_song = $conn->real_escape_string($_POST['edited_song']);

$sqlUpdate = "UPDATE song SET song_tamil = '$edited_song' WHERE name = '$song_name'";
if ($conn->query($sqlUpdate)) {
    echo "Song updated successfully!";
} else {
    echo "Error updating the song: " . $conn->error;
}
