// Alert at the start
alert("Ensure your window is on full screen. If you game over, reload the page or press the space bar. This flappy bird will start in about 1 second. Beware.");

let board;
let boardWidth = 1320;
let boardHeight = 740;
let context;
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

let birdWidth = 55;
let birdHeight = 55;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 700;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let highScore = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    setTimeout(function() {
        requestAnimationFrame(update);
        setInterval(placePipes, 3000);
        document.addEventListener("keydown", moveBird);
        document.addEventListener("touchstart", moveBirdTouch); // Add touch event listener
    }, 1000);
}

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        if (score > highScore) {
            highScore = score;
        }

        // Clear the previous frame before displaying Game Over text
        context.clearRect(0, 0, board.width, board.height);
        context.fillStyle = "rgba(0, 0, 0, 0.7)"; // Semi-transparent black background
        context.fillRect(500, 280, 310, 165); // Adjust position and size as needed
        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText('GAME OVER', 520, 330);
        context.fillText(`🏆: ${highScore}`, 600, 425); // Display high score once on game over screen

        context.fillText(`Score: ${Math.floor(score)}`, 570, 380);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Apply gravity to bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    bird.y = Math.min(bird.y, board.height - bird.height);

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y >= board.height - bird.height) {
        gameOver = true;
        sound_die.play();
    }

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
            sound_point.play();
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
            sound_die.play();
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Display current score on the top left during the game
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(`Score: ${Math.floor(score)}`, 5, 45);

    // Display high score only on the top right, without duplicating on game over
    context.fillText(`🏆: ${highScore}`, 5, 90);
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4.5;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.code == "KeyW") {
        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

// Function to handle touch event for bird movement
function moveBirdTouch() {
    velocityY = -6;

    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
