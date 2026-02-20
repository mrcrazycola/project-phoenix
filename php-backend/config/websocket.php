<?php
/**
 * WebSocket configuration and helper
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Ratchet\Client\Connector;
use Ratchet\Client\WebSocket;
use React\EventLoop\Factory;

$server_ip    = $_SERVER['SERVER_ADDR'];
$websocketURL = "ws://{$server_ip}:8080";

/**
 * Send a message via WebSocket
 *
 * @param string $websocketURL
 * @param array  $payload  The JSON-encodable message array
 */
function wsSend($websocketURL, array $payload)
{
    $loop      = Factory::create();
    $connector = new Connector($loop);

    $connector($websocketURL)
        ->then(function (WebSocket $conn) use ($loop, $payload) {
            $conn->on('message', function ($msg) {
                // optional: log acknowledgments
            });
            $conn->send(json_encode($payload));
            $conn->close();
        }, function ($e) {
            echo "Could not connect: {$e->getMessage()}\n";
        });

    $loop->run();
}
