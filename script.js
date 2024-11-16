const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart');
let score = 0;
let grid = [];

function createGrid() {
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    addRandomTile();
    addRandomTile();
    updateGrid();
}

function addRandomTile() {
    let emptyCells = [];
    grid.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            if (cell === 0) emptyCells.push({ rIndex, cIndex });
        });
    });
    if (emptyCells.length > 0) {
        const { rIndex, cIndex } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[rIndex][cIndex] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateGrid() {
    gridContainer.innerHTML = '';
    grid.forEach(row => {
        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('grid-cell');
            if (cell) {
                cellDiv.classList.add(`tile-${cell}`);
                cellDiv.innerText = cell;
            }
            gridContainer.appendChild(cellDiv);
        });
    });
    scoreDisplay.innerText = score;
}

function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(cell => cell !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j + 1, 1);
                moved = true;
            }
        }
        let newRow = row.concat(Array(4 - row.length).fill(0));
        if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) moved = true;
        grid[i] = newRow;
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(cell => cell !== 0);
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j - 1, 1);
                moved = true;
            }
        }
        let newRow = Array(4 - row.length).fill(0).concat(row);
        if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) moved = true;
        grid[i] = newRow;
    }
    return moved;
}

function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function moveUp() {
    grid = transpose(grid);
    let moved = moveLeft();
    grid = transpose(grid);
    return moved;
}

function moveDown() {
    grid = transpose(grid);
    let moved = moveRight();
    grid = transpose(grid);
    return moved;
}

function checkGameOver() {
    // Check for any empty cells
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
        }
    }
    
    // Check for possible merges
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === grid[i][j + 1]) return false;
        }
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === grid[i + 1][j]) return false;
        }
    }
    return true;
}

document.addEventListener('keydown', (event) => {
    let moved = false;
    switch (event.key) {
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
    }
    
    if (moved) {
        addRandomTile();
        updateGrid();
        if (checkGameOver()) {
            alert('Game Over! Your score: ' + score);
        }
    }
});

restartButton.addEventListener('click', () => {
    score = 0;
    createGrid();
});

createGrid();
