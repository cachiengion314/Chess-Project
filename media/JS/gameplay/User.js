export default class User {
    constructor(name) {
        this.name = name;

        this.wins = 0;
        this.draws = 0;
        this.loses = 0;

        this.tempWins = 0;
        this.tempDraws = 0;
        this.tempLoses = 0;

        this.isReady = false;
        this.controllingColor = null;
    }
}