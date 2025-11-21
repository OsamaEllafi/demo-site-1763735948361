import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Import GLTFLoader if using .gltf models, e.g.,
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ThreeDRenderer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        this.controls = null;
        this.boardGroup = new THREE.Group(); // Group to hold board squares and pieces
        this.pieces = {}; // Store piece meshes
        this.highlightMesh = null; // For highlighting selected squares/moves
        this.suggestionMesh = null; // For highlighting suggested moves

        // Set up renderer size
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    initScene() {
        // Set background color of the scene
        this.scene.background = new THREE.Color(0x1a1a2e); // Matches CSS --bg-color

        // Camera position
        this.camera.position.set(0, 10, 15); // Adjust for better initial view
        this.camera.lookAt(0, 0, 0);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);

        // OrbitControls for camera interaction
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.scene.add(this.boardGroup);
        this.createChessBoard();
        this.animate();

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    createChessBoard() {
        const boardSize = 8; // 8x8 squares
        const squareSize = 1; // Each square is 1 unit
        const boardOffset = (boardSize / 2) * squareSize - (squareSize / 2);

        const lightMaterial = new THREE.MeshLambertMaterial({ color: 0xa8a8a8 }); // Matches CSS --light-square
        const darkMaterial = new THREE.MeshLambertMaterial({ color: 0x585858 });  // Matches CSS --dark-square

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const material = (i + j) % 2 === 0 ? lightMaterial : darkMaterial;
                const geometry = new THREE.BoxGeometry(squareSize, 0.1, squareSize); // Thin box for a square
                const square = new THREE.Mesh(geometry, material);

                // Position squares correctly, centering the board at (0,0,0)
                square.position.set(j * squareSize - boardOffset, -0.05, i * squareSize - boardOffset);
                square.userData = { isSquare: true, row: i, col: j }; // Store grid data
                this.boardGroup.add(square);
            }
        }
    }

    updateBoard(boardState) {
        // Remove existing pieces from the scene
        for (const pieceKey in this.pieces) {
            this.boardGroup.remove(this.pieces[pieceKey]);
        }
        this.pieces = {};

        const squareSize = 1;
        const boardOffset = (8 / 2) * squareSize - (squareSize / 2);

        // Loader for 3D models (e.g., GLTF)
        // const loader = new GLTFLoader();

        // Add new pieces based on boardState
        boardState.forEach((row, i) => {
            row.forEach((pieceCode, j) => {
                if (pieceCode) {
                    const pieceName = `${pieceCode}_${i}_${j}`;
                    // Placeholder for 3D piece models. In a real scenario,
                    // you would load actual GLTF models from 'assets/models/' here.
                    // For now, we'll use simple cylinders.

                    const isWhite = pieceCode === pieceCode.toUpperCase();
                    const pieceColor = isWhite ? 0xffffff : 0x333333;
                    const pieceGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 32);
                    const pieceMaterial = new THREE.MeshLambertMaterial({ color: pieceColor });
                    const pieceMesh = new THREE.Mesh(pieceGeometry, pieceMaterial);

                    pieceMesh.position.set(
                        j * squareSize - boardOffset,
                        0.4, // Position above the board
                        i * squareSize - boardOffset
                    );
                    pieceMesh.userData = { isPiece: true, pieceCode: pieceCode, row: i, col: j };
                    this.boardGroup.add(pieceMesh);
                    this.pieces[pieceName] = pieceMesh;
                }
            });
        });
    }

    animateMove(move) {
        console.log('Animating move:', move);
        // Implement smooth animation for piece movement
        // This would involve finding the piece mesh, calculating target position,
        // and using a library like GSAP or Three.js built-in animation loop
        // to smoothly interpolate its position.

        // For now, a simple direct update (no animation)
        // After animation, call updateBoard to reflect new state.
    }

    highlightSuggestion(from, to) {
        // Remove previous suggestion highlight if any
        if (this.suggestionMesh) {
            this.boardGroup.remove(this.suggestionMesh);
            this.suggestionMesh = null;
        }

        const squareSize = 1;
        const boardOffset = (8 / 2) * squareSize - (squareSize / 2);

        const geometry = new THREE.BoxGeometry(squareSize * 0.9, 0.15, squareSize * 0.9); // Slightly smaller, slightly taller
        const material = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.6 }); // Gold-ish highlight
        this.suggestionMesh = new THREE.Mesh(geometry, material);

        const toRow = 8 - to.rank;
        const toCol = to.file.charCodeAt(0) - 'a'.charCodeAt(0);

        this.suggestionMesh.position.set(
            toCol * squareSize - boardOffset,
            0.05, // Slightly above the board surface
            toRow * squareSize - boardOffset
        );
        this.boardGroup.add(this.suggestionMesh);

        // Consider animating the highlight or making it pulse
    }

    clearHighlights() {
        if (this.highlightMesh) {
            this.boardGroup.remove(this.highlightMesh);
            this.highlightMesh = null;
        }
        if (this.suggestionMesh) {
            this.boardGroup.remove(this.suggestionMesh);
            this.suggestionMesh = null;
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        if (this.controls) {
            this.controls.update(); // Only required if controls.enableDamping or controls.autoRotate are set to true
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    // Method to handle canvas clicks and convert to 3D interaction (raycasting)
    handleCanvasClick(event, callback) {
        const mouse = new THREE.Vector2();
        // Normalize mouse position to [-1, 1] range
        mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / this.canvas.clientHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.boardGroup.children, true);

        let clickedSquare = null;
        let clickedPiece = null;

        for (const intersect of intersects) {
            if (intersect.object.userData.isPiece) {
                clickedPiece = intersect.object.userData;
                break; // Prioritize piece over square
            } else if (intersect.object.userData.isSquare && !clickedSquare) {
                clickedSquare = intersect.object.userData;
            }
        }
        callback(clickedSquare, clickedPiece);
    }

    // Add methods for highlighting selected pieces, valid moves, etc.
}
