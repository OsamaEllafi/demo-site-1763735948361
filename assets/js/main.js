import { ChessEngine } from './chess-engine.js';
import { ThreeDRenderer } from './3d-renderer.js';

const turnIndicator = document.getElementById('turn-indicator');
const gameStatus = document.getElementById('game-status');
const newGameBtn = document.getElementById('new-game-btn');
const undoMoveBtn = document.getElementById('undo-move-btn');
const hintBtn = document.getElementById('hint-btn');
const settingsBtn = document.getElementById('settings-btn');
const canvas = document.getElementById('chess-board-3d');

let chessEngine;
let renderer;

function initializeGame() {
    chessEngine = new ChessEngine();
    renderer = new ThreeDRenderer(canvas);
    // Initial setup of the 3D board and pieces
    renderer.initScene();
    renderer.updateBoard(chessEngine.board); // Pass initial board state
    updateUI();
}

function updateUI() {
    turnIndicator.textContent = `${chessEngine.getCurrentTurn()} to move`;
    gameStatus.textContent = chessEngine.getGameStatus();

    // Check for game over states
    if (chessEngine.isGameOver()) {
        gameStatus.textContent += ' - Game Over!';
        // Additional game over logic (e.g., disable moves, show winner)
    }
}

// Event Listeners
newGameBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to start a new game?')) {
        initializeGame();
        console.log('New game started');
    }
});

undoMoveBtn.addEventListener('click', () => {
    // Implement undo logic in chessEngine and update renderer
    console.log('Undo move');
    // Example: chessEngine.undoLastMove();
    // renderer.updateBoard(chessEngine.board);
    // updateUI();
});

hintBtn.addEventListener('click', () => {
    const suggestion = chessEngine.getHint();
    if (suggestion) {
        console.log('Hint:', suggestion);
        // Highlight the suggested move on the 3D board
        renderer.highlightSuggestion(suggestion.from, suggestion.to);
    } else {
        console.log('No hint available or game over.');
    }
});

settingsBtn.addEventListener('click', () => {
    alert('Settings functionality to be implemented.');
});

// Handle 3D board interaction (e.g., piece selection, movement)
canvas.addEventListener('click', (event) => {
    // This will require converting 2D canvas coordinates to 3D world coordinates
    // and then detecting which chess piece or square was clicked.
    // renderer.handleCanvasClick(event, (clickedSquare, clickedPiece) => {
    //     if (clickedPiece) {
    //         console.log('Clicked piece:', clickedPiece);
    //         // Logic for selecting a piece
    //         // renderer.highlightSelectedPiece(clickedPiece);
    //     } else if (clickedSquare) {
    //         console.log('Clicked square:', clickedSquare);
    //         // Logic for moving a selected piece to this square
    //         // const move = { from: selectedPiece.position, to: clickedSquare };
    //         // if (chessEngine.makeMove(move)) {
    //         //     renderer.animateMove(move);
    //         //     updateUI();
    //         //     // AI turn logic here
    //         // }
    //     }
    // });
    console.log('Canvas clicked, implement 3D interaction logic here.');
    // Placeholder for demonstrating piece movement
    // You'd get actual moves from user interaction
    const dummyMove = {
        from: { rank: 1, file: 'e' }, // e.g., 'e2'
        to: { rank: 3, file: 'e' }    // e.g., 'e4'
    };
    // renderer.animateMove(dummyMove);
    // chessEngine.makeMove(dummyMove);
    // updateUI();
});

initializeGame();
