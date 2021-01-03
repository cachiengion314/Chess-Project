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
            [829, 829, 829, 829, 829, 829, 829, 829],
            [100, 100, 100, 100, 100, 100, 100, 100],
            [35, 35, 35, 35, 35, 35, 35, 35],
            [18, 18, 16, 19, 17, 18, 20, 20],
            [18, 18, 16, 19, 17, 18, 20, 20],
            [3, 13, 7, 14, 7, 7, 15, 3],
            [-7, -7, -7, -7, -7, -7, -7, -7],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        if (this.color == AssignedVar.BLACK) {
            this.positions = this.positions.reverse();
        }
        this.possibleMovesScore = 1;
        this.guardians = [];
    }
    checkCapturedPositionAt(pos) {
        for (let dir of this.specialAttackDirections) {
            let atkPos = this.currentPos.plusVector(dir);
            if (atkPos.isEqualTo(pos)) {
                return true;
            }
        }
        return false;
    }
    getClone() {
        let clone = new Pawn(this.color, this.currentPos);
        // clone.currentH_Score = this.currentH_Score;
        clone.hasMoved = this.hasMoved;
        return clone;
    }
    getId() {
        this.hasMoved = true;
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    getAtkPosOnly(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        let allAtkPos = [];
        this.specialAttackDirections.forEach(pos => {
            let atkPos = this.currentPos.plusVector(pos);
            if (atkPos.isPositionCanAttack(chessBoard, controllingColor)) {
                allAtkPos.push(atkPos);
            }
        });
        return allAtkPos;
    }
    getAllPossibleMoves(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        let possibleMoves = [];
        let maxStep = 2;
        if (this.hasMoved) {
            maxStep = 1;
        }
        let dir = this.directions[0];
        for (let i = 1; i <= maxStep; ++i) {
            let newMovePos = this.currentPos.plusVector(dir.multipliByNumber(i));
            if (!newMovePos.isPositionHasPiece(chessBoard)) {
                possibleMoves.push(newMovePos);
            } else {
                break;
            }
        }

        this.specialAttackDirections.forEach(pos => {
            let atkPos = this.currentPos.plusVector(pos);
            if (atkPos.isPositionHasPiece(chessBoard) && atkPos.isPositionCanAttack(chessBoard, controllingColor)) {
                possibleMoves.push(atkPos);
            }
        });
        return possibleMoves;
    }
}