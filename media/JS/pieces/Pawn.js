import Piece from "./Piece.js";
import Vector from "../Vector.js";
import AssignedVar from "../AssignedVar.js";

export default class Pawn extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        this.name = `${color}_${AssignedVar.pawnnStr}_${currentPos.convertToId()}`;
        if (this.color == AssignedVar.blackStr) {
            this.image = AssignedVar.blackPawnImg;
        } else {
            this.image = AssignedVar.whitePawnImg;
        }
        this.has2Steps = false;
        let moveDirection = -1;
        if (this.color == AssignedVar.blackStr) {
            moveDirection = 1;
        }
        this.directions = [
            new Vector(0, moveDirection),
        ];
    }
    getAllPossibleMoves() {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 2; ++i) {
                let newMovePos = this.currentPos.plusVector(new Vector(vector.xPos, vector.yPos).multipliByNumber(i));
                if (!Vector.isPositionHasPiece(newMovePos)) {
                    allMovesPossibleArr.push(newMovePos);
                }
            }
        }
        return allMovesPossibleArr;
    }
}