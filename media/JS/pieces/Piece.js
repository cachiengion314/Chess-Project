import ChessBlock from "./ChessBlock.js";
import AssignedVar from "../utility/AssignedVar.js";
import Game from "../gameplay/Game.js";

export default class Piece extends ChessBlock {
    constructor(color, currentPos) {
        super(currentPos);
        this.type = AssignedVar.PIECE;
        this.color = color;
        if (color == AssignedVar.WHITE) {
            this.controlByPlayerId = Game.whitePlayer.id;
        } else if (color == AssignedVar.BLACK) {
            this.controlByPlayerId = Game.blackPlayer.id;
        }
    }
}