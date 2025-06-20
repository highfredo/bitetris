import { BOARD_HEIGHT, BOARD_WIDTH } from './consts'
import type { Game } from './Game'
import { allShapes } from './piece_types'

export class Piece {
  x: number = 0
  y: number = 0
  shape: number[][]

  constructor(
    private game: Game,
    private startPosition: number,
  ) {
    this.restart()
  }

  movePieceDown() {
    if (this.isPositionValid(this.x, this.y + 1, this.shape)) {
      this.y++
    } else {
      this.solidifyPiece()
    }
  }

  movePieceRight() {
    if (this.isPositionValid(this.x + 1, this.y, this.shape)) {
      this.x++
    }
  }

  movePieceLeft() {
    if (this.isPositionValid(this.x - 1, this.y, this.shape)) {
      this.x--
    }
  }

  rotatePiece() {
    const rotatedShape = this.shape[0].map((_, index) =>
      this.shape.map((row) => row[index]).reverse(),
    )

    if (this.isPositionValid(this.x, this.y, rotatedShape)) {
      this.shape = rotatedShape
    }
  }

  isPositionValid(x: number, y: number, shape: number[][]) {
    // Check left border
    if (x < 0) {
      return false
    }

    // Check right border
    if (x + shape[0].length > BOARD_WIDTH) {
      return false
    }

    // Check bottom border
    if (y + shape.length > BOARD_HEIGHT) {
      return false
    }

    // Check if the piece overlaps with existing blocks on the board
    // or with other pieces
    const otherPieces = this.game.pieces.filter((p) => p !== this)
    return !shape.some((row, sy) => {
      return row.some((cell, sx) => {
        if (!cell) return false
        return (
          this.game.board[y + sy][x + sx] ||
          otherPieces.some((p) =>
            p.shape.some((prow, psy) =>
              prow.some(
                (pcell, psx) =>
                  pcell && p.x + psx === x + sx && p.y + psy === y + sy,
              ),
            ),
          )
        )
      })
    })
  }

  solidifyPiece() {
    const x = this.x
    const y = this.y
    this.shape.forEach((row, sy) => {
      row.forEach((cell, sx) => {
        if (!cell) return false
        this.game.board[y + sy][x + sx] = 1
      })
    })
    this.restart()
  }

  restart() {
    this.x = this.startPosition
    this.y = 0
    this.shape = allShapes[Math.floor(Math.random() * allShapes.length)]
  }
}
