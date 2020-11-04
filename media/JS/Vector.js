import AssignedVar from "./AssignedVar.js";

export default class Vector {
    constructor(xPos = 0, yPos = 0) {
        this.xPos = xPos;
        this.yPos = yPos;
    }
    plusVector(vector2) {
        return new Vector(this.xPos + vector2.xPos, this.yPos + vector2.yPos);
    }
    multipliByNumber(num) {
        return new Vector(this.xPos * num, this.yPos * num);
    }
    isEqualTo(vector) {
        if (this.xPos == vector.xPos && this.yPos == vector.yPos) {
            return true
        } else {
            return false;
        }
    }
    convertToId() {
        return `${this.xPos}_${this.yPos}`;
    }
    static convertIdToVector(strId) {
        let arr = strId.split(`_`);
        return new Vector(arr[0], arr[1]);
    }
    static isPositionOnTheBoard(vector) {
        if (vector.xPos < 0 || vector.yPos < 0 ||
            vector.xPos > 7 || vector.yPos > 7) {
            return false;
        } else
            return true;
    }
    static isPositionHasPiece(vector) {
        if (Vector.isPositionOnTheBoard(vector)) {
            let piece = AssignedVar.chessBoard[vector.xPos][vector.yPos];
            if (piece.type == AssignedVar.pieceStr) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    static isPositionCanAttack(vector) {
        if (!AssignedVar.currentPlayer || !Vector.isPositionOnTheBoard(vector)) return false;
        if (Vector.isPositionHasPiece(vector)) {
            let piece = AssignedVar.chessBoard[vector.xPos][vector.yPos];
            if (piece.controlByPlayer.id == AssignedVar.currentPlayer.id) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }
}