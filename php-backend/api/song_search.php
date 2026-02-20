<?php
/**
 * API: Search songs by name
 * POST: action=search, search_term=...
 */

require_once __DIR__ . '/../config/database.php';

$search_term = $conn->real_escape_string($_POST['search_term']);

$sql = "
    SELECT *,
        CASE
            WHEN SUBSTRING_INDEX(name, ' - ', 1) LIKE '$search_term%' THEN 5
            WHEN SUBSTRING_INDEX(name, ' - ', 1) LIKE '%$search_term%' THEN 4
            WHEN SOUNDEX(SUBSTRING_INDEX(name, ' - ', 1)) = SOUNDEX('$search_term') THEN 3
            WHEN MATCH(name) AGAINST ('$search_term' IN NATURAL LANGUAGE MODE) THEN 2
            ELSE 1
        END AS relevance
    FROM song
    WHERE 
        SUBSTRING_INDEX(name, ' - ', 1) LIKE '%$search_term%'
        OR SOUNDEX(SUBSTRING_INDEX(name, ' - ', 1)) = SOUNDEX('$search_term')
        OR MATCH(name) AGAINST ('$search_term' IN NATURAL LANGUAGE MODE)
    ORDER BY relevance DESC, name ASC
";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $songName = htmlspecialchars($row['name'], ENT_QUOTES);
        echo "
    <li style='position: relative; list-style: none; margin-bottom: 10px;'>
        <button class='scrollButton' onclick=\"getSong('$songName')\">$songName</button>
        <span class='edit-icon' onclick=\"openEditPopup('$songName')\">✎</span>
    </li>";
    }
} else {
    echo "<p>No results found.</p>";
}
