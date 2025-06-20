import '@/styles/main.css'
import Stats from 'stats.js'
import music from '@/assets/tetris.mp3'
import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, TICK_TIME } from './consts'
import { Game } from './Game'
import type { Piece } from './Piece'

const stats = new Stats()
stats.dom.style.left = 'unset'
stats.dom.style.right = '0'
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

// biome-ignore lint/style/noNonNullAssertion: canvas exists in HTML
const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')
canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

ctx.scale(BLOCK_SIZE, BLOCK_SIZE)

const game = new Game(BOARD_WIDTH, BOARD_HEIGHT)

let nextTickTime = 0
function update(time: number) {
  stats.begin()
  draw()
  if (time > nextTickTime) {
    nextTickTime = time + TICK_TIME
    game.executeTick()
  }
  stats.end()
  window.requestAnimationFrame(update)
}

function draw() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  drawBoard(game.board)
  game.pieces.forEach((piece) => drawPiece(piece))
}

function drawBoard(board: number[][]) {
  ctx.fillStyle = 'yellow'
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        ctx.fillRect(x, y, 1, 1)
      }
    })
  })
}

function drawPiece(piece: Piece) {
  ctx.fillStyle = 'red'
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return
      ctx.fillRect(piece.x + x, piece.y + y, 1, 1)
    })
  })
}

function startGame() {
  document.querySelector('#start').hidden = true
  const audio = new Audio(music)
  audio.loop = true
  audio.play()
  update(0)
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'ArrowDown') {
      game.pieces[1].movePieceDown()
    } else if (evt.key === 'ArrowLeft') {
      game.pieces[1].movePieceLeft()
    } else if (evt.key === 'ArrowRight') {
      game.pieces[1].movePieceRight()
    } else if (evt.key === 'ArrowUp') {
      game.pieces[1].rotatePiece()
    } else if (evt.key === 's') {
      game.pieces[0].movePieceDown()
    } else if (evt.key === 'a') {
      game.pieces[0].movePieceLeft()
    } else if (evt.key === 'd') {
      game.pieces[0].movePieceRight()
    } else if (evt.key === 'w') {
      game.pieces[0].rotatePiece()
    }
  })
}

document.querySelector('#start').addEventListener('click', startGame)
