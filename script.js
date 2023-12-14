const gameContainer = document.getElementById('game-container');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const resetButton = document.getElementById('reset-button');

const numRows = 8;
const numCols = 8;
const candies = ['💻', '🐱‍💻', '👾', '👽'];

let selectedCell = null;
let moves = 0;

// Function to create a random candy element
function createCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

// Function to create the game grid
function createGrid() {
    gameContainer.innerHTML = ''; // Clear existing grid

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.innerText = createCandy();
            cell.addEventListener('click', handleCellClick);
            gameContainer.appendChild(cell);
        }
    }

    moves = 0;
    updateScore();
}

// Function to handle cell click
function handleCellClick(event) {
    const clickedCell = event.target;

    if (!selectedCell) {
        selectedCell = clickedCell;
        selectedCell.classList.add('selected');
    } else {
        // Swap candies if the selected cell is adjacent
        if (areAdjacent(selectedCell, clickedCell)) {
            swapCandies(selectedCell, clickedCell);
            checkAndRemoveMatches();
            moves++;
            updateScore();
        }

        // Reset selected cell and remove the 'selected' class
        selectedCell.classList.remove('selected');
        selectedCell = null;
    }
}

// Function to update the score display
function updateScore() {
    scoreElement.innerText = moves;
}

// Function to reset the grid
function resetGrid() {
    createGrid();
}

// Function to check if two cells are adjacent
function areAdjacent(cell1, cell2) {
    const row1 = parseInt(cell1.dataset.row, 10);
    const col1 = parseInt(cell1.dataset.col, 10);
    const row2 = parseInt(cell2.dataset.row, 10);
    const col2 = parseInt(cell2.dataset.col, 10);

    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

// Function to swap candies between two cells
function swapCandies(cell1, cell2) {
    const tempCandy = cell1.innerText;
    cell1.innerText = cell2.innerText;
    cell2.innerText = tempCandy;
}

// Function to check and remove matching candies
function checkAndRemoveMatches() {
    const cells = document.querySelectorAll('.cell');

    for (const cell of cells) {
        const row = parseInt(cell.dataset.row, 10);
        const col = parseInt(cell.dataset.col, 10);

        // Check horizontally
        const horizontalMatches = checkMatches(row, col, 0, 1) + checkMatches(row, col, 0, -1);

        // Check vertically
        const verticalMatches = checkMatches(row, col, 1, 0) + checkMatches(row, col, -1, 0);

        // Empty matching candies
        if (horizontalMatches >= 2 || verticalMatches >= 2) {
            cell.innerText = '';
        }
    }

    // Implement the falling effect
    setTimeout(() => {
        for (let col = 0; col < numCols; col++) {
            let emptyCells = 0;
            for (let row = numRows - 1; row >= 0; row--) {
                const currentCell = cells[row * numCols + col];
                if (currentCell.innerText === '') {
                    emptyCells++;
                } else if (emptyCells > 0) {
                    const targetCell = cells[(row + emptyCells) * numCols + col];
                    targetCell.innerText = currentCell.innerText;
                    currentCell.innerText = '';
                }
            }
        }
    }, 500); // Adjust the delay based on your preference
}

// Function to check for matching candies in a direction
function checkMatches(row, col, rowIncrement, colIncrement) {
    const currentCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const currentCandy = currentCell.innerText;

    let count = 0;
    let nextRow = row + rowIncrement;
    let nextCol = col + colIncrement;

    while (isValidCell(nextRow, nextCol) && document.querySelector(`.cell[data-row="${nextRow}"][data-col="${nextCol}"]`).innerText === currentCandy) {
        count++;
        nextRow += rowIncrement;
        nextCol += colIncrement;
    }

    return count;
}

// Function to check if a cell is within the grid
function isValidCell(row, col) {
    return row >= 0 && row < numRows && col >= 0 && col < numCols;
}

// Initialize the game grid
createGrid();

// Event listener for the reset button
resetButton.addEventListener('click', resetGrid);
