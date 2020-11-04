import ChessBlock from "./ChessBlock.js";
import AssignedVar from "../AssignedVar.js";

export default class Empty extends ChessBlock {
    constructor(currentPos) {
        super(currentPos);
        this.type = AssignedVar.emptyStr;
        this.name = `empty_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves() {
        return [this.currentPos];
    }
}