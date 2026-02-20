<?php
/**
 * API: Rename a song
 * POST: old_name=..., name=...
 */

require_once __DIR__ . '/../config/database.php';

$oldName = $_POST['old_name'];
$newName = $_POST['name'];

$stmt = $conn->prepare("UPDATE song SET name=? WHERE name=?");
$stmt->bind_param("ss", $newName, $oldName);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error";
}
