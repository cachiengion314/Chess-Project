import AssignedVar from "../AssignedVar.js";

export default class ChessBlock {
    type;
    currentPos;
    name;
    constructor(currentPos) {
        this.currentPos = currentPos;
    }
}