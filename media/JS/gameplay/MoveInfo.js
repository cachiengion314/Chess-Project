import AssignedVar from "../utility/AssignedVar.js";

export default class MoveInfo {
    constructor(currentPos, nextPos) {
        this.currentPos = currentPos;
        this.nextPos = nextPos;
        this.moveScore = null;
    }
}