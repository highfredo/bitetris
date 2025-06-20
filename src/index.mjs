import "./styles.css";
import Stats from "stats.js";
import {BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, TICK_TIME} from "./consts.js";
import {Piece} from "./Piece.js";
import {matrix} from "./utils.js";
import music from "url:./assets/tetris.mp3";

const stats = new Stats();
stats.dom.style.left = "unset";
stats.dom.style.right = '0';
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const board = matrix(BOARD_HEIGHT, BOARD_WIDTH)

const pieceLeft = new Piece(board, {x: 2, y: 0});
const pieceRight = new Piece(board, {x: BOARD_WIDTH - 5, y: 0})

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let nextTickTime = 0;
function update(time) {
  stats.begin();
  draw();
  if (time > nextTickTime) {
    nextTickTime = time + TICK_TIME;
    executeTick(time);
  }
  stats.end();
  window.requestAnimationFrame(update);
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawPiece(pieceLeft);
  drawPiece(pieceRight);
}

function executeTick() {
  pieceLeft.movePieceDown()
  pieceRight.movePieceDown()
  clearCompletedRows()
}

function drawBoard() {
  ctx.fillStyle = "yellow";
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });
}

function drawPiece(piece) {
  ctx.fillStyle = "red";
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return;
      ctx.fillRect(piece.x + x, piece.y + y, 1, 1);
    });
  });
}

function clearCompletedRows() {
  for (let y = board.length - 1; y >= 0; y--) {
    if (board[y].every(cell => cell === 1)) {
      board.splice(y, 1);
      board.unshift(Array(BOARD_WIDTH).fill(0));
      y++; // Recheck this row after shifting
    }
  }
}

function startGame() {
  document.querySelector('#start').hidden = true;
  const audio = new Audio(music);
  audio.play();
  update();
  document.addEventListener("keydown", (evt) => {
    if (evt.key === "ArrowDown") {
      pieceRight.movePieceDown()
    } else if (evt.key === "ArrowLeft") {
      pieceRight.movePieceLeft();
    } else if (evt.key === "ArrowRight") {
      pieceRight.movePieceRight()
    } else if (evt.key === "ArrowUp") {
      pieceRight.rotatePiece()
    } else if (evt.key === "s") {
      pieceLeft.movePieceDown()
    } else if (evt.key === "a") {
      pieceLeft.movePieceLeft();
    } else if (evt.key === "d") {
      pieceLeft.movePieceRight()
    } else if (evt.key === "w") {
      pieceLeft.rotatePiece()
    }
  });
}

document.querySelector('#start').addEventListener('click', startGame)



