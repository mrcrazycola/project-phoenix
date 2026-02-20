<?php
/**
 * API: Fetch today's verse history
 * POST: fetchHistory=true
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

date_default_timezone_set('Asia/Kolkata');
$todayDate = date('Y-m-d');

$sql = "SELECT `bookname`, `booknum`, `chapnum`, `versenum`, `timestamp` 
        FROM `verse_history` 
        WHERE DATE(`timestamp`) = '$todayDate' 
        ORDER BY `timestamp` DESC";

$result  = $conn->query($sql);
$history = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $history[] = [
            'bookName'  => $row['bookname'],
            'bookNum'   => $row['booknum'],
            'chNum'     => $row['chapnum'],
            'verseNum'  => $row['versenum'],
            'timestamp' => $row['timestamp']
        ];
    }
    echo json_encode($history);
} else {
    echo json_encode(["message" => "No history found for today"]);
}
