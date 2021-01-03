import AssignedVar from "../utility/AssignedVar.js";
import ChessBoardInfo from "./ChessBoardInfo.js";
import Empty from "../pieces/Empty.js";
import { mimicOnclickMovePieceAt } from "../initGameBoard.js";
import Visualize from "../utility/Visualize.js";
import PopUp from "../utility/PopUp.js";

const _MAX_EVALUATED_POSSIBLE_TURN = 6;
const _MIN_EVALUATED_POSSIBLE_TURN = 3;
let _maxEvaluatedTurn = 3;
let _aiDifficultIndex = 0;
let _aiDifficultArray = [`easy`, `normal`, `hard`, `crazy`];

export default class AI {
    constructor(chessBoard, controllingColor) {
        this.evaluating_chessBoardInfo = null;
        this.evaluating_boardScore = 0;
        let cloneChessBoard = AI.cloneChessBoard(chessBoard);
        let chessBoardInfo = new ChessBoardInfo(cloneChessBoard, null, null, controllingColor);
        let timeConsume = AI.measureExecutionTime(() => {
            this.minimax_evaluating(chessBoardInfo, controllingColor, 0, undefined, undefined, _maxEvaluatedTurn);
        });
        console.log(`timeConsume:`, timeConsume);
    }
    minimax_evaluating(lastChessBoardInfo, controllingColor, countTurn, alpha, beta, maxEvaluatedTurn) {
        countTurn++;
        lastChessBoardInfo.isAtTurn = countTurn;
        if (countTurn == maxEvaluatedTurn) {
            return AI.evaluating(lastChessBoardInfo);
        }

        let friends_allPossibleMoves = lastChessBoardInfo.getFriends_allPossibleMoves();

        let optimizedChessBoardInfo, optimizedScore;
        if (controllingColor == AssignedVar.WHITE) {
            controllingColor = AI.changeControllingColor(controllingColor);
            optimizedScore = -Infinity;
            for (let moveObj of friends_allPossibleMoves) {
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
            for (let moveObj of friends_allPossibleMoves) {
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
            this.evaluating_chessBoardInfo = optimizedChessBoardInfo;
            this.evaluating_boardScore = optimizedScore;
            // console.log(`turn 1 - friends_allPossibleMoves`, friends_allPossibleMoves);
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
        chessBoard[nextPos.x][nextPos.y].possibleMovesScore += Math.floor(moveObj.moveScore * .01);

        let controllingColor = AI.changeControllingColor(chessBoardInfo.controllingColor);

        let nextChessBoardInfo = new ChessBoardInfo(chessBoard, originChessBoard, moveObj, controllingColor);
        return nextChessBoardInfo;
    }
    log() {
        console.log(`----------AI optimized move info----------`);
        Visualize.logInfo(this.evaluating_chessBoardInfo.chessBoard);
        console.log(`The board score AI expected when chosen that move:`, this.evaluating_boardScore);
        console.log(`------------------------------------------`);
        // for (let x = 0; x < 8; ++x) {
        //     for (let y = 0; y < 8; ++y) {
        //         let piece = this.evaluating_chessBoardInfo.chessBoard[x][y];
        //         if (piece.color) {
        //             console.log(`piece.guardians:`, piece.id, piece.guardians);
        //         }
        //     }
        // }
    }
    static evaluating(chessBoardInfo) {
        let sumWeights = 0;
        let sumPos = 0;
        let sumHeuristic = 0;
        for (let x = 0; x < 8; ++x) {
            for (let y = 0; y < 8; ++y) {
                let selectedPiece = chessBoardInfo.chessBoard[x][y];
                if (selectedPiece.color) {
                    if (selectedPiece.color == AssignedVar.WHITE) {
                        sumWeights += selectedPiece.weights;
                        sumPos += selectedPiece.positions[y][x];
                        sumHeuristic += selectedPiece.getPossibleMovesScore();
                    } else {
                        sumWeights -= selectedPiece.weights;
                        sumPos -= selectedPiece.positions[y][x];
                        sumHeuristic -= selectedPiece.getPossibleMovesScore();
                    }
                }
            }
        }
        return sumWeights + sumPos + sumHeuristic;
    }
    static move(controllingColor) {
        let aiInstant = new AI(AssignedVar.currentGame.chessBoard, controllingColor);
        let moveObj = aiInstant.evaluating_chessBoardInfo.moveFromParrent;
        let currentPos = moveObj.currentPos;
        let nextPos = moveObj.nextPos;
        mimicOnclickMovePieceAt(currentPos);
        setTimeout(() => {
            mimicOnclickMovePieceAt(nextPos);
            aiInstant.log();
        }, 200);
    }
    static setupMoveFor(controllingColor) {
        if (_maxEvaluatedTurn > 2) {
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
    static getCurrentAI_difficult() {
        return _aiDifficultArray[_aiDifficultIndex];
    }
    static increaseAI_Difficult() {
        _aiDifficultIndex++;
        _maxEvaluatedTurn++;
        if (_maxEvaluatedTurn == _MAX_EVALUATED_POSSIBLE_TURN + 1) {
            _maxEvaluatedTurn = _MIN_EVALUATED_POSSIBLE_TURN;
        }
        if (_aiDifficultIndex == _aiDifficultArray.length) {
            _aiDifficultIndex = 0;
        }
    }
    static displayCurrentAI_difficult($aiBtn) {
        $aiBtn.textContent = `Computer: ${_aiDifficultArray[_aiDifficultIndex]}`;
    }

    static measureExecutionTime(callback) {
        let startTimer = window.performance.now();
        callback();
        let endTimer = window.performance.now();
        return endTimer - startTimer;
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
}