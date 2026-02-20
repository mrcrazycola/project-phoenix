<?php
/**
 * API: Verse operations — display, next, previous, highlight, history, schedule, chapter, search, preview, clear
 * POST: action=display|next|previous|higlitbut|history|scheduleverse|searchChapter|clearverse|searchword|previewVerse
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/websocket.php';
require_once __DIR__ . '/../config/session.php';

header('Content-Type: application/json');

$action    = $_POST['action'];
$bookNum   = isset($_POST['bookNum']) ? intval($_POST['bookNum']) : "";
$chNum     = isset($_POST['chNum']) ? intval($_POST['chNum']) : "";
$verseNum  = isset($_POST['verseNum']) ? intval($_POST['verseNum']) : "";
$higlit    = isset($_POST['higlit']) ? $_POST['higlit'] : '';
$searchWord = isset($_POST['searchWord']) ? $_POST['searchWord'] : '';

// ---- Helper functions ----

function getLastVerseInChapter($conn, $bookNum, $chNum)
{
    $query  = "SELECT MAX(verseNum) as lastVerse FROM words WHERE bookNum = $bookNum AND chNum = $chNum";
    $result = mysqli_query($conn, $query);
    $row    = mysqli_fetch_assoc($result);
    return isset($row['lastVerse']) ? intval($row['lastVerse']) : 1;
}

function getLastChapterInBook($conn, $bookNum)
{
    $query  = "SELECT MAX(chNum) as lastChapter FROM words WHERE bookNum = $bookNum";
    $result = mysqli_query($conn, $query);
    $row    = mysqli_fetch_assoc($result);
    return isset($row['lastChapter']) ? intval($row['lastChapter']) : 1;
}

function verseupdate($conn, $bookNum, $chNum, $verseNum, $websocketURL, $session_id, $previous = false)
{
    global $verse, $book;

    $maxBooks   = 66;
    $foundVerse = false;

    while (!$foundVerse) {
        $select_verse = "SELECT word, page_no FROM words WHERE bookNum = $bookNum AND chNum = $chNum AND verseNum = $verseNum";
        $result_verse = mysqli_query($conn, $select_verse);
        $verse_row    = mysqli_fetch_assoc($result_verse);

        if ($verse_row) {
            $verse   = $verse_row['word'];
            $page_no = $verse_row['page_no'];
            $foundVerse = true;
        } else {
            if ($previous) {
                $verseNum--;
                if ($verseNum < 1) {
                    $chNum--;
                    if ($chNum < 1) {
                        $bookNum--;
                        if ($bookNum < 1) $bookNum = $maxBooks;
                        $chNum = getLastChapterInBook($conn, $bookNum);
                    }
                    $verseNum = getLastVerseInChapter($conn, $bookNum, $chNum);
                }
            } else {
                $verseNum++;
                if ($verseNum > getLastVerseInChapter($conn, $bookNum, $chNum)) {
                    $chNum++;
                    $verseNum = 1;
                    if ($chNum > getLastChapterInBook($conn, $bookNum)) {
                        $chNum = 1;
                        $bookNum++;
                        if ($bookNum > $maxBooks) $bookNum = 1;
                    }
                }
            }
        }
    }

    $select_book = "SELECT bookName FROM words WHERE bookNum = $bookNum LIMIT 1";
    $result_book = mysqli_query($conn, $select_book);
    $book_row    = mysqli_fetch_assoc($result_book);
    $book        = isset($book_row['bookName']) ? $book_row['bookName'] : 'Book not found';

    $connector = new \Ratchet\Client\Connector();
    $connector($websocketURL)
        ->then(function (\Ratchet\Client\WebSocket $conn) use ($book, $chNum, $verseNum, $verse, $session_id, $page_no) {
            $conn->on('message', function ($msg) {});
            $conn->send(json_encode([
                'type'          => 'update_verse',
                'bookname'      => $book,
                'chapternumber' => $chNum,
                'versenumber'   => $verseNum,
                'verse'         => $verse,
                'session_id'    => $session_id,
                'page_no'       => $page_no
            ]));
            $conn->close();
        }, function ($e) {});

    return [$bookNum, $chNum, $verseNum, $verse];
}

function versehigupdate($conn, $bookNum, $chNum, $verseNum, $higlit, $websocketURL, $session_id)
{
    global $verse, $book;

    $select_verse = "SELECT word, page_no FROM words WHERE bookNum = $bookNum AND chNum = $chNum AND verseNum = $verseNum";
    $result_verse = mysqli_query($conn, $select_verse);
    $verse_row    = mysqli_fetch_assoc($result_verse);
    $verse   = isset($verse_row['word']) ? $verse_row['word'] : 'Verse not found';
    $page_no = isset($verse_row['page_no']) ? $verse_row['page_no'] : null;

    $select_book = "SELECT bookName FROM words WHERE bookNum = $bookNum LIMIT 1";
    $result_book = mysqli_query($conn, $select_book);
    $book_row    = mysqli_fetch_assoc($result_book);
    $book        = isset($book_row['bookName']) ? $book_row['bookName'] : 'Book not found';

    $highlighted_verse = str_replace($higlit, '<span class="highlight">' . $higlit . '</span>', $verse);

    $connector = new \Ratchet\Client\Connector();
    $connector($websocketURL)
        ->then(function (\Ratchet\Client\WebSocket $conn) use ($book, $chNum, $verseNum, $highlighted_verse, $session_id, $page_no) {
            $conn->on('message', function ($msg) {});
            $conn->send(json_encode([
                'type'          => 'update_verse',
                'bookname'      => $book,
                'chapternumber' => $chNum,
                'versenumber'   => $verseNum,
                'verse'         => $highlighted_verse,
                'session_id'    => $session_id,
                'page_no'       => $page_no
            ]));
            $conn->close();
        }, function ($e) {});
}

function history($conn, $book, $bookNum, $chNum, $verseNum)
{
    date_default_timezone_set('Asia/Kolkata');
    $timestamp = date('Y-m-d H:i:s');
    $stmt = $conn->prepare("INSERT INTO verse_history (bookname, booknum, chapnum, versenum, timestamp) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("siiis", $book, $bookNum, $chNum, $verseNum, $timestamp);
    $stmt->execute();
    $stmt->close();
}

function addtoschedule($conn, $bookNum, $chNum, $verseNum)
{
    global $verse, $book;

    $select_verse = "SELECT word FROM words WHERE bookNum = $bookNum AND chNum = $chNum AND verseNum = $verseNum";
    $result_verse = mysqli_query($conn, $select_verse);
    $verse_row    = mysqli_fetch_assoc($result_verse);
    $verse        = isset($verse_row['word']) ? $verse_row['word'] : 'Verse not found';

    $select_book = "SELECT bookName FROM words WHERE bookNum = $bookNum LIMIT 1";
    $result_book = mysqli_query($conn, $select_book);
    $book_row    = mysqli_fetch_assoc($result_book);
    $book        = isset($book_row['bookName']) ? $book_row['bookName'] : 'Book not found';

    $stmt = $conn->prepare("INSERT INTO schedule (booknum, bookname, chapternumber, versenumber) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isis", $bookNum, $book, $chNum, $verseNum);
    $stmt->execute();
    $stmt->close();
}

function searchVerse($conn, $searchWord)
{
    $search_query = "SELECT bookName, bookNum, chNum, verseNum, word FROM words WHERE word LIKE '%$searchWord%'";
    $result       = mysqli_query($conn, $search_query);

    $output = "";
    if (mysqli_num_rows($result) > 0) {
        $output .= "<div style='padding: 20px;'><h3>Search Results for '$searchWord':</h3>";
        while ($row = mysqli_fetch_assoc($result)) {
            $book         = $row['bookName'];
            $bookNum      = $row['bookNum'];
            $chapter      = $row['chNum'];
            $verse_number = $row['verseNum'];
            $verse_text   = $row['word'];
            $output .= "<h4>$book $chapter : $verse_number</h4>";
            $output .= "<p onclick='showVerse($bookNum, $chapter, $verse_number)'>$verse_text</p>";
        }
        $output .= "</div>";
    } else {
        $output .= "<p>No verses found containing the word '$searchWord'.</p>";
    }
    echo json_encode(['searchResults' => $output]);
}

function displayChapter($conn, $bookNum, $chNum)
{
    $query  = "SELECT verseNum, word FROM words WHERE bookNum = $bookNum AND chNum = $chNum ORDER BY verseNum";
    $result = mysqli_query($conn, $query);

    $bookQuery  = "SELECT bookName FROM words WHERE bookNum = $bookNum LIMIT 1";
    $bookResult = mysqli_query($conn, $bookQuery);
    $book       = mysqli_fetch_assoc($bookResult);

    if (mysqli_num_rows($result) > 0) {
        $nextQuery  = "SELECT MIN(chNum) AS nextCh FROM words WHERE bookNum = $bookNum AND chNum > $chNum";
        $nextResult = mysqli_query($conn, $nextQuery);
        $nextRow    = mysqli_fetch_assoc($nextResult);
        $nextBook   = $bookNum;
        $nextCh     = $nextRow['nextCh'];

        if (!$nextCh) {
            $nextBookQuery = "SELECT MIN(bookNum) AS nextBook FROM words WHERE bookNum > $bookNum";
            $nbResult      = mysqli_query($conn, $nextBookQuery);
            $nbRow         = mysqli_fetch_assoc($nbResult);
            if ($nbRow['nextBook']) {
                $nextBook    = $nbRow['nextBook'];
                $nextChQuery = "SELECT MIN(chNum) AS firstCh FROM words WHERE bookNum = $nextBook";
                $ncResult    = mysqli_query($conn, $nextChQuery);
                $ncRow       = mysqli_fetch_assoc($ncResult);
                $nextCh      = $ncRow['firstCh'];
            } else {
                $wrapBookQuery = "SELECT MIN(bookNum) AS firstBook FROM words";
                $wbResult      = mysqli_query($conn, $wrapBookQuery);
                $wbRow         = mysqli_fetch_assoc($wbResult);
                $nextBook      = $wbRow['firstBook'];
                $wrapChQuery   = "SELECT MIN(chNum) AS firstCh FROM words WHERE bookNum = $nextBook";
                $wcResult      = mysqli_query($conn, $wrapChQuery);
                $wcRow         = mysqli_fetch_assoc($wcResult);
                $nextCh        = $wcRow['firstCh'];
            }
        }

        $prevQuery  = "SELECT MAX(chNum) AS prevCh FROM words WHERE bookNum = $bookNum AND chNum < $chNum";
        $prevResult = mysqli_query($conn, $prevQuery);
        $prevRow    = mysqli_fetch_assoc($prevResult);
        $prevBook   = $bookNum;
        $prevCh     = $prevRow['prevCh'];

        if (!$prevCh) {
            $prevBookQuery = "SELECT MAX(bookNum) AS prevBook FROM words WHERE bookNum < $bookNum";
            $pbResult      = mysqli_query($conn, $prevBookQuery);
            $pbRow         = mysqli_fetch_assoc($pbResult);
            if ($pbRow['prevBook']) {
                $prevBook    = $pbRow['prevBook'];
                $prevChQuery = "SELECT MAX(chNum) AS lastCh FROM words WHERE bookNum = $prevBook";
                $pcResult    = mysqli_query($conn, $prevChQuery);
                $pcRow       = mysqli_fetch_assoc($pcResult);
                $prevCh      = $pcRow['lastCh'];
            } else {
                $wrapBookQuery = "SELECT MAX(bookNum) AS lastBook FROM words";
                $wbResult      = mysqli_query($conn, $wrapBookQuery);
                $wbRow         = mysqli_fetch_assoc($wbResult);
                $prevBook      = $wbRow['lastBook'];
                $wrapChQuery   = "SELECT MAX(chNum) AS lastCh FROM words WHERE bookNum = $prevBook";
                $wcResult      = mysqli_query($conn, $wrapChQuery);
                $wcRow         = mysqli_fetch_assoc($wcResult);
                $prevCh        = $wcRow['lastCh'];
            }
        }

        $chapterHTML = "
        <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;'>
        <button class='actionButtonall' onclick='loadChapter($prevBook, $prevCh)'><i class='fa-solid fa-circle-chevron-left'></i> Prev</button>
        <h4 style='margin:0;'>$book[bookName] - Chapter $chNum</h4>
        <button class='actionButtonall' onclick='loadChapter($nextBook, $nextCh)'>Next <i class='fa-solid fa-circle-chevron-right'></i></button>
        </div>
        <ul style='list-style:none; padding:0;'>";

        while ($row = mysqli_fetch_assoc($result)) {
            $verseNum  = $row['verseNum'];
            $verseText = htmlspecialchars($row['word'], ENT_QUOTES, 'UTF-8');
            $chapterHTML .= "
            <li style='margin:5px 15px;'>
                <strong>Verse $verseNum:</strong> 
                <a class='chapter' onclick='showVerse($bookNum, $chNum, $verseNum)'>$verseText</a>
            </li>";
        }
        $chapterHTML .= "</ul>";

        echo json_encode([
            'chapterHTML' => $chapterHTML,
            'prevBook'    => $prevBook,
            'prevChap'    => $prevCh,
            'nextBook'    => $nextBook,
            'nextChap'    => $nextCh
        ]);
    } else {
        echo json_encode(['chapterHTML' => "<p>No verses found.</p>"]);
    }
}

function previewVerse($conn, $bookNum, $chNum, $verseNum)
{
    $query = "SELECT word FROM words WHERE bookNum = ? AND chNum = ? AND verseNum = ?";
    $stmt  = $conn->prepare($query);
    $stmt->bind_param("iii", $bookNum, $chNum, $verseNum);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode(['preview' => $row['word']]);
    } else {
        echo json_encode(['preview' => null]);
    }
}

// ---- Route the action ----

switch ($action) {
    case 'display':
        list($bookNum, $chNum, $verseNum) = verseupdate($conn, $bookNum, $chNum, $verseNum, $websocketURL, $session_id, false);
        echo json_encode(['book' => $book, 'bookNum' => $bookNum, 'chNum' => $chNum, 'verseNum' => $verseNum, 'verse' => $verse]);
        history($conn, $book, $bookNum, $chNum, $verseNum);
        break;

    case 'next':
        $verseNum++;
        list($bookNum, $chNum, $verseNum) = verseupdate($conn, $bookNum, $chNum, $verseNum, $websocketURL, $session_id, false);
        echo json_encode(['book' => $book, 'bookNum' => $bookNum, 'chNum' => $chNum, 'verseNum' => $verseNum, 'verse' => $verse]);
        break;

    case 'previous':
        $verseNum--;
        list($bookNum, $chNum, $verseNum) = verseupdate($conn, $bookNum, $chNum, $verseNum, $websocketURL, $session_id, true);
        echo json_encode(['book' => $book, 'bookNum' => $bookNum, 'chNum' => $chNum, 'verseNum' => $verseNum, 'verse' => $verse]);
        break;

    case 'higlitbut':
        versehigupdate($conn, $bookNum, $chNum, $verseNum, $higlit, $websocketURL, $session_id);
        echo json_encode(['book' => $book, 'bookNum' => $bookNum, 'chNum' => $chNum, 'verseNum' => $verseNum, 'verse' => $verse]);
        break;

    case 'history':
        list($bookNum, $chNum, $verseNum) = verseupdate($conn, $bookNum, $chNum, $verseNum, $websocketURL, $session_id);
        echo json_encode(['book' => $book, 'bookNum' => $bookNum, 'chNum' => $chNum, 'verseNum' => $verseNum, 'verse' => $verse]);
        break;

    case 'scheduleverse':
        addtoschedule($conn, $bookNum, $chNum, $verseNum);
        echo json_encode(['book' => $book, 'bookNum' => $bookNum, 'chNum' => $chNum, 'verseNum' => $verseNum, 'verse' => $verse]);
        break;

    case 'searchChapter':
        displayChapter($conn, $bookNum, $chNum);
        break;

    case 'clearverse':
        require_once __DIR__ . '/clear.php';
        echo json_encode(['book' => 'dummy', 'bookNum' => $bookNum, 'chNum' => $chNum, 'verseNum' => $verseNum, 'verse' => '']);
        break;

    case 'searchword':
        searchVerse($conn, $searchWord);
        break;

    case 'previewVerse':
        previewVerse($conn, $_POST['bookNum'], $_POST['chNum'], $_POST['verseNum']);
        break;
}
