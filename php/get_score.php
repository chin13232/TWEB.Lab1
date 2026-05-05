<?php
session_start();
include "db.php";

if (!isset($_SESSION['user_id'])) {
    echo "0";
    exit();
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT best_score FROM users WHERE id = $user_id";
$result = $conn->query($sql);
$row = $result->fetch_assoc();

echo $row['best_score'];
?>