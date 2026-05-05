const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


let score = 0;
let gameOver = false;
let gameEnded = false;

// player
const player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 80,
    width: 60,
    height: 60,
    speed: 6
};

let bullets = [];

let enemies = [];
const enemyRows = 4;
const enemyCols = 8;
const enemyWidth = 50;
const enemyHeight = 30;
const enemyPadding = 20;
const enemyOffsetTop = 60;
const enemyOffsetLeft = 80;

let enemyDirection = 1;
let enemySpeed = 2;


const keys = {
    left: false,
    right: false,
    space: false
};

// create enemies
function createEnemies() {
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

createEnemies();

// keyboard down
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        keys.left = true;
    }
    if (event.key === "ArrowRight") {
        keys.right = true;
    }
    if (event.key === " ") {
        keys.space = true;
    }
});

// keyboard up
document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft") {
        keys.left = false;
    }
    if (event.key === "ArrowRight") {
        keys.right = false;
    }
    if (event.key === " ") {
        keys.space = false;
    }
});

// shoot
let shootCooldown = 0;

function shootBullet() {
    if (shootCooldown <= 0) {
        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 12,
            speed: 8
        });
        shootCooldown = 15;
    }
}

// update player
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
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
    }

    bullets = bullets.filter(bullet => bullet.y + bullet.height > 0);
}

// update enemies
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
            }
        }
    }

    const aliveEnemies = enemies.filter(enemy => enemy.alive);
    if (aliveEnemies.length === 0) {
        createEnemies();
        enemySpeed += 0.3;
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

function drawScore() {
    ctx.fillStyle = "#00ff00";
    ctx.font = "24px monospace";
    ctx.fillText("Score: " + score, 20, 30);
}

function drawGameOver() {
    ctx.fillStyle = "#00ff00";
    ctx.font = "40px monospace";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);

    ctx.font = "24px monospace";
    ctx.fillText("Final Score: " + score, canvas.width / 2 - 90, canvas.height / 2 + 40);
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
        drawScore();

        requestAnimationFrame(gameLoop);
    } else {
    drawGameOver();

    if (!gameEnded) {
        gameEnded = true;

        setTimeout(() => {
            window.location.href = "../index.php";
        }, 3000);
    }
}
}

    gameLoop();