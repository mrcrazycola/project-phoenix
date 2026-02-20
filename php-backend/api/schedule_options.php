<?php
/**
 * API: Fetch schedule dropdown options
 * POST: action=fetch_options
 */

require_once __DIR__ . '/../config/database.php';

$sql = $conn->prepare("SELECT name FROM schedule_song");
$sql->execute();
$result  = $sql->get_result();
$options = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $options[] = ['name' => $row['name']];
    }
}
echo json_encode($options);
