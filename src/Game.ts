import { Piece } from './Piece'
import { matrix } from './utils'

export class Game {
  board: number[][]
  pieces: Piece[]

  constructor(
    public board_width: number,
    public board_height: number,
  ) {
    this.board = matrix(board_width, board_height)
    this.pieces = [new Piece(this, 2), new Piece(this, board_width - 5)]
  }

  executeTick() {
    this.pieces.forEach((piece) => piece.movePieceDown())
    this.clearCompletedRows()
  }

  clearCompletedRows() {
    for (let y = this.board.length - 1; y >= 0; y--) {
      if (this.board[y].every((cell) => cell === 1)) {
        this.board.splice(y, 1)
        this.board.unshift(Array(this.board_width).fill(0))
        y++ // Recheck this row after shifting
      }
    }
  }

  // gameOver() {
  //   alert('Game Over! Your pieces reached the top of the board.')
  //   console.log('game over')
  //   this.board = matrix(this.board_width, this.board_height)
  //   this.pieces = [new Piece(this, 2), new Piece(this, this.board_width - 5)]
  // }
}
