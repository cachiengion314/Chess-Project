import AssignedVar from "../utility/AssignedVar.js";
import AI from "./AI.js";
import MoveInfo from "./MoveInfo.js";
import Visualize from "../utility/Visualize.js";

export default class ChessBoardInfo {
    constructor(clonedChessBoard, parrent, moveFromParrent, controllingColor) {
        this.chessBoard = clonedChessBoard;
        this.parrent = parrent;
        this.isAtTurn = null;
        this.moveFromParrent = moveFromParrent;
        this.controllingColor = controllingColor;
    }
    getFriends_allPossibleMoves() {
        let friends_allPossibleMoves = [];
        let enemies_atkPosOnly = [];
        let oppositeColor = AI.changeControllingColor(this.controllingColor);
        for (let x = 0; x < this.chessBoard.length; ++x) {
            for (let y = 0; y < this.chessBoard[x].length; ++y) {
                let selectedPiece = this.chessBoard[x][y];
                if (selectedPiece.weights > 0) {
                    if (selectedPiece.color == this.controllingColor) {
                        let friend_allPossibleMoves = selectedPiece.getAllPossibleMoves(this.chessBoard, this.controllingColor);
                        for (let f_pos of friend_allPossibleMoves) {
                            let moveObj = new MoveInfo(selectedPiece, selectedPiece.currentPos, f_pos);
                            friends_allPossibleMoves.push(moveObj);
                        }
                    } else {
                        let enemy_atkPosOnlyArr = selectedPiece.getAtkPosOnly(this.chessBoard, oppositeColor);
                        for (let e_pos of enemy_atkPosOnlyArr) {
                            let moveObj = new MoveInfo(selectedPiece, selectedPiece.currentPos, e_pos);
                            enemies_atkPosOnly.push(moveObj);
                        }
                    }
                }
            }
        }
        for (let moveObj of friends_allPossibleMoves) {
            moveObj.preEvaluatingMoveScore(this.chessBoard, friends_allPossibleMoves, enemies_atkPosOnly);
        }
        friends_allPossibleMoves.sort((objA, objB) => {
            if (objB.moveScore == objA.moveScore) {
                if (Visualize.randomNumberFromAToMax(0, 2)) {
                    return -1;
                }
                return 1;
            }
            return objB.moveScore - objA.moveScore;
        });

        return friends_allPossibleMoves
    }
}