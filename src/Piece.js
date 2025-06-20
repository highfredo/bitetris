import {BOARD_HEIGHT, BOARD_WIDTH} from "./consts";
import {allShapes} from "./piece_types";

export class Piece {
    x = 0
    y = 0
    shape
    board
    startPosition

    constructor(board, startPosition) {
        this.board = board;
        this.startPosition = startPosition;
        this.restart()
    }

    movePieceDown() {
        if (this.isPositionValid(this.x, this.y + 1, this.shape)) {
            this.y++;
        } else {
            this.solidifyPiece();
        }
    }

    movePieceRight() {
        if (this.isPositionValid(this.x+1, this.y, this.shape)) {
            this.x++;
        }
    }

    movePieceLeft() {
        if (this.isPositionValid(this.x-1, this.y, this.shape)) {
            this.x--
        }
    }

    rotatePiece() {
        const rotatedShape = this.shape[0].map(
            (_, index) => this.shape.map(row => row[index]).reverse()
        );

        if (this.isPositionValid(this.x, this.y, rotatedShape)) {
            this.shape = rotatedShape;
        }
    }

    isPositionValid(x, y, shape) {
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
                return this.board[y + sy][x + sx]
            })
        })
    }

    solidifyPiece() {
        const x = this.x;
        const y = this.y;
        this.shape.forEach((row, sy) => {
            row.forEach((cell, sx) => {
                if(!cell) return false;
                this.board[y + sy][x + sx] = 1
            })
        })
        this.restart()
    }

    restart() {
        this.x = this.startPosition.x;
        this.y = this.startPosition.y;
        this.shape = allShapes[Math.floor(Math.random() * allShapes.length)];
    }
}