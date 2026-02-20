<?php
/**
 * API: Sthothira Baligal — display, previous, next
 * POST: action=display-sthothira-button|previous-sthothira-button|next-sthothira-button, value=...
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/websocket.php';
require_once __DIR__ . '/../config/session.php';

$bali_value = $_POST['value'];
$action     = $_POST['action'];

if ($action === 'previous-sthothira-button') {
    $bali_value--;
} elseif ($action === 'next-sthothira-button') {
    $bali_value++;
}

if ($bali_value >= 1001) $bali_value = 1;
if ($bali_value <= 0)    $bali_value = 1;

$bali_select   = "SELECT sthothira_baligal_list FROM sthothira_baligal WHERE id = $bali_value";
$bali_result   = mysqli_query($conn, $bali_select);
$bali_row      = mysqli_fetch_assoc($bali_result);
$bali_sentence = isset($bali_row['sthothira_baligal_list']) ? $bali_row['sthothira_baligal_list'] : 'Value out of range';

wsSend($websocketURL, [
    'type'       => 'update_song',
    'song'       => $bali_sentence,
    'name'       => "Sothothira Bali",
    'session_id' => $session_id
]);

echo json_encode(["newValue" => $bali_value]);
