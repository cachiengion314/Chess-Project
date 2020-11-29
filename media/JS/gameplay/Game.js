import AssignedVar from "../utility/AssignedVar.js";
import Player from "../gameplay/Player.js";
import Vector from "../utility/Vector.js";
import initLobby from "../initLobby.js";
import { initGameBoard, onclickSelectedChessPieceAt } from "../initGameBoard.js";

export default class Game {
    constructor(id, userAcc, enemyAcc, gameMode) {
        this.id = id;
        this.isGamePlaying = false;
        this.gameMode = gameMode;
        this.chessBoard = [];
        this.userAcc = userAcc;
        this.enemyAcc = enemyAcc;
        this.initLogicPlayer();
    }
    set isGamePlaying(val) {

    }
    get isGamePlaying() {
        // this below code need to modified soon
        this.enemyAcc.isReady = true;
        return this.userAcc.isReady && this.enemyAcc.isReady;
    }
    letPlayerControlChessPiece() {
        for (let x = 0; x < 8; ++x) {
            for (let y = 0; y < 8; ++y) {
                let pos = new Vector(x, y);
                if (this.chessBoard[x][y].type == AssignedVar.PIECE) {
                    onclickSelectedChessPieceAt(pos);
                }
            }
        }
    }
    initLogicPlayer() {
        this.blackPlayer = new Player(AssignedVar.BLACK);
        this.whitePlayer = new Player(AssignedVar.WHITE);
        this.currentPlayer = this.whitePlayer;
        this.userAcc.controllingColor = AssignedVar.WHITE;
        this.enemyAcc.controllingColor = AssignedVar.BLACK;
    }
    createNewChessBoard() {
        this.showChessBoardAndHideLobby();
        this.$chessBoard = document.createElement(`chess-board`);
        $(`#board-package`).append(this.$chessBoard);
        initGameBoard();
    }
    showChessBoardAndHideLobby() {
        this.emptyWaitingTables();
        $(`#waiting-tables`).hide(`fast`);
        $(`#board-package`)[0].setAttribute(`style`, `display: flex !important; height: 80%;`);
    }

    hideChessBoardAndShowLobby() {
        $(`#board-package`)[0].setAttribute(`style`, `display: none;`);
        $(`#waiting-tables`).show(`fast`);
        initLobby();
    }
    emptyWaitingTables() {
        $(`#waiting-tables`).empty();
    }
    isUserTurn() {
        if (this.currentPlayer.color == this.userAcc.controllingColor) {
            return true;
        }
        return false;
    }
    resetGameBoard() {
        if (this.$chessBoard) {
            $(this.$chessBoard).empty();
        }
        AssignedVar.selectedPiece = null;
        AssignedVar.$selectedPiece = null;
        AssignedVar.selectedPieceSpecialBlocks = [];
        AssignedVar.legalMovesOfSelectedPiece = [];
        this.chessBoard = [];
        this.currentPlayer = null;
        this.whitePlayer = null;
        this.blackPlayer = null;
        AssignedVar.currentGame.userAcc.isReady = false;

        this.initLogicPlayer();
        initGameBoard();
    }
}