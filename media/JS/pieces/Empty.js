import ChessBlock from "./ChessBlock.js";
import AssignedVar from "../utility/AssignedVar.js";

export default class Empty extends ChessBlock {
    constructor(currentPos) {
        super(currentPos);
        this.type = AssignedVar.EMPTY;
        this.id = `${AssignedVar.EMPTY}_${currentPos.convertToId()}`;
        this.directions = [this.currentPos];
        this.weights = 0;
    }
    getClone() {
        return new Empty(this.currentPos);
    }
    getId() {
        return `${AssignedVar.EMPTY}_${this.currentPos.convertToId()}`;
    }
    getAllPossibleMoves() {
        return [this.currentPos];
    }
}