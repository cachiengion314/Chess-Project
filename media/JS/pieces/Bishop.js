import Piece from "./Piece.js";
import Vector from "../Vector.js";
import AssignedVar from "../AssignedVar.js";

export default class Bishop extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        this.name = `${color}_${AssignedVar.bishopStr}_${currentPos.convertToId()}`;
        if (this.color == AssignedVar.blackStr) {
            this.image = AssignedVar.blackBishopImg;
        } else {
            this.image = AssignedVar.whiteBishopImg;
        }
        this.directions = [
            new Vector(1, 1), new Vector(1, -1), new Vector(-1, -1), new Vector(-1, 1)
        ];
    }
    getAllPossibleMoves() {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 8; ++i) {
                let newMovePos = this.currentPos.plusVector(new Vector(vector.xPos, vector.yPos).multipliByNumber(i));
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