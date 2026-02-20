<?php
/**
 * API: Clear entire song schedule
 * POST: action=clear-schedule
 */

require_once __DIR__ . '/../config/database.php';

$sql = "DELETE FROM `schedule_song`";
if ($conn->query($sql)) {
    echo "Schedule cleared!";
} else {
    echo "Error clearing schedule: " . $conn->error;
}
