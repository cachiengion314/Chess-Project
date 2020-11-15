import Piece from "./Piece.js";
import Vector from "../Vector.js";
import AssignedVar from "../AssignedVar.js";

export default class Knight extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        if (this.color == AssignedVar.BLACK) {
            this.image = AssignedVar.KNIGHT_B;
        } else {
            this.image = AssignedVar.KNIGHT_W;
        }
        this.id = `${this.image}_${currentPos.convertToId()}`;
        this.directions = [
            new Vector(2, 1), new Vector(1, 2),
            new Vector(-1, 2), new Vector(-2, 1), new Vector(-2, -1),
            new Vector(-1, -2), new Vector(1, -2), new Vector(2, -1)
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
                if (Vector.isPositionCanAttack(newMovePos)) {
                    allMovesPossibleArr.push(newMovePos);
                }
            }
        }
        // console.log(`allMovesPossibleArr:`, allMovesPossibleArr);
        return allMovesPossibleArr;
    }
}