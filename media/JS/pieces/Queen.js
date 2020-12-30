import Piece from "./Piece.js";
import Vector from "../utility/Vector.js";
import AssignedVar from "../utility/AssignedVar.js";

export default class Queen extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        if (this.color == AssignedVar.BLACK) {
            this.name = AssignedVar.QUEEN_B;
        } else {
            this.name = AssignedVar.QUEEN_W;
        }
        this.id = `${this.name}_${currentPos.convertToId()}`;
        this.directions = [
            new Vector(1, 0), new Vector(0, -1), new Vector(-1, 0), new Vector(0, 1),
            new Vector(1, 1), new Vector(1, -1), new Vector(-1, -1), new Vector(-1, 1)
        ];
        this.weights = 929;
        this.positions = [
            [10, 0, 0, 0, 5, 0, 0, 10],
            [0, 0, 3, 0, 0, 3, 0, 0],
            [0, 0, 1, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [-10, 0, 0, 0, 0, 0, 0, -10],
            [-10, -2, -1, -2, -1, -2, -1, -10],
            [-10, -1, -2, -1, -1, -2, -1, -10],
            [-50, 0, 0, 0, -7, 0, 0, -50]
        ];
        if (this.color == AssignedVar.BLACK) {
            this.positions = this.positions.reverse();
        }
    }
    getClone() {
        return new Queen(this.color, this.currentPos);
    }
    getId() {
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 8; ++i) {
                let newMovePos = this.currentPos.plusVector(vector.multipliByNumber(i));
                if (newMovePos.isPositionCanAttack(chessBoard, controllingColor)) {
                    allMovesPossibleArr.push(newMovePos);
                }
                if (newMovePos.isPositionHasPiece(chessBoard)) {
                    break;
                }
            }
        }
        return allMovesPossibleArr;
    }
}