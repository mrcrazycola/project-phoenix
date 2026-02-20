<?php
/**
 * API: Fetch today's song history
 * POST: fetchSongHistorycall=true
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

date_default_timezone_set('Asia/Kolkata');
$todayDate = date('Y-m-d');

$sql = "SELECT `songname`, `timestamp` 
        FROM `song_history` 
        WHERE DATE(`timestamp`) = '$todayDate' 
        ORDER BY `timestamp` DESC";

$result  = $conn->query($sql);
$history = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $history[] = [
            'songName'  => $row['songname'],
            'timestamp' => $row['timestamp']
        ];
    }
    echo json_encode($history);
} else {
    echo json_encode(["message" => "No history found for today"]);
}
