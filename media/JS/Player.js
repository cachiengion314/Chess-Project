import AssignedVar from "./AssignedVar.js";

export default class Player {
    constructor(color) {
        this.color = color;
        if (this.color == AssignedVar.WHITE) {
            this.id = 0;
        }
        if (this.color == AssignedVar.BLACK) {
            this.id = 1;
        }
        this.alivePieces = [];
        this.deadthPieces = [];
    }
}