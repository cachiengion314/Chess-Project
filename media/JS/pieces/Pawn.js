import Piece from "./Piece.js";
import Vector from "../Vector.js";
import AssignedVar from "../AssignedVar.js";

export default class Pawn extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        if (this.color == AssignedVar.BLACK) {
            this.image = AssignedVar.PAWN_B;
        } else {
            this.image = AssignedVar.PAWN_W;
        }
        this.id = `${this.image}_${currentPos.convertToId()}`;
        this.has2Steps = false;
        let moveDirection = -1;
        if (this.color == AssignedVar.BLACK) {
            moveDirection = 1;
        }
        this.directions = [
            new Vector(0, moveDirection),
        ];
    }
    getId() {
        return `${this.image}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves() {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 2; ++i) {
                let newMovePos = this.currentPos.plusVector(new Vector(vector.x, vector.y).multipliByNumber(i));
                if (!Vector.isPositionHasPiece(newMovePos)) {
                    allMovesPossibleArr.push(newMovePos);
                }
            }
        }
        return allMovesPossibleArr;
    }
}