import AssignedVar from "../AssignedVar.js";

export default class ChessBlock {
    type;
    currentPos;
    id;
    constructor(currentPos) {
        this.currentPos = currentPos;
    }
}