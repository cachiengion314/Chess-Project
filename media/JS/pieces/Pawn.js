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
        this.weights = 100;
        this.positions = [
            [100, 100, 100, 100, 100, 100, 100, 100],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [0, 3, 3, 3, 3, 3, 3, 0],
            [0, 3, 2, 1, 1, 1, 3, 0],
            [-1, 1, 1, 1, 1, 2, 2, -1],
            [1, 3, 0, 3, 0, 0, 3, 1],
            [-7, -7, -7, -7, -7, -7, -7, -7],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        if (this.color == AssignedVar.BLACK) {
            this.positions = this.positions.reverse();
        }
    }
    getClone() {
        let clonePawn = new Pawn(this.color, this.currentPos);
        clonePawn.hasMoved = this.hasMoved;
        return clonePawn;
    }
    getId() {
        this.hasMoved = true;
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        let allMovesPossibleArr = [];
        let maxStep = 2;
        if (this.hasMoved) {
            maxStep = 1;
        }
        for (let vector of this.directions) {
            for (let i = 1; i <= maxStep; ++i) {
                let newMovePos = this.currentPos.plusVector(vector.multipliByNumber(i));
                if (!newMovePos.isPositionHasPiece(chessBoard)) {
                    allMovesPossibleArr.push(newMovePos);
                } else {
                    break;
                }
            }
        }
        this.specialAttackDirections.forEach(pos => {
            let atkPos = this.currentPos.plusVector(pos);
            if (atkPos.isPositionHasPiece(chessBoard) && atkPos.isPositionCanAttack(chessBoard, controllingColor)) {
                allMovesPossibleArr.push(atkPos);
            }
        });
        return allMovesPossibleArr;
    }
}