<?php
include "db.php";

$username = $_POST['username'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";

if ($conn->query($sql)) {
    header("Location: ../index.php"); 
    exit(); // 
} else {
    echo "Error: " . $conn->error;
}
?>