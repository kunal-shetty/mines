// script.js
let gridSize = 5;
let numMines = 5;
let board = [];
let revealed = [];
let baseBet = 0;
let balance = 100;
let winnings = 0;
let multiplier = 1.2;
let gameActive = false;
let hardMode = false;

function startGame() {
    if (gameActive) return;

    baseBet = parseFloat(document.getElementById('betAmount').value);
    if (baseBet > balance || baseBet <= 0) {
        document.getElementById('message').innerText = "Invalid bet amount!";
        return;
    }

    balance -= baseBet;
    winnings = baseBet;
    gameActive = true;

    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('winnings').innerText = winnings.toFixed(2);
    document.getElementById('message').innerText = "Game started! Click tiles to reveal.";

    board = Array(gridSize * gridSize).fill(0);
    revealed = Array(gridSize * gridSize).fill(false);

    placeMines();
    renderBoard();
}

function placeMines() {
    let minesPlaced = 0;
    let totalMines = hardMode ? (2 * gridSize) : gridSize; // Increase mines in hard mode
    while (minesPlaced < totalMines) {
        let index = Math.floor(Math.random() * board.length);
        if (board[index] !== 'M') {
            board[index] = 'M';
            minesPlaced++;
        }
    }
}

function renderBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
    gameBoard.style.width = `${gridSize * 65}px`;
    gameBoard.className = 'grid';

    board.forEach((tile, index) => {
        const div = document.createElement('div');
        div.className = 'tile';
        div.onclick = () => revealTile(index, div);
        gameBoard.appendChild(div);
    });
}

function playSound(audioId) {
    const sound = document.getElementById(audioId);
    sound.currentTime = 0;
    sound.play();
}

function revealTile(index, div) {
    if (!gameActive || revealed[index]) return;
    revealed[index] = true;

    if (board[index] === 'M') {
        div.className = 'tile mine';
        div.innerText = '💣';
        playSound("mineSound");
        document.getElementById('message').innerText = `You hit a mine! Lost $${winnings.toFixed(2)}.`;
        winnings = 0;
        document.getElementById('winnings').innerText = winnings.toFixed(2);
        gameActive = false;
    } else {
        div.className = 'tile safe';
        playSound("safeSound");
        winnings *= multiplier;
        document.getElementById('winnings').innerText = winnings.toFixed(2);
    }
}

function cashOut() {
    if (!gameActive) return;

    balance += winnings;
    document.getElementById('message').innerText = `You cashed out with $${winnings.toFixed(2)}!`;
    winnings = 0;
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('winnings').innerText = winnings.toFixed(2);
    gameActive = false;
}

function toggleHardMode() {
    hardMode = !hardMode;
    multiplier = hardMode ? 5 : 1.1; // Increase multiplier in hard mode
    document.getElementById('message').innerText = hardMode ? "Hard Mode ON!" : "Hard Mode OFF!";
}
