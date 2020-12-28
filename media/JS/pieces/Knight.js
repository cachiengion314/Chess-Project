import Piece from "./Piece.js";
import Vector from "../utility/Vector.js";
import AssignedVar from "../utility/AssignedVar.js";

export default class Knight extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        if (this.color == AssignedVar.BLACK) {
            this.name = AssignedVar.KNIGHT_B;
        } else {
            this.name = AssignedVar.KNIGHT_W;
        }
        this.id = `${this.name}_${currentPos.convertToId()}`;
        this.directions = [
            new Vector(2, 1), new Vector(1, 2),
            new Vector(-1, 2), new Vector(-2, 1),
            new Vector(-2, -1), new Vector(-1, -2),
            new Vector(1, -2), new Vector(2, -1)
        ];
        this.weights = 280;
        this.positions = [
            [-50, 0, 0, 0, 0, 0, 0, -50],
            [0, 0, 10, 0, 0, 0, 0, 0],
            [0, 0, 0, 10, 1, 1, 0, 0],
            [0, 0, 3, 1, 1, 2, 0, 0],
            [-10, 0, 1, 2, 1, 2, 0, -10],
            [1, 0, 2, 2, 2, 2, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [-50, -1, -1, -1, -1, -1, -1, -50]
        ];
        if (this.color == AssignedVar.BLACK) {
            this.positions = this.positions.reverse();
        }
    }
    getClone() {
        return new Knight(this.color, this.currentPos);
    }
    getId() {
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 2; ++i) {
                let newMovePos = this.currentPos.plusVector(vector.multipliByNumber(i));
                if (newMovePos.isPositionCanAttack(chessBoard, controllingColor)) {
                    allMovesPossibleArr.push(newMovePos);
                }
            }
        }
        return allMovesPossibleArr;
    }
}