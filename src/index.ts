import '@/styles/main.css'
import Stats from 'stats.js'
import music from '@/assets/tetris.mp3'
import { Game } from './Game'
import { Keyboard } from './Keyboard'
import type { Piece } from './Piece'

const TICK_TIME = 400
const BOARD_WIDTH = 30
const BOARD_HEIGHT = 20

class Scene {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  stats: Stats
  nextTickTime = 0
  game: Game = new Game(BOARD_WIDTH, BOARD_HEIGHT)
  keyboard = new Keyboard(200, 100)

  constructor(canvasSelector: string) {
    this.canvas = document.querySelector(canvasSelector)
    this.ctx = this.canvas?.getContext('2d')
    if (!this.ctx) {
      const err = `Canvas context not found for selector: ${canvasSelector}`
      alert(err)
      throw new Error(err)
    }

    // Set canvas dimensions and scale for rendering
    this.resizeCanvas()

    // Initialize stats.js for performance monitoring
    this.stats = new Stats()
    this.stats.dom.style.left = 'unset'
    this.stats.dom.style.right = '0'
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom)

    // Initialize key bindings for player controls
    this.keyboard.registerKey('w', () => this.game.pieces[0].rotatePiece())
    this.keyboard.registerKey('a', () => this.game.pieces[0].movePieceLeft())
    this.keyboard.registerKey('s', () => this.game.pieces[0].movePieceDown())
    this.keyboard.registerKey('d', () => this.game.pieces[0].movePieceRight())

    this.keyboard.registerKey('ArrowUp', () =>
      this.game.pieces[1].rotatePiece(),
    )
    this.keyboard.registerKey('ArrowLeft', () =>
      this.game.pieces[1].movePieceLeft(),
    )
    this.keyboard.registerKey('ArrowRight', () =>
      this.game.pieces[1].movePieceRight(),
    )
    this.keyboard.registerKey('ArrowDown', () =>
      this.game.pieces[1].movePieceDown(),
    )

    // Start the game loop
    this.update(0)
  }

  update(time: number) {
    this.stats.begin()
    if (time > this.nextTickTime) {
      this.nextTickTime = time + TICK_TIME
      this.game.executeTick()
    }
    this.draw()
    this.stats.end()
    window.requestAnimationFrame((t) => this.update(t))
  }

  draw() {
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawBoard(this.game.board)
    this.game.pieces.forEach((piece) => this.drawPiece(piece))
  }

  resizeCanvas() {
    const width = window.innerWidth
    const height = window.innerHeight
    const size = Math.min(width / BOARD_WIDTH, height / BOARD_HEIGHT)
    const blockSize = Math.floor(size)

    this.canvas.width = blockSize * BOARD_WIDTH
    this.canvas.height = blockSize * BOARD_HEIGHT
    this.ctx.scale(blockSize, blockSize)
  }

  private drawBoard(board: number[][]) {
    this.ctx.fillStyle = 'yellow'
    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          this.ctx.fillRect(x, y, 1, 1)
        }
      })
    })
  }

  private drawPiece(piece: Piece) {
    this.ctx.fillStyle = 'red'
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (!cell) return
        this.ctx.fillRect(piece.x + x, piece.y + y, 1, 1)
      })
    })
  }
}

const startButton: HTMLButtonElement = document.querySelector('#start')

startButton.addEventListener('click', () => {
  startButton.hidden = true
  const audio = new Audio(music)
  audio.loop = true
  audio.play()

  const scene = new Scene('canvas')

  addEventListener('resize', () => {
    scene.resizeCanvas()
  })
})
