import AssignedVar from "../utility/AssignedVar.js";
import AI from "./AI.js";
import MoveInfo from "./MoveInfo.js";
import Empty from "../pieces/Empty.js";

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
        let enemies_allPossibleMoves = [];
        let oppositeColor = AI.changeControllingColor(this.controllingColor);
        for (let x = 0; x < this.chessBoard.length; ++x) {
            for (let y = 0; y < this.chessBoard[x].length; ++y) {
                let selectedPiece = this.chessBoard[x][y];
                if (selectedPiece.color) {
                    if (selectedPiece.color == this.controllingColor) {
                        let friend_allPossibleMoves = selectedPiece.getAllPossibleMoves(this.chessBoard, this.controllingColor);
                        for (let f_pos of friend_allPossibleMoves) {
                            let moveObj = new MoveInfo(selectedPiece, selectedPiece.currentPos, f_pos);
                            friends_allPossibleMoves.push(moveObj);
                        }
                    } else {
                        let enemy_allPossibleMoves = selectedPiece.getAllPossibleMoves(this.chessBoard, oppositeColor);
                        for (let e_pos of enemy_allPossibleMoves) {
                            let moveObj = new MoveInfo(selectedPiece, selectedPiece.currentPos, e_pos);
                            enemies_allPossibleMoves.push(moveObj);
                        }
                    }
                }
            }
        }
        for (let moveObj of friends_allPossibleMoves) {
            moveObj.preEvaluatingMoveScore(this.chessBoard, friends_allPossibleMoves, enemies_allPossibleMoves);
        }
        friends_allPossibleMoves.sort((objA, objB) => {
            return objB.moveScore - objA.moveScore;
        });
        return friends_allPossibleMoves
    }
}