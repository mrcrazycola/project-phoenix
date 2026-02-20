<?php
/**
 * API: Get current song from WebSocket server
 * POST: action=getCurrentSongreq
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/websocket.php';
require_once __DIR__ . '/../config/session.php';

use Ratchet\Client\Connector;
use Ratchet\Client\WebSocket;
use React\EventLoop\Factory;

$loop      = Factory::create();
$connector = new Connector($loop);

$connector($websocketURL)->then(
    function (WebSocket $conn) use ($session_id) {
        $conn->on('message', function ($msg) use ($conn) {
            $data = json_decode($msg, true);
            if ($data['type'] === 'currentSongResponse') {
                echo json_encode([
                    'status'     => 'success',
                    'song'       => $data['current_song'],
                    'session_id' => $data['session_id']
                ]);
                $conn->close();
            }
        });

        $conn->send(json_encode([
            'type'       => 'getCurrentSong',
            'session_id' => $session_id
        ]));
    },
    function ($e) {
        echo json_encode([
            'status'  => 'error',
            'message' => "Could not connect: {$e->getMessage()}"
        ]);
    }
);

$loop->run();
