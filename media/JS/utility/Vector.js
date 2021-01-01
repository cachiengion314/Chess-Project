import AssignedVar from "./AssignedVar.js";
import Visualize from "./Visualize.js";
import AI from "../gameplay/AI.js";

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
        }
        return false;
    }
    isXYUniform() {
        if (this.x % 2 == 0 && this.y % 2 == 0 || this.x % 2 != 0 && this.y % 2 != 0) {
            return true;
        }
        return false;
    }
    isBoardLastLine() {
        if (this.y == 7 || this.y == 0) {
            return true;
        }
        return false;
    }
    isPositionInLegalMoves() {
        let isPosInLegalMovess = AssignedVar.legalMovesOfSelectedPiece.filter((vector) => {
            return vector.isEqualTo(this);
        });
        if (isPosInLegalMovess.length > 0) {
            return true;
        }
        return false;
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
    convertToDirection() {
        let a = Math.abs(this.x);
        let b = Math.abs(this.y);
        let slot1 = a / b;
        let slot2 = 1;
        if (a > b) {
            slot1 = 1;
            slot2 = b / a;
        } else {
            slot1 = a / b;
            slot2 = 1;
        }
        if (this.x < 0) {
            slot1 = -slot1;
        }
        if (this.y < 0) {
            slot2 = -slot2;
        }
        return new Vector(slot1, slot2);
    }
    isPositionOnTheBoard() {
        if (this.x < 0 || this.y < 0 ||
            this.x > 7 || this.y > 7) {
            return false;
        }
        return true;
    }
    isPositionHasPiece(chessBoard = AssignedVar.currentGame.chessBoard) {
        if (this.isPositionOnTheBoard()) {
            let piece = chessBoard[this.x][this.y];
            if (piece.type == AssignedVar.PIECE) {
                return true;
            }
            return false;
        }
        return false;
    }
    isPositionCanAttack(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        if (!AssignedVar.currentGame.currentPlayer || !this.isPositionOnTheBoard()) return false;
        if (this.isPositionHasPiece(chessBoard)) {
            let piece = chessBoard[this.x][this.y];
            if (piece.color == controllingColor) {
                return false;
            }
            return true;
        }
        return true;
    }
    findDangerousPiece(clonedChessBoard, controllingColor) {
        let dangerousEnemies = [];
        let protectedFriends = [];
        let oppositeControllingColor = AI.changeControllingColor(controllingColor);
        for (let x = 0; x < 8; ++x) {
            for (let y = 0; y < 8; ++y) {
                let piece = clonedChessBoard[x][y];
                if (piece.color) {
                    if (piece.color == oppositeControllingColor) {
                        let isPieceDangerous = false;
                        let e_piece_allPossibleMoves = piece.getAllPossibleMoves(clonedChessBoard, oppositeControllingColor);
                        for (let e_pos of e_piece_allPossibleMoves) {
                            if (e_pos.isEqualTo(this)) {
                                isPieceDangerous = true;
                                break;
                            }
                        }
                        if (isPieceDangerous) {
                            dangerousEnemies.push(piece);
                        }
                    } else {
                        let isProtected = false;
                        let f_piece_allPossibleMoves = piece.getAllPossibleMoves(clonedChessBoard, oppositeControllingColor);
                        for (let f_pos of f_piece_allPossibleMoves) {
                            if (f_pos.isEqualTo(this)) {
                                isProtected = true;
                                break;
                            }
                        }
                        if (isProtected) {
                            protectedFriends.push(piece);
                        }
                    }
                }

            }
        }
        let foundData = {
            "dangerousEnemies": dangerousEnemies,
            "protectedFriends": protectedFriends,
        }
        return foundData;
    }
    static createRandomDirection() {
        let rX = Visualize.randomNumberFromAToMax(-1, 2);
        let rY = Visualize.randomNumberFromAToMax(-1, 2);
        if (rX == 0 && rY == 0) {
            return Vector.createRandomDirection();
        }
        return new Vector(rX, rY);
    }
    static convertIdToVector(id) {
        let numbers = id.split(`_`);
        numbers = numbers.map(item => {
            return Number(item);
        });
        return new Vector(numbers[numbers.length - 2], numbers[numbers.length - 1]);
    }
}