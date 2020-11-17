import Piece from "./Piece.js";
import Vector from "../utility/Vector.js";
import AssignedVar from "../utility/AssignedVar.js";

export default class Pawn extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        if (this.color == AssignedVar.BLACK) {
            this.name = AssignedVar.PAWN_B;
        } else {
            this.name = AssignedVar.PAWN_W;
        }
        this.id = `${this.name}_${currentPos.convertToId()}`;
        this.hasMoved = false;
        let moveDirection = -1;
        if (this.color == AssignedVar.BLACK) {
            moveDirection = 1;
        }
        this.directions = [
            new Vector(0, moveDirection),
        ];
        this.specialAttackDirections = [
            new Vector(-1, 0).plusVector(new Vector(0, moveDirection)),
            new Vector(1, 0).plusVector(new Vector(0, moveDirection)),
        ];
    }
    getId() {
        this.hasMoved = true;
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves() {
        let allMovesPossibleArr = [];
        let maxStep = 2;
        if (this.hasMoved) {
            maxStep = 1;
        }
        for (let vector of this.directions) {
            for (let i = 1; i <= maxStep; ++i) {
                let newMovePos = this.currentPos.plusVector(vector.multipliByNumber(i));
                if (!newMovePos.isPositionHasPiece()) {
                    allMovesPossibleArr.push(newMovePos);
                }
            }
        }
        this.specialAttackDirections.forEach(pos => {
            let atkPos = this.currentPos.plusVector(pos);
            if (atkPos.isPositionHasPiece() && atkPos.isPositionCanAttack()) {
                allMovesPossibleArr.push(atkPos);
            }
        });
        return allMovesPossibleArr;
    }
}