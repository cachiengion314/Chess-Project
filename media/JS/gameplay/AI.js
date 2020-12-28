import AssignedVar from "../utility/AssignedVar.js";
import ChessBoardInfo from "./ChessBoardInfo.js";
import Empty from "../pieces/Empty.js";
import { mimicOnclickMovePieceAt } from "../initGameBoard.js";
import Visualize from "../utility/Visualize.js";
import PopUp from "../utility/PopUp.js";

let _maxEvaluatedTurn = 3;
let _aiDifficultIndex = 0;
let _aiDifficultArray = [`easy`, `normal`, `hard`,];

export default class AI {
    constructor(chessBoard, controllingColor) {
        this.dedicatedChessBoardInfo = null;
        this.expectedScore = 0;
        let cloneChessBoard = AI.cloneChessBoard(chessBoard);
        let chessBoardInfo = new ChessBoardInfo(cloneChessBoard, null, null, controllingColor);
        this.minimax_evaluating(chessBoardInfo, controllingColor, 0, undefined, undefined, _maxEvaluatedTurn);
    }
    minimax_evaluating(lastChessBoardInfo, controllingColor, countTurn, alpha, beta, maxEvaluatedTurn) {
        countTurn++;
        if (countTurn == maxEvaluatedTurn) {
            return AI.evaluating(lastChessBoardInfo);
        }
        let allPossibleMoves = lastChessBoardInfo.getAllPossibleMoves();
        allPossibleMoves = AI.shuffleArray(allPossibleMoves);
        let optimizedChessBoardInfo, optimizedScore;
        if (controllingColor == AssignedVar.WHITE) {
            controllingColor = AI.changeControllingColor(controllingColor);
            optimizedScore = -Infinity;
            for (let moveObj of allPossibleMoves) {
                let currentChessBoardInfo = this.movePiece(lastChessBoardInfo, moveObj);
                let moveScore = this.minimax_evaluating(currentChessBoardInfo, controllingColor, countTurn, alpha, beta, maxEvaluatedTurn);

                if (moveScore > optimizedScore) {
                    optimizedScore = moveScore;
                    optimizedChessBoardInfo = currentChessBoardInfo;
                    alpha = optimizedScore;
                }
                if (beta && moveScore >= beta) {
                    break;
                }
            }
        } else {
            controllingColor = AI.changeControllingColor(controllingColor);
            optimizedScore = Infinity;
            for (let moveObj of allPossibleMoves) {
                let currentChessBoardInfo = this.movePiece(lastChessBoardInfo, moveObj);
                let moveScore = this.minimax_evaluating(currentChessBoardInfo, controllingColor, countTurn, alpha, beta, maxEvaluatedTurn);

                if (moveScore < optimizedScore) {
                    optimizedScore = moveScore;
                    optimizedChessBoardInfo = currentChessBoardInfo;
                    beta = optimizedScore;
                }
                if (alpha && moveScore <= alpha) {
                    break;
                }
            }
        }
        if (countTurn == 1) {
            this.dedicatedChessBoardInfo = optimizedChessBoardInfo;
            this.expectedScore = optimizedScore;
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
    log() {
        console.log(`----------AI optimized move info----------`);
        Visualize.logInfo(this.dedicatedChessBoardInfo.chessBoard);
        console.log(`The score AI expected when chosen that move:`, this.expectedScore);
        console.log(`----------AI optimized move info----------`);
    }
    static evaluating(chessBoardInfo) {
        let sumWeights = 0;
        let sumPositions = 0;
        for (let x = 0; x < 8; ++x) {
            for (let y = 0; y < 8; ++y) {
                let selectedPiece = chessBoardInfo.chessBoard[x][y];
                if (selectedPiece.color) {
                    if (selectedPiece.color == AssignedVar.WHITE) {
                        sumWeights += selectedPiece.weights;
                        sumPositions += selectedPiece.positions[y][x];
                    } else {
                        sumWeights -= selectedPiece.weights;
                        sumPositions -= selectedPiece.positions[y][x];
                    }
                }
            }
        }
        return sumWeights + sumPositions;
    }
    static move(controllingColor) {
        let aiInstant = new AI(AssignedVar.currentGame.chessBoard, controllingColor);
        let moveObj = aiInstant.dedicatedChessBoardInfo.moveFromParrent;
        let currentPos = moveObj.currentPos;
        let nextPos = moveObj.nextPos;
        mimicOnclickMovePieceAt(currentPos);
        setTimeout(() => {
            mimicOnclickMovePieceAt(nextPos);
            aiInstant.log();
        }, 200);
    }
    static setupMoveFor(controllingColor) {
        if (_maxEvaluatedTurn > 3) {
            setTimeout(() => {
                PopUp.showWait(() => {
                    AI.move(controllingColor);
                    PopUp.closeModal(`#wait-modal`);
                }, `Vui lòng chờ máy tính suy nghĩ!`, 300);
            }, 300);
        } else {
            AI.move(controllingColor);
        }
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
    static shuffleArray(arr) {
        let tempArr = [...arr];
        let rArr = [...arr];
        for (let i = 0; i < arr.length; ++i) {
            let rIndex = Visualize.randomNumberFromAToMax(0, tempArr.length);
            rArr[i] = tempArr[rIndex];
            tempArr = tempArr.filter(item => {
                return item != rArr[i];
            });
        }
        return rArr;
    }
    static getCurrentAI_difficult() {
        return _aiDifficultArray[_aiDifficultIndex];
    }
    static increaseAI_Difficult() {
        _aiDifficultIndex++;
        _maxEvaluatedTurn++;
        if (_maxEvaluatedTurn == 6) {
            _maxEvaluatedTurn = 3;
        }
        if (_aiDifficultIndex == _aiDifficultArray.length) {
            _aiDifficultIndex = 0;
        }
    }
    static displayCurrentAI_difficult($aiBtn) {
        $aiBtn.textContent = `Computer: ${_aiDifficultArray[_aiDifficultIndex]}`;
    }
}