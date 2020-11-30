import AssignedVar from "../utility/AssignedVar.js";

export default class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;

        this.wins = 0;
        this.draws = 0;
        this.loses = 0;

        this.tempWins = 0;
        this.tempDraws = 0;
        this.tempLoses = 0;

        this.isReady = false;
        this.controllingColor = AssignedVar.EMPTY;
    }
}