import AssignedVar from "./AssignedVar.js";

export default class Player {
    constructor(color) {
        this.color = color;
        if (this.color == AssignedVar.whiteStr) {
            this.id = 0;
        }
        if (this.color == AssignedVar.blackStr) {
            this.id = 1;
        }
        this.alivePieces = [];
        this.deadthPieces = [];
    }
}