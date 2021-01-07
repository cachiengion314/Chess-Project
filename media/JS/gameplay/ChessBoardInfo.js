import AssignedVar from "../utility/AssignedVar.js";
import AI from "./AI.js";
import MoveInfo from "./MoveInfo.js";
import Visualize from "../utility/Visualize.js";
import Utility from "../utility/Utility.js";

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
      
        for (let x = 0; x < this.chessBoard.length; ++x) {
            for (let y = 0; y < this.chessBoard[x].length; ++y) {
                let selectedPiece = this.chessBoard[x][y];
                if (selectedPiece.getWeights() > 0) {
                    if (selectedPiece.color == this.controllingColor) {
                        let friend_allPossibleMoves = selectedPiece.getAllPossibleMoves(this.chessBoard, this.controllingColor);
                        for (let f_pos of friend_allPossibleMoves) {
                            let moveObj = new MoveInfo(selectedPiece, selectedPiece.currentPos, f_pos);
                            friends_allPossibleMoves.push(moveObj);
                        }
                    }
                }
            }
        }
        for (let moveObj of friends_allPossibleMoves) {
            moveObj.preEvaluatingCapturedScore(this.chessBoard, friends_allPossibleMoves);
        }
        friends_allPossibleMoves.sort((objA, objB) => {
            if (objB.capturedScore == objA.capturedScore) {
                if (Utility.randomFromAToMax(0, 2)) {
                    return -1;
                }
                return 1;
            }
            return objB.capturedScore - objA.capturedScore;
        });

        return friends_allPossibleMoves
    }
}