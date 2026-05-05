<?php
include "db.php";

$sql = "
SELECT username, best_score 
FROM users 
ORDER BY best_score DESC 
LIMIT 5
";

$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    echo $row['username'] . " - " . $row['best_score'] . "<br>";
}
?>