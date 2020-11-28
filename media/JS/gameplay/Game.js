import AssignedVar from "../utility/AssignedVar.js";
import Player from "../gameplay/Player.js";
import Vector from "../utility/Vector.js";
import initLobby from "../initLobby.js";
import { initGameBoard, onclickSelectedChessPieceAt } from "../initGameBoard.js";

export default class Game {
    constructor(id) {
        this.id = id;
        this.isUserReady = false;
        this.isEnemyReady = true;
        this.isGamePlaying = false;

        this.initLogicPlayer();
        this.createNewChessBoard();
    }
    set isGamePlaying(val) {

    }
    get isGamePlaying() {
        return this.isUserReady && this.isEnemyReady;
    }
    letPlayerControlChessPiece() {
        for (let x = 0; x < 8; ++x) {
            for (let y = 0; y < 8; ++y) {
                let pos = new Vector(x, y);
                if (AssignedVar.chessBoard[x][y].type == AssignedVar.PIECE) {
                    onclickSelectedChessPieceAt(pos);
                }
            }
        }
    }
    initLogicPlayer() {
        AssignedVar.blackPlayer = new Player(AssignedVar.BLACK);
        AssignedVar.whitePlayer = new Player(AssignedVar.WHITE);
        AssignedVar.currentPlayer = AssignedVar.whitePlayer;
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
    resetGameBoard() {
        if (this.$chessBoard) {
            $(this.$chessBoard).empty();
        }
        AssignedVar.selectedPiece = null;
        AssignedVar.$selectedPiece = null;
        AssignedVar.selectedPieceSpecialBlocks = [];
        AssignedVar.legalMovesOfSelectedPiece = [];
        AssignedVar.chessBoard = [];
        AssignedVar.currentPlayer = null;
        AssignedVar.whitePlayer = null;
        AssignedVar.blackPlayer = null;
        AssignedVar.currentGame.isUserReady = false;

        let $readyBtn = $(`#ready-btn`);
        $($readyBtn).show(`fast`);

        this.initLogicPlayer();
        initGameBoard();
    }
}