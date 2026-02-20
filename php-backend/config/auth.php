<?php
/**
 * Access control — WebView + allowed desktop IPs
 */

$ua = $_SERVER['HTTP_USER_AGENT'];
$ip = $_SERVER['REMOTE_ADDR'];

$allowedDesktopIPs = [
    "192.168.29.170",
    "192.168.29.100",
    "192.168.29.2"
];

if (strpos($ua, "wv") === false && !in_array($ip, $allowedDesktopIPs, true)) {
    die("Access allowed only through the official app for the connection stability.");
}
