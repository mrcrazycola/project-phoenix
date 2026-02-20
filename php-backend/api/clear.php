<?php
/**
 * API: Clear the presentation display via WebSocket
 * POST: action=clear
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/websocket.php';
require_once __DIR__ . '/../config/session.php';

wsSend($websocketURL, [
    'type'          => 'verse_clear',
    'bookname'      => "",
    'chapternumber' => "",
    'versenumber'   => "",
    'verse'         => "",
    'session_id'    => $session_id
]);
