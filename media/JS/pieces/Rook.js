import Piece from "./Piece.js";
import Vector from "../Vector.js";
import AssignedVar from "../AssignedVar.js";

export default class Rook extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        if (this.color == AssignedVar.BLACK) {
            this.image = AssignedVar.ROOK_B;
        } else {
            this.image = AssignedVar.ROOK_W;
        }
        this.id = `${this.image}_${currentPos.convertToId()}`;
        this.directions = [
            new Vector(0, 1), new Vector(1, 0), new Vector(0, -1), new Vector(-1, 0)
        ];
    }
    getId() {
        return `${this.image}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves() {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 8; ++i) {
                let newMovePos = this.currentPos.plusVector(new Vector(vector.x, vector.y).multipliByNumber(i));
                if (Vector.isPositionCanAttack(newMovePos)) {
                    allMovesPossibleArr.push(newMovePos);
                }
                if (Vector.isPositionHasPiece(newMovePos)) {
                    break;
                }
            }
        }
        return allMovesPossibleArr;
    }
}