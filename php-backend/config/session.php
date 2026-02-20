<?php
/**
 * Session ID handling from query parameter
 */

if (isset($_GET['name'])) {
    $session_id = $_GET['name'];
} else {
    $session_id = null;
}
