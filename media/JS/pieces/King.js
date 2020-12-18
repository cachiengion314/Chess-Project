import Piece from "./Piece.js";
import Vector from "../utility/Vector.js";
import AssignedVar from "../utility/AssignedVar.js";

export default class King extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        if (this.color == AssignedVar.BLACK) {
            this.name = AssignedVar.KING_B;
        } else {
            this.name = AssignedVar.KING_W;
        }
        this.id = `${this.name}_${currentPos.convertToId()}`;
        this.directions = [
            new Vector(1, 0), new Vector(0, -1), new Vector(-1, 0), new Vector(0, 1),
            new Vector(1, 1), new Vector(1, -1), new Vector(-1, -1), new Vector(-1, 1),
        ];
        this.castleDirections = [new Vector(1, 0), new Vector(-1, 0)];
        this.posToCastleRook = null;
        this.posToCastle = null;
        this.hasMoved = false;
    }
    getId() {
        this.hasMoved = true;
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    findPosToCastleRook() {
        for (let dir of this.castleDirections) {
            for (let i = -3; i < 4; i += 6) {
                let newPos = this.currentPos.plusVector(dir.multipliByNumber(i));
                let chessPiece = AssignedVar.currentGame.chessBoard[newPos.x][newPos.y];
                if (chessPiece.name == AssignedVar.EMPTY) {
                    break;
                }
                if (chessPiece.name == AssignedVar.ROOK_B || chessPiece.name == AssignedVar.ROOK_W) {
                    if (!chessPiece.hasMoved && this.color == chessPiece.color) {
                        this.posToCastleRook = newPos
                        return newPos;
                    }
                }
            }
        }
        return null;
    }
    findPosToCastle() {
        let pos;
        if (!this.hasMoved && this.findPosToCastleRook()) {
            let dirToRook = this.findPosToCastleRook().plusVector(this.currentPos.multipliByNumber(-1)).convertToDirection();
            for (let i = 1; i <= 2; ++i) {
                pos = this.currentPos.plusVector(dirToRook.multipliByNumber(i));
                if (pos.isPositionHasPiece()) {
                    break;
                }
            }
            return pos;
        }
        return null;
    }
    getAllPossibleMoves() {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 2; ++i) {
                let newMovePos = this.currentPos.plusVector(vector.multipliByNumber(i));
                if (newMovePos.isPositionCanAttack()) {
                    allMovesPossibleArr.push(newMovePos);
                }
            }
        }
        if (this.findPosToCastle()) {
            this.posToCastle = this.findPosToCastle();
            allMovesPossibleArr.push(this.posToCastle);
        }

        return allMovesPossibleArr;
    }
}