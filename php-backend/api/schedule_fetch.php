<?php
/**
 * API: Fetch a scheduled song's content
 * POST: action=fetch_scheduled_song, song_name=...
 */

require_once __DIR__ . '/../config/database.php';

$song_name = $conn->real_escape_string($_POST['song_name']);

$sqlFetch = "SELECT song_tamil FROM song WHERE name = '$song_name'";
$result   = $conn->query($sqlFetch);

if ($result && $result->num_rows > 0) {
    $row  = $result->fetch_assoc();
    $song = $row['song_tamil'] ?? '';
    $song = str_replace("\\n", "\n", $song);
    $lines = preg_split("/\r?\n\s*\r?\n/", $song);
    echo json_encode($lines);
} else {
    echo json_encode(["Song not found."]);
}
