import AssignedVar from "../utility/AssignedVar.js";
import Player from "../gameplay/Player.js";
import Vector from "../utility/Vector.js";
import { initGameBoard, onclickSelectedChessPieceAt } from "../initGameBoard.js";
import Firebase from "../utility/Firebase.js";
import User from "./User.js";

let $chessBoard;
let _tablesCount = 0;
let _blackPlayer;
let _whitePlayer;

let _placeHolderAction;
let _emptyAction = () => { }
let _letPlayerControlChessPiece = () => {
    for (let x = 0; x < 8; ++x) {
        for (let y = 0; y < 8; ++y) {
            let pos = new Vector(x, y);
            if (AssignedVar.currentGame.chessBoard[x][y].type == AssignedVar.PIECE) {
                onclickSelectedChessPieceAt(pos);
            }
        }
    }
    _placeHolderAction = _emptyAction;
}
_placeHolderAction = _letPlayerControlChessPiece;

export default class Game {
    constructor(gameMode) {
        this.gameMode = gameMode;
        this.chessBoard = [];
    }
    static initLogicPlayer() {
        Game.blackPlayer = Firebase.convertCustomObjToGenericObj(new Player(AssignedVar.BLACK));
        Game.whitePlayer = Firebase.convertCustomObjToGenericObj(new Player(AssignedVar.WHITE));
    }
    static get TablesCount() {
        return _tablesCount;
    }
    static set TablesCount(val) {
        _tablesCount = val;
    }
    static get $ChessBoard() {
        return $chessBoard;
    }
    static get blackPlayer() {
        return _blackPlayer;
    }
    static set blackPlayer(val) {
        _blackPlayer = val;
    }
    static get whitePlayer() {
        return _whitePlayer;
    }
    static set whitePlayer(val) {
        _whitePlayer = val;
    }
    letPlayerControlChessPiece() {
        _placeHolderAction();
    }
    setCurrentPlayer(isGoFirst = true) {
        if (isGoFirst) {
            this.currentPlayer = Game.whitePlayer;
        } else {
            this.currentPlayer = Game.blackPlayer;
        }
    }
    createNewChessBoard() {
        Game.showChessBoardAndHideLobby();
        $chessBoard = document.createElement(`chess-board`);
        $(`#board-package`).append(Game.$ChessBoard);
        Game.showReadyBtn();
        initGameBoard();
    }
    resetGameBoard() {
        Game.showReadyBtn();
        _placeHolderAction = _letPlayerControlChessPiece;
        if (Game.$ChessBoard) {
            $($chessBoard).empty();
        }
        AssignedVar.selectedPiece = null;
        AssignedVar.$selectedPiece = null;
        AssignedVar.selectedPieceSpecialBlocks = [];
        AssignedVar.legalMovesOfSelectedPiece = [];
        this.chessBoard = [];
        this.currentPlayer = null;
        AssignedVar.currentTable.owner.isReady = false;
        if (AssignedVar.currentTable.opponent) {
            AssignedVar.currentTable.opponent.isReady = false;
        }

        Game.initLogicPlayer();
        this.setCurrentPlayer();
        initGameBoard();

        Game.saveUserStatistic();
    }

    static quitEventInvokeForOpponent() {
        AssignedVar.isOpponentExists = false;
        AssignedVar.currentGame = null;
        AssignedVar.currentTable = null;
        let user = User.getUserSignIn();
        user.isReady = false;
        User.setUserSignIn(user);
        Firebase.unSubcribeSnapshot();
    }
    static quitEventInvokeForOwner() {
        AssignedVar.isOpponentExists = false;
        AssignedVar.currentGame = null;
        AssignedVar.currentTable = null;
        let ownerAcc = User.getUserSignIn();
        ownerAcc.isReady = false;
        User.setUserSignIn(ownerAcc);
    }
    static saveUserStatistic() {
        let acc;
        if (User.isTableOwner()) {
            acc = AssignedVar.currentTable.owner;
        } else {
            acc = AssignedVar.currentTable.opponent;
        }
        User.setUserSignIn(acc);
        Firebase.setCurrentUserData(User.getUserSignInId(), acc, () => {
            console.log(`saved in db success:`, acc);
        }, (e) => {
            console.log(`error when save: "${e}"`);
        });
    }
    static resetTempStatus() {
        let propObj = {};
        let user = User.getUserSignIn();
        user.tempLoses = 0;
        user.tempWins = 0;
        propObj.tempLoses = 0;
        propObj.tempWins = 0;
        User.setUserSignIn(user);
        Firebase.updateCurrentUserData(User.getUserSignInId(), propObj, () => {
            console.log(`reset temp in db success:`);
        }, (e) => {
            console.log(`error when reset temp: "${e}"`);
        });
    }
    static showOpponentBlock() {
        $(`#enemy-block`).show();
    }
    static hideOpponentBlock() {
        console.log(`hideOpponentBlock`);
        $(`#enemy-block`).hide();
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
        $(secondBtn).text(`Đầu hàng`);
        $(thirdBtn).hide();
    }
    static showSoloGroupBtn() {
        $(`#mode-group-btn`).hide(`fast`);
        $(`#gameplay-group-btn`).show(`fast`);
        let $secondBtn = $(`#gameplay-group-btn button`)[1];
        let $thirdBtn = $(`#gameplay-group-btn button`)[2];
        $($secondBtn).text(`Đầu hàng cho người chơi 1`);
        $($thirdBtn).text(`Đầu hàng cho người chơi 2`);
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
        let $quitGameBtn = $(`#function-col button`)[1];
        $($quitGameBtn).hide();
    }
    static showQuitGameBtn() {
        let $quitGameBtn = $(`#function-col button`)[1];
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
        Game.setReadyBgOff(`#user-block`);
        Game.setReadyBgOff(`#enemy-block`);

        let $readyBtn = $(`#ready-btn`);
        $($readyBtn).show();
        $($readyBtn).css({
            "left": "50%",
            "opacity": "1",
        });
    }
    static setReadyBgOn(BLOCK_ID = `#user-block`) {
        $(`${BLOCK_ID} .ready-bg`).css({
            "background-color": "green",
            "color": "white",
        });
    }
    static setReadyBgOff(BLOCK_ID = `#user-block`) {
        $(`${BLOCK_ID} .ready-bg`).css({
            "background-color": "red",
            "color": "black",
        });
    }
}