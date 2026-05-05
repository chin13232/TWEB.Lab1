const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let gameOver = false;
let ammo = 2;
let scoreSent = false;
let gameEnded = false;

// player
const player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 80,
    width: 60,
    height: 60,
    speed: 4
};

// controls
const keys = {
    left: false,
    right: false,
    space: false
};

// bullets
let bullets = [];
let shootCooldown = 0;

// enemies
let enemies = [];
let enemyDirection = 1;
let enemySpeed = 4;
const enemyWidth = 50;
const enemyHeight = 30;
const enemyPadding = 20;
const enemyCols = 8;
const enemyRows = 3;
const enemyOffsetTop = 50;
const enemyOffsetLeft = 80;

function createWave() {
    enemies = [];

    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
            enemies.push({
                x: enemyOffsetLeft + col * (enemyWidth + enemyPadding),
                y: enemyOffsetTop + row * (enemyHeight + enemyPadding),
                width: enemyWidth,
                height: enemyHeight,
                alive: true
            });
        }
    }
}

createWave();

// keyboard
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") keys.left = true;
    if (event.key === "ArrowRight") keys.right = true;
    if (event.key === " ") keys.space = true;
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft") keys.left = false;
    if (event.key === "ArrowRight") keys.right = false;
    if (event.key === " ") keys.space = false;
});

function shootBullet() {
    if (shootCooldown <= 0 && ammo > 0) {
        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 12,
            speed: 8
        });

        ammo--;
        shootCooldown = 12;
    }
}

function updatePlayer() {
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }

    if (keys.right && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }

    if (keys.space) {
        shootBullet();
    }

    if (shootCooldown > 0) {
        shootCooldown--;
    }
}

function updateBullets() {
    for (let bullet of bullets) {
        bullet.y -= bullet.speed;
    }

    bullets = bullets.filter(bullet => bullet.y + bullet.height > 0);
}

function updateEnemies() {
    let hitEdge = false;

    for (let enemy of enemies) {
        if (!enemy.alive) continue;

        enemy.x += enemySpeed * enemyDirection;

        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            hitEdge = true;
        }
    }

    if (hitEdge) {
        enemyDirection *= -1;

        for (let enemy of enemies) {
            if (!enemy.alive) continue;

            enemy.y += 20;

            if (enemy.y + enemy.height >= player.y) {
                gameOver = true;
            }
        }
    }
}

function checkCollisions() {
    for (let bullet of bullets) {
        for (let enemy of enemies) {
            if (!enemy.alive) continue;

            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemy.alive = false;
                bullet.y = -100;
                score += 10;
                ammo += 2;
            }
        }
    }

    let aliveEnemies = enemies.filter(enemy => enemy.alive);

    if (aliveEnemies.length === 0) {
        createWave();
        enemySpeed += 0.3;
    }

    if (ammo === 0 && bullets.length === 0) {
        gameOver = true;
    }
}

function drawPlayer() {
    ctx.fillStyle = "#de15c3";

    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y); 
    ctx.lineTo(player.x, player.y + player.height); 
    ctx.lineTo(player.x + player.width, player.y + player.height); 
    ctx.closePath();
    ctx.fill(); 
}

function drawBullets() {
    ctx.fillStyle = "#de15c3";

    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function drawEnemies() {
    ctx.fillStyle = "#00ff00";

    for (let enemy of enemies) {
        if (enemy.alive) {
            ctx.beginPath();
            ctx.ellipse(
                enemy.x + enemy.width / 2,   // centru X
                enemy.y + enemy.height / 2,  // centru Y
                enemy.width / 2,             // raza pe X
                enemy.height / 2,            // raza pe Y
                0,                           // rotație
                0,
                Math.PI * 2                  // cerc complet
            );

            ctx.fill();
        }
    }
}

function drawHUD() {
    ctx.fillStyle = "#00ff00";
    ctx.font = "20px monospace";
    ctx.fillText("Score: " + score, 20, 30);
    ctx.fillText("Bullets: " + ammo, 20, 60);
    ctx.fillText("SURVIVAL MODE", 560, 30);
}

function drawGameOver() {
    ctx.fillStyle = "#00ff00";
    ctx.font = "40px monospace";
    ctx.fillText("GAME OVER", 270, 280);

    ctx.font = "24px monospace";
    ctx.fillText("Final Score: " + score, 305, 330);
}

function sendScore(score) {
    return fetch("../php/save_score.php", { 
        method: "POST",
        credentials: "include", 
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "score=" + score
    })
    .then(res => res.text())
    .then(data => {
        console.log("SERVER:", data);   
    })
    .catch(err => {
        console.log("ERROR:", err);
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        updatePlayer();
        updateBullets();
        updateEnemies();
        checkCollisions();

        drawPlayer();
        drawBullets();
        drawEnemies();
        drawHUD();

        requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();

        if (!gameEnded) {
            gameEnded = true;

            sendScore(score).then(() => {
                setTimeout(() => {
                    window.location.href = "../index.php";
                }, 2000);
            });
        }
    }
}

gameLoop();