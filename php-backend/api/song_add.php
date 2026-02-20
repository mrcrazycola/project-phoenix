<?php
/**
 * API: Add a new song manually
 * POST: action=save_new_song, new_song_name, new_song_content, new_song_english, new_song_URL
 */

require_once __DIR__ . '/../config/database.php';

$new_song_name    = $conn->real_escape_string($_POST['new_song_name']);
$new_song_content = $conn->real_escape_string($_POST['new_song_content']);
$song_english     = $conn->real_escape_string($_POST['new_song_english']);
$song_URL         = $conn->real_escape_string($_POST['new_song_URL']);

$sqlInsert = "INSERT INTO song (name, song_tamil, song_english, url) VALUES ('$new_song_name', '$new_song_content', '$song_english', '$song_URL')";
if ($conn->query($sqlInsert)) {
    echo "New song added successfully!";
} else {
    echo "Error adding the new song: " . $conn->error;
}
