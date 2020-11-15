import ChessBlock from "./ChessBlock.js";
import AssignedVar from "../AssignedVar.js";

export default class Empty extends ChessBlock {
    constructor(currentPos) {
        super(currentPos);
        this.type = AssignedVar.EMPTY;
        this.id = `empty_${currentPos.convertToId()}`;
    }
    getId() {
        return `empty_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves() {
        return [this.currentPos];
    }
}