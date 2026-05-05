<?php
session_start();
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Space Invaders</title>
    <link rel="stylesheet" href="styles/style.css">
</head>
<body>
    <!-- Main container -->
    <div id="main-menu">
        <!-- LOGIN -->
    <div id="auth">
        <form action="php/login.php" method="POST">
            <input name="username" placeholder="USERNAME">
            <input name="password" placeholder="PASSWORD">
            <button type="submit">LOGIN</button>
        </form>

        <form action="php/register.php" method="POST">
            <input name="username" placeholder="NEW USERNAME">
            <input name="password" placeholder="NEW PASSWORD">
            <button type="submit">REGISTER</button>
        </form>
    </div>

        <!-- Game modes -->
        <div id="game-modes">

            <a href="pages/mode1.php" class="mode">
                <h2>Classic Mode</h2>
                <p>Original Space Invaders experience</p>
            </a>

            <a href="pages/mode2.php" class="mode">
                <h2>Hardcore Mode</h2>
                <p>Faster enemies, less mercy</p>
            </a>

            <a href="pages/mode3.php" class="mode">
                <h2>Survival Mode</h2>
                <p>How long can you last?</p>
            </a>

            

        </div>

        <!-- Bottom section -->
        <footer id="stats">
            <div id="best-score">
                <h3>Best Score</h3>
                <p id="bestScore">---</p>
            </div>

            <div id="leaderboard">
                <h3>Leaderboard</h3>
                <p id="leaderboardList">Loading...</p>
            </div>
        </footer>

    </div>

    <script>
        fetch("php/get_score.php")
        .then(res => res.text())
        .then(score => {
            document.getElementById("bestScore").innerText = score;
        });

        fetch("php/leaderboard.php")
        .then(res => res.text())
        .then(data => {
            document.getElementById("leaderboardList").innerHTML = data;
        });

        
    </script>
</body>
</html>