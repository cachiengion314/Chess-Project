import ChessBlock from "./ChessBlock.js";
import AssignedVar from "../AssignedVar.js";

export default class Piece extends ChessBlock {
    constructor(color, currentPos) {
        super(currentPos);
        this.type = AssignedVar.PIECE;
        this.color = color;
        if (color == AssignedVar.WHITE) {
            this.controlByPlayer = AssignedVar.whitePlayer;
        } else if (color == AssignedVar.BLACK) {
            this.controlByPlayer = AssignedVar.blackPlayer;
        }
    }
}