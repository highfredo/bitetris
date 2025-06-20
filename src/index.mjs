import "./styles.css";
import Stats from "stats.js";
import { CUBE, SHAPE_L } from "./piece_types";

const stats = new Stats();
stats.dom.style.left = "unset";
stats.dom.style.right = '0';
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 20;
const TICK_TIME = 400;

const piece = {
  x: 2,
  y: 2,
  shape: SHAPE_L,
};

const board = matrix(BOARD_HEIGHT, BOARD_WIDTH)

board[board.length - 2] = [1, ...Array(BOARD_WIDTH-2).fill(0), 1];
board[board.length - 1] = Array(BOARD_WIDTH).fill(1);

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
update();

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  drawPiece();
}

function executeTick() {
  movePieceDown()
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

function drawPiece() {
  ctx.fillStyle = "red";
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return;
      ctx.fillRect(piece.x + x, piece.y + y, 1, 1);
    });
  });
}

function isPositionValid(x, y, shape) {
  // Check left border
  if (x < 0) {
    return false;
  }

  // Check right border
  if (x+shape[0].length > BOARD_WIDTH) {
    return false;
  }

  // Check bottom border
  if (y+shape.length > BOARD_HEIGHT) {
    return false;
  }

  // Check if the piece overlaps with existing blocks on the board
  return !shape.some((row, sy) => {
    return row.some((cell, sx) => {
      if(!cell) return false;
      return board[y + sy][x + sx]
    })
  })
}

function movePieceDown() {
  if (isPositionValid(piece.x, piece.y + 1, piece.shape)) {
    piece.y++;
  } else {
    solidifyPiece(piece);
  }
}

function movePieceRight() {
  if (isPositionValid(piece.x+1, piece.y, piece.shape)) {
    piece.x++;
  }
}

function movePieceLeft() {
  if (isPositionValid(piece.x-1, piece.y, piece.shape)) {
    piece.x--
  }
}

function rotatePiece() {
  const rotatedShape = piece.shape[0].map((_, index) => piece.shape.map(row => row[index]).reverse());
  if (isPositionValid(piece.x, piece.y, rotatedShape)) {
    piece.shape = rotatedShape;
  }
}

function solidifyPiece(piece) {
  const x = piece.x;
  const y = piece.y;
  piece.shape.forEach((row, sy) => {
    row.forEach((cell, sx) => {
      if(!cell) return false;
      board[y + sy][x + sx] = 1
    })
  })

  piece.x = 2
  piece.y = 2
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

function matrix(h, w) {
  return Array.from({
    length: h
  }, () => new Array(w).fill(0))
}

document.addEventListener("keydown", (evt) => {
  if (evt.key === "ArrowDown") {
    movePieceDown()
  } else if (evt.key === "ArrowLeft") {
    movePieceLeft();
  } else if (evt.key === "ArrowRight") {
    movePieceRight()
  } else if (evt.key === "ArrowUp") {
    rotatePiece()
  }
});


