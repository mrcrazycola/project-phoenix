<?php
/**
 * API: Add a new song by scraping from tamilchristiansongs.in
 * POST: action=add_new_song, new_song_name=<URL>
 */

require_once __DIR__ . '/../config/database.php';

$url  = trim($_POST['new_song_name']);
$host = parse_url($url, PHP_URL_HOST);

if ($host !== 'tamilchristiansongs.in') {
    echo "Unsupported website.";
    exit;
}

function fetchHTML($url)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_USERAGENT      => 'Mozilla/5.0'
    ]);
    $html = curl_exec($ch);
    curl_close($ch);
    return $html;
}

function extractPlainTextFromDiv($xpath, $query)
{
    $nodes = $xpath->query($query);
    if ($nodes->length > 0) {
        $node = $nodes[0];
        $text = '';
        foreach ($node->childNodes as $child) {
            $text .= convertNodeToText($child);
        }
        return trim($text);
    }
    return '';
}

function convertNodeToText($node)
{
    $text = '';
    if ($node->nodeType === XML_TEXT_NODE) {
        $text .= $node->nodeValue;
    } elseif ($node->nodeName === 'br') {
        $text .= "\n";
    } elseif ($node->nodeName === 'p') {
        foreach ($node->childNodes as $child) {
            $text .= convertNodeToText($child);
        }
        $text .= "\n";
    } elseif ($node->hasChildNodes()) {
        foreach ($node->childNodes as $child) {
            $text .= convertNodeToText($child);
        }
    }
    return $text;
}

function getNodeText($xpath, $query)
{
    $nodes = $xpath->query($query);
    return ($nodes->length > 0) ? trim($nodes[0]->textContent) : '';
}

$html = fetchHTML($url);
if (!$html) {
    echo "Failed to fetch HTML content.";
    exit;
}

libxml_use_internal_errors(true);
$doc = new DOMDocument();
$doc->loadHTML($html);
libxml_clear_errors();
$xpath = new DOMXPath($doc);

$name        = getNodeText($xpath, "//h1 | //h2 | //div[@class='entry-title'] | //div[@id='entry-title']");
$songTamil   = extractPlainTextFromDiv($xpath, "//div[@id='tamiltext']");
$songEnglish = extractPlainTextFromDiv($xpath, "//div[@id='roman_tamiltext']");

if (empty($name) || empty($songTamil)) {
    echo "Required song data not found on page.";
    exit;
}

$stmt = $conn->prepare("INSERT INTO song (url, name, song_tamil, song_english) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $url, $name, $songTamil, $songEnglish);
if ($stmt->execute()) {
    echo "Song added successfully!";
} else {
    echo "Database error: " . $stmt->error;
}
