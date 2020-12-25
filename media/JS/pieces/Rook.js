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
    }
    getClone() {
        return new Rook(this.color, this.currentPos);
    }
    getId() {
        this.hasMoved = true;
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves() {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 8; ++i) {
                let newMovePos = this.currentPos.plusVector(vector.multipliByNumber(i));
                if (newMovePos.isPositionCanAttack()) {
                    allMovesPossibleArr.push(newMovePos);
                }
                if (newMovePos.isPositionHasPiece()) {
                    break;
                }
            }
        }
        return allMovesPossibleArr;
    }
}