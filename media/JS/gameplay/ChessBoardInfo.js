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
    getAllPossibleMoves() {
        let allPossibleMoves = [];
        for (let x = 0; x < this.chessBoard.length; ++x) {
            for (let y = 0; y < this.chessBoard[x].length; ++y) {
                if (this.chessBoard[x][y].color && this.chessBoard[x][y].color == this.controllingColor) {
                    let selectedPiece = this.chessBoard[x][y];
                    let piece_allPossibleMoves = selectedPiece.getAllPossibleMoves(this.chessBoard, this.controllingColor);
                    for (let pos of piece_allPossibleMoves) {
                        let moveObj = new MoveInfo(selectedPiece.currentPos, pos);

                        moveObj = this.preEvaluatingMove(moveObj);
                        if (moveObj.heuristicScore < 0) continue;

                        allPossibleMoves.push(moveObj);
                    }
                }
            }
        }
        allPossibleMoves.sort((objA, objB) => {
            return objB.heuristicScore - objA.heuristicScore;
        });
        return allPossibleMoves
    }
    preEvaluatingMove(moveObj) {
        let currentPos = moveObj.currentPos;
        let nextPos = moveObj.nextPos;
        let clonedChessBoard = AI.cloneChessBoard(this.chessBoard);
        let selectedPiece = clonedChessBoard[currentPos.x][currentPos.y];
        let unexpectedEnemyPiece = clonedChessBoard[nextPos.x][nextPos.y];

        clonedChessBoard[currentPos.x][currentPos.y] = new Empty(currentPos);
        clonedChessBoard[nextPos.x][nextPos.y] = selectedPiece;
        clonedChessBoard[nextPos.x][nextPos.y].currentPos = nextPos;
        clonedChessBoard[nextPos.x][nextPos.y].id = selectedPiece.getId();

        let foundData = selectedPiece.currentPos.findDangerousPiece(clonedChessBoard, this.controllingColor);
        moveObj.calculateTradingSituation(selectedPiece, unexpectedEnemyPiece, foundData.dangerousEnemies, foundData.protectedFriends);

        return moveObj;
    }
}