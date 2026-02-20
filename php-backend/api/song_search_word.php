<?php
/**
 * API: Search songs by English lyrics content
 * POST: action=search_song_word, search_term=...
 */

require_once __DIR__ . '/../config/database.php';

$search_term = $conn->real_escape_string($_POST['search_term']);

$sql = "SELECT * FROM song WHERE song_english LIKE '%$search_term%' ORDER BY name ASC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $search_regex = '/' . preg_quote($search_term, '/') . '/i';

    while ($row = $result->fetch_assoc()) {
        $song_name    = htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8');
        $song_english = $row['song_english'];

        $lines = preg_split("/\r\n|\n|\r/", $song_english);

        $matched_lines = '';
        for ($i = 0; $i < count($lines); $i++) {
            if (stripos($lines[$i], $search_term) !== false) {
                $line = htmlspecialchars($lines[$i], ENT_QUOTES, 'UTF-8');
                $line = preg_replace(
                    $search_regex,
                    '<span style="color:red; font-weight:bold;">$0</span>',
                    $line
                );

                $matched_lines = $line;

                if (isset($lines[$i + 1])) {
                    $next_line = htmlspecialchars($lines[$i + 1], ENT_QUOTES, 'UTF-8');
                    $matched_lines .= "<br>" . $next_line;
                }
                break;
            }
        }

        echo "<li>
            <button class=\"scrollButton\" onclick=\"getSong('$song_name')\">$song_name</button><br>
            <div style=\"margin-left: 10px; font-size: 0.9em; color: #555;\">$matched_lines</div>
        </li>";
    }
} else {
    echo "<p>No results found.</p>";
}
