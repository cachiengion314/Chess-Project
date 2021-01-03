import ChessBlock from "./ChessBlock.js";
import AssignedVar from "../utility/AssignedVar.js";

export default class Empty extends ChessBlock {
    constructor(currentPos) {
        super(currentPos);
        this.type = AssignedVar.EMPTY;
        this.id = `${AssignedVar.EMPTY}_${currentPos.convertToId()}`;
        this.directions = [this.currentPos];
        this.weights = 0;
        this.positions = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        // this.guardians = [];
    }
    getClone() {
        return new Empty(this.currentPos);
    }
    getId() {
        return `${AssignedVar.EMPTY}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves(chessBoard = AssignedVar.currentGame.chessBoard, controllingColor = AssignedVar.currentGame.currentPlayer.color) {
        return [this.currentPos];
    }
}