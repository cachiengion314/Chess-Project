import AssignedVar from "../utility/AssignedVar.js";
import ChessBoardInfo from "./ChessBoardInfo.js";
import Empty from "../pieces/Empty.js";
import Vector from "../utility/Vector.js";
import { mimicOnclickMovePieceAt } from "../initGameBoard.js";

export default class AI {
    constructor(chessBoard, controllingColor) {
        this.dedicatedChessBoardInfo = null;
        this.boardScore = 0;
        let cloneChessBoard = AI.cloneChessBoard(chessBoard);
        let chessBoardInfo = new ChessBoardInfo(cloneChessBoard, null, null, controllingColor);
        this.minimax_evaluatingPosition(chessBoardInfo, controllingColor, 0);
    }
    minimax_evaluatingPosition(lastChessBoardInfo, controllingColor, countTurn) {
        countTurn++;
        if (countTurn == AI.MAX_EVALUATED_TURN) {
            return AI.evaluatingPosition(lastChessBoardInfo);
        }
        let allPossibleMoves = lastChessBoardInfo.getAllPossibleMoves();
        let optimizedChessBoardInfo, optimizedScore;
        if (controllingColor == AssignedVar.WHITE) {
            controllingColor = AI.changeControllingColor(controllingColor);
            optimizedScore = -Infinity;
            for (let moveObj of allPossibleMoves) {
                let currentChessBoardInfo = this.movePiece(lastChessBoardInfo, moveObj);
                let moveScore = this.minimax_evaluatingPosition(currentChessBoardInfo, controllingColor, countTurn);
                if (moveScore > optimizedScore) {
                    optimizedScore = moveScore;
                    optimizedChessBoardInfo = currentChessBoardInfo;
                }
            }
        } else {
            controllingColor = AI.changeControllingColor(controllingColor);
            optimizedScore = Infinity;
            for (let moveObj of allPossibleMoves) {
                let currentChessBoardInfo = this.movePiece(lastChessBoardInfo, moveObj);
                let moveScore = this.minimax_evaluatingPosition(currentChessBoardInfo, controllingColor, countTurn);
                if (moveScore < optimizedScore) {
                    optimizedScore = moveScore;
                    optimizedChessBoardInfo = currentChessBoardInfo;
                }
            }
        }
        if (countTurn == 1) {
            this.dedicatedChessBoardInfo = optimizedChessBoardInfo;
            this.boardScore = optimizedScore;
            console.log(`boardScore:`, optimizedScore);
        }
        return optimizedScore;
    }
    movePiece(chessBoardInfo, moveObj) {
        let originChessBoard = AI.cloneChessBoard(chessBoardInfo.chessBoard);
        let chessBoard = AI.cloneChessBoard(chessBoardInfo.chessBoard);
        let currentPos = moveObj.currentPos;
        let nextPos = moveObj.nextPos;
        let movedPiece = chessBoard[currentPos.x][currentPos.y];

        chessBoard[currentPos.x][currentPos.y] = new Empty(currentPos);
        chessBoard[nextPos.x][nextPos.y] = movedPiece;
        chessBoard[nextPos.x][nextPos.y].currentPos = nextPos;
        chessBoard[nextPos.x][nextPos.y].id = movedPiece.getId();

        let controllingColor = AI.changeControllingColor(chessBoardInfo.controllingColor);

        let nextChessBoardInfo = new ChessBoardInfo(chessBoard, originChessBoard, moveObj, controllingColor);
        return nextChessBoardInfo;
    }
    static evaluatingPosition(chessBoardInfo) {
        let sumWeights = 0;
        for (let x = 0; x < 8; ++x) {
            for (let y = 0; y < 8; ++y) {
                let selectedPiece = chessBoardInfo.chessBoard[x][y];
                if (selectedPiece.color) {
                    if (selectedPiece.color == AssignedVar.WHITE) {
                        sumWeights += selectedPiece.weights;
                    } else {
                        sumWeights -= selectedPiece.weights;
                    }
                }
            }
        }
        return sumWeights;
    }
    static cloneChessBoard(arr) {
        let cloneArr = [];
        for (let x = 0; x < 8; ++x) {
            cloneArr.push([]);
            for (let y = 0; y < 8; ++y) {
                cloneArr[x].push(arr[x][y].getClone());
            }
        }
        return cloneArr;
    }
    static changeControllingColor(controllingColor) {
        if (controllingColor == AssignedVar.WHITE) {
            return AssignedVar.BLACK;
        }
        return AssignedVar.WHITE;
    }
    static get MAX_EVALUATED_TURN() {
        return 3;
    }
    static move(aiInstants) {
        let moveObj = aiInstants.dedicatedChessBoardInfo.moveFromParrent;
        let currentPos = moveObj.currentPos;
        let nextPos = moveObj.nextPos;
        mimicOnclickMovePieceAt(currentPos);
        mimicOnclickMovePieceAt(nextPos);
    }
}