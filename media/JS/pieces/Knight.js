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
        this.weights = 320;
        this.positions = [
            [-50, 0, 0, 0, 0, 0, 0, -50],
            [0, 0, 4, 0, 0, 4, 0, 0],
            [0, 0, 3, 3, 3, 3, 0, 0],
            [0, 0, 3, 2, 2, 3, 0, 0],
            [0, 0, 1, 2, 1, 2, 0, 0],
            [0, 0, 2, 2, 2, 2, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [-50, -7, -1, -1, -1, -1, -7, -50]
        ];
        if (this.color == AssignedVar.BLACK) {
            this.positions = this.positions.reverse();
        }
        this.currentH_Score = 0;
        this.current_allPossibleMoves = null;
    }
    getClone() {
        let clone = new Knight(this.color, this.currentPos);
        clone.currentH_Score = this.currentH_Score;
        return clone;
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