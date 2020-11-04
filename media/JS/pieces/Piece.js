import ChessBlock from "./ChessBlock.js";
import AssignedVar from "../AssignedVar.js";

export default class Piece extends ChessBlock {
    constructor(color, currentPos) {
        super(currentPos);
        this.type = AssignedVar.pieceStr;
        this.color = color;
        if (color == AssignedVar.whiteStr) {
            this.controlByPlayer = AssignedVar.whitePlayer;
        } else if (color == AssignedVar.blackStr) {
            this.controlByPlayer = AssignedVar.blackPlayer;
        }
    }
}