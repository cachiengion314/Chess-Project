import Piece from "./Piece.js";
import Vector from "../Vector.js";
import AssignedVar from "../AssignedVar.js";

export default class Knight extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        this.name = `${color}_${AssignedVar.knightStr}_${currentPos.convertToId()}`;
        if (this.color == AssignedVar.blackStr) {
            this.image = AssignedVar.blackKnightImg;
        } else {
            this.image = AssignedVar.whiteKnightImg;
        }
        this.directions = [
            new Vector(2, 1), new Vector(1, 2),
            new Vector(-1, 2), new Vector(-2, 1), new Vector(-2, -1),
            new Vector(-1, -2), new Vector(1, -2), new Vector(2, -1)
        ];
    }
    getAllPossibleMoves() {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 2; ++i) {
                let newMovePos = this.currentPos.plusVector(new Vector(vector.xPos, vector.yPos).multipliByNumber(i));
                if (Vector.isPositionCanAttack(newMovePos)) {
                    allMovesPossibleArr.push(newMovePos);
                }
            }
        }
        return allMovesPossibleArr;
    }
}