import AssignedVar from "../utility/AssignedVar.js";
import Player from "../gameplay/Player.js";
import Vector from "../utility/Vector.js";
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
        Game.showChessBoardAndHideLobby();
        this.$chessBoard = document.createElement(`chess-board`);
        $(`#board-package`).append(this.$chessBoard);
        Game.showReadyBtn();
        initGameBoard();
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
        AssignedVar.currentGame.enemyAcc.isReady = false;

        this.initLogicPlayer();
        initGameBoard();
    }
    static showChessBoardAndHideLobby() {
        // Game.emptyWaitingTables();

        $(`#mode-group-btn`).hide(`fast`);
        $(`#gameplay-group-btn`).show(`fast`);
        $(`#gameplay`).show(`fast`);
        $(`#waiting-tables`).hide(`fast`);
        if (AssignedVar.currentGame && AssignedVar.currentGame.gameMode == AssignedVar.ONLINE) {
            Game.showOnlineGroupBtn();
        } else if (AssignedVar.currentGame && AssignedVar.currentGame.gameMode == AssignedVar.OFFLINE) {
            Game.showSoloGroupBtn();
        }
    }
    static hideChessBoardAndShowLobby() {
        Game.emptyBoardPackage();

        $(`#mode-group-btn`).show(`fast`);
        $(`#gameplay-group-btn`).hide(`fast`);
        $(`#gameplay`).hide(`fast`);
        $(`#waiting-tables`).show(`fast`);
    }
    static showOnlineGroupBtn() {
        $(`#mode-group-btn`).hide(`fast`);
        $(`#gameplay-group-btn`).show(`fast`);
        let secondBtn = $(`#gameplay-group-btn button`)[1];
        let thirdBtn = $(`#gameplay-group-btn button`)[2];
        $(secondBtn).text(`Resigned`);
        $(thirdBtn).hide();
    }
    static showSoloGroupBtn() {
        $(`#mode-group-btn`).hide(`fast`);
        $(`#gameplay-group-btn`).show(`fast`);
        let $secondBtn = $(`#gameplay-group-btn button`)[1];
        let $thirdBtn = $(`#gameplay-group-btn button`)[2];
        $($secondBtn).text(`Resigned for player 1`);
        $($thirdBtn).text(`Resigned for player 2`);
        $($thirdBtn).show();
    }
    static emptyWaitingTables() {
        $(`#waiting-tables`).empty();
    }
    static emptyBoardPackage() {
        $(`chess-board`).remove();
    }
    static showChatbox() {
        let $chatbox = $(`#function-col .box`)[0];
        $($chatbox).show(`fast`);
    }
    static hideChatbox() {
        let $chatbox = $(`#function-col .box`)[0];
        $($chatbox).hide(`fast`);
    }
    static hideQuitGameBtn() {
        let $quitGameBtn = $(`#function-col button`)[0];
        $($quitGameBtn).hide();
    }
    static showQuitGameBtn() {
        let $quitGameBtn = $(`#function-col button`)[0];
        $($quitGameBtn).show();
    }
    static hideReadyBtn(completedCallback = () => { }) {
        let $readyBtn = $(`#ready-btn`);
        $($readyBtn).animate({
            "left": "40%",
            "opacity": ".8",
        }, "fast");
        $($readyBtn).animate({
            "left": "80%",
            "opacity": ".4",
        }, "fast");
        $($readyBtn).animate({
            "opacity": "0",
        }, "fast", () => { $($readyBtn).hide(); completedCallback(); });
    }
    static showReadyBtn() {
        let $readyBtn = $(`#ready-btn`);
        $($readyBtn).show();
        $($readyBtn).css({
            "left": "50%",
            "opacity": "1",
        });
    }
}