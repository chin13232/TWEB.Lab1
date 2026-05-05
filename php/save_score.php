<?php
session_start();
header("Access-Control-Allow-Credentials: true");
include "db.php";

if (!isset($_SESSION['user_id'])) {
    echo "not logged";
    exit();
}

$user_id = $_SESSION['user_id'];
$new_score = (int)$_POST['score'];

$sql = "SELECT best_score FROM users WHERE id = $user_id";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

$current_best = $row['best_score'];

if ($new_score > $current_best) {

    $sql = "UPDATE users SET best_score = $new_score WHERE id = $user_id";
    $conn->query($sql);

    echo "new record";
} else {
    echo "no change";
}
?>