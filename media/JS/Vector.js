import AssignedVar from "./AssignedVar.js";

export default class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    plusVector(vector2) {
        return new Vector(this.x + vector2.x, this.y + vector2.y);
    }
    multipliByNumber(num) {
        return new Vector(this.x * num, this.y * num);
    }
    isEqualTo(vector) {
        if (this.x == vector.x && this.y == vector.y) {
            return true
        } else {
            return false;
        }
    }
    isXYUniform() {
        if (this.x % 2 == 0 && this.y % 2 == 0 || this.x % 2 != 0 && this.y % 2 != 0) {
            return true;
        } else {
            return false;
        }
    }
    convertToId() {
        return `${this.x}_${this.y}`;
    }
    convertToPercentPosition() {
        let positionObject = {
            left: `${this.x * 12.5}%`,
            top: `${this.y * 12.5}%`,
        };
        return positionObject;
    }
    static convertIdToVector(id) {
        let numbers = id.split(`_`);
        numbers = numbers.map(item => {
            return Number(item);
        });
        return new Vector(numbers[numbers.length - 2], numbers[numbers.length - 1]);
    }
    static isPositionOnTheBoard(vector) {
        if (vector.x < 0 || vector.y < 0 ||
            vector.x > 7 || vector.y > 7) {
            return false;
        } else
            return true;
    }
    static isPositionHasPiece(vector) {
        if (Vector.isPositionOnTheBoard(vector)) {
            let piece = AssignedVar.chessBoard[vector.x][vector.y];
            if (piece.type == AssignedVar.PIECE) {
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
            let piece = AssignedVar.chessBoard[vector.x][vector.y];
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