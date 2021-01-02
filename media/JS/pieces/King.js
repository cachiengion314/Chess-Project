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
        this.weights = 60000;
        this.positions = [
            [-5, 0, 0, 0, 0, 0, 0, -5],
            [-5, 0, 0, 0, 0, 0, 0, -5],
            [-5, 0, 0, 0, 0, 0, 0, -5],
            [-5, 0, 0, 0, 0, 0, 0, -5],
            [-1, 0, 0, 0, 0, 0, 0, -5],
            [-1, -1, -1, -1, -1, -1, -1, -5],
            [-1, -1, -1, -1, -1, -1, -1, -1],
            [-1, 10, 0, 7, 0, 0, 0, -1]
        ];
        if (this.color == AssignedVar.BLACK) {
            this.positions = this.positions.reverse();
        }
        this.currentH_Score = 0;
        this.current_allPossibleMoves = null;
    }
    getClone() {
        let clone = new King(this.color, this.currentPos);
        clone.hasMoved = this.hasMoved;
        clone.posToCastleRook = this.posToCastleRook;
        clone.posToCastle = this.posToCastle;
        clone.currentH_Score = this.currentH_Score;
        return clone;
    }
    getId() {
        this.hasMoved = true;
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    findPosToCastleRook(chessBoard = AssignedVar.currentGame.chessBoard) {
        if (this.hasMoved) return null;
        for (let dir of this.castleDirections) {
            for (let i = -3; i < 4; i += 6) {
                let newPos = this.currentPos.plusVector(dir.multipliByNumber(i));
                let chessPiece;
                if (newPos.isPositionOnTheBoard()) {
                    chessPiece = chessBoard[newPos.x][newPos.y];
                }
                if (chessPiece && chessPiece.name == AssignedVar.EMPTY) break;

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
    findPosToCastle(chessBoard = AssignedVar.currentGame.chessBoard) {
        let pos;
        if (!this.hasMoved && this.findPosToCastleRook(chessBoard)) {
            let dirToRook = this.findPosToCastleRook(chessBoard).plusVector(this.currentPos.multipliByNumber(-1)).convertToDirection();
            for (let i = 1; i <= 2; ++i) {
                pos = this.currentPos.plusVector(dirToRook.multipliByNumber(i));
                if (pos.isPositionHasPiece(chessBoard)) {
                    return null;
                }
            }
            return pos;
        }
        return null;
    }
    getAllPossibleMoves(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            let newMovePos = this.currentPos.plusVector(vector);
            if (newMovePos.isPositionCanAttack(chessBoard, controllingColor)) {
                allMovesPossibleArr.push(newMovePos);
            }
        }
        let castlePos = this.findPosToCastle(chessBoard);
        if (castlePos) {
            this.posToCastle = castlePos;
            if (!this.posToCastle.isPositionHasPiece(chessBoard)) {
                allMovesPossibleArr.push(this.posToCastle);
            } else {
                this.posToCastle = null;
            }
        }
        return allMovesPossibleArr;
    }
}