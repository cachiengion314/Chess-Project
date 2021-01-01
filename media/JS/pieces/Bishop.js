import Piece from "./Piece.js";
import Vector from "../utility/Vector.js";
import AssignedVar from "../utility/AssignedVar.js";

export default class Bishop extends Piece {
    constructor(color, currentPos) {
        super(color, currentPos);
        if (this.color == AssignedVar.BLACK) {
            this.name = AssignedVar.BISHOP_B;
        } else {
            this.name = AssignedVar.BISHOP_W;
        }
        this.id = `${this.name}_${currentPos.convertToId()}`;
        this.directions = [
            new Vector(1, 1), new Vector(1, -1), new Vector(-1, -1), new Vector(-1, 1)
        ];
        this.weights = 320;
        this.positions = [
            [-50, -10, -10, -10, -10, -10, -10, -50],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [-10, -1, -7, -10, -10, -7, -1, -10]
        ];
        if (this.color == AssignedVar.BLACK) {
            this.positions = this.positions.reverse();
        }
        this.currentH_Score = 0;
    }
    getHeuristicScore(clonedChessBoard) {
        let heuristicValue = 0;
        let threatPostionValue = 0;
        let bonusPositionValue = 0;
        let positionsValue = this.positions[this.currentPos.y][this.currentPos.x];

        let selectedPiece_allPossibleMoves = this.getAllPossibleMoves(clonedChessBoard, this.color);
        for (let pos of selectedPiece_allPossibleMoves) {
            if (pos.isPositionCanAttack(clonedChessBoard, this.color)) {
                if (pos.isPositionHasPiece(clonedChessBoard)) {
                    let enemyPiece = clonedChessBoard[pos.x][pos.y];
                    threatPostionValue += Math.floor(enemyPiece.weights * .1);
                }
                if (bonusPositionValue < 9) {
                    bonusPositionValue++;
                }
            }
        }
        heuristicValue = threatPostionValue + bonusPositionValue + positionsValue;
        return heuristicValue;
    }
    getClone() {
        let clone = new Bishop(this.color, this.currentPos);
        clone.currentH_Score = this.currentH_Score;
        return clone;
    }
    getId() {
        return `${this.name}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        let allMovesPossibleArr = [];
        for (let vector of this.directions) {
            for (let i = 1; i < 8; ++i) {
                let newMovePos = this.currentPos.plusVector(vector.multipliByNumber(i));
                if (newMovePos.isPositionCanAttack(chessBoard, controllingColor)) {
                    allMovesPossibleArr.push(newMovePos);
                }
                if (newMovePos.isPositionHasPiece(chessBoard)) {
                    break;
                }
            }
        }
        return allMovesPossibleArr;
    }
}