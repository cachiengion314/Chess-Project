import Piece from "./Piece.js";
import Vector from "../utility/Vector.js";
import AssignedVar from "../utility/AssignedVar.js";

export default class Rook extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        if (this.color == AssignedVar.BLACK) {
            this.name = AssignedVar.ROOK_B;
        } else {
            this.name = AssignedVar.ROOK_W;
        }
        this.id = `${this.name}_${currentPos.convertToId()}`;
        this.directions = [
            new Vector(0, 1), new Vector(1, 0), new Vector(0, -1), new Vector(-1, 0)
        ];
        this.hasMoved = false;
        this.weights = 479;
        this.positions = [
            [5, 0, 0, 0, 0, 0, 0, 5],
            [3, 0, 0, 0, 0, 0, 0, 3],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 2, 0, 0, 2, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 2, 2, 2, 1, 1],
            [-1, 1, 1, 1, 1, 1, 1, -1],
            [-7, 0, 1, 0, 0, 0, 0, -7]
        ];
        if (this.color == AssignedVar.BLACK) {
            this.positions = this.positions.reverse();
        }
        this.possibleMovesScore = 0;
        this.guardians = [];
    }
    getClone() {
        let clone = new Rook(this.color, this.currentPos);
        clone.hasMoved = this.hasMoved;
        return clone;
    }
    getId() {
        this.hasMoved = true;
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        let possibleMoves = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 8; ++i) {
                let newMovePos = this.currentPos.plusVector(vector.multipliByNumber(i));
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