import AssignedVar from "../utility/AssignedVar.js";
import AI from "./AI.js";
import MoveInfo from "./MoveInfo.js";

export default class ChessBoardInfo {
    constructor(clonedChessBoard, parrent, moveFromParrent, controllingColor) {
        this.chessBoard = clonedChessBoard;
        this.parrent = parrent;
        this.moveFromParrent = moveFromParrent;
        this.controllingColor = controllingColor;
    }
    getAllPossibleMoves() {
        let allPossibleMoves = [];
        for (let x = 0; x < this.chessBoard.length; ++x) {
            for (let y = 0; y < this.chessBoard[x].length; ++y) {
                if (this.chessBoard[x][y].color && this.chessBoard[x][y].color == this.controllingColor) {
                    let selectedPiece = this.chessBoard[x][y];
                    let piece_allPossibleMoves = selectedPiece.getAllPossibleMoves();
                    for (let pos of piece_allPossibleMoves) {
                        let moveObj = new MoveInfo(selectedPiece.currentPos, pos);
                        allPossibleMoves.push(moveObj);
                    }
                }
            }
        }
        return allPossibleMoves
    }
    getTurnNumber() {
        return this.getTracingPath().length - 1;
    }
    getTracingPath() {
        let tracingPath = [];
        let tempChessBoard = this.parrent;
        tracingPath.push(this.chessBoard, tempChessBoard);
        while (tempChessBoard) {
            tempChessBoard = tempChessBoard.parrent;
            if (tempChessBoard) {
                tracingPath.push(tempChessBoard);
            }
        }
        return tracingPath;
    }
}