import Piece from "./Piece.js";
import Vector from "../utility/Vector.js";
import AssignedVar from "../utility/AssignedVar.js";

export default class Bishop extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        if (this.color == AssignedVar.BLACK) {
            this.name = AssignedVar.BISHOP_B;
        } else {
            this.name = AssignedVar.BISHOP_W;
        }
        this.id = `${this.name}_${currentPos.convertToId()}`;
        this.directions = [
            new Vector(1, 1), new Vector(1, -1), new Vector(-1, -1), new Vector(-1, 1)
        ];
        this.weights = 320;
        this.positions = [
            [-50, -10, -10, -10, -10, -10, -10, -50],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [-10, -1, -7, -10, -10, -7, -1, -10]
        ];
        if (this.color == AssignedVar.BLACK) {
            this.positions = this.positions.reverse();
        }
        this.possibleMovesScore = 0;
        this.guardians = [];
    }
    getClone() {
        let clone = new Bishop(this.color, this.currentPos);
        clone.possibleMovesScore = this.possibleMovesScore;
        return clone;
    }
    getId() {
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        let possibleMoves = [];
        for (let dir of this.directions) {
            for (let i = 1; i < 8; ++i) {
                let newMovePos = this.currentPos.plusVector(dir.multipliByNumber(i));
                if (newMovePos.isPositionCanAttack(chessBoard, controllingColor)) {
                    possibleMoves.push(newMovePos);
                }
                if (newMovePos.isPositionHasPiece(chessBoard)) {
                    let protectedPiece = chessBoard[newMovePos.x][newMovePos.y];
                    if (protectedPiece.color == controllingColor) {
                        protectedPiece.guardians.push(this);
                    }
                    break;
                }
            }
        }
        this.possibleMovesScore = possibleMoves.length;
        return possibleMoves;
    }
}