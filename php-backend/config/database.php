<?php
/**
 * Database connection configuration
 * All DB credentials and connection logic live here.
 */

$host     = "localhost";
$username = "root";
$password = "";
$dbname   = "tamilbible";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
mb_internal_encoding("UTF-8");
