import AssignedVar from "../utility/AssignedVar.js";
import Player from "../gameplay/Player.js";
import Vector from "../utility/Vector.js";
import { initGameBoard, onclickSelectedChessPieceAt } from "../initGameBoard.js";
import Firebase from "../utility/Firebase.js";
import User from "./User.js";
import PopUp from "../utility/PopUp.js";
import ChatBox from "../utility/ChatBox.js";

let $chessBoard;
let _blackPlayer;
let _whitePlayer;
let _isGoFirstByChessRule = true;
let _isTheFirstTimeCreateTable = true;
let _tempChat;

let _placeHolder_letPlayerControlChessPiece;
let _placeHolder_opponentJoinTable;
let _placeHolder_opponentLeftTable;
let _placeHolder_showNewOpponentChat;
let _placeHolder_showNewOwnerChat;
let _emptyAction = () => { }

let _showNewOpponentChat = () => {
    ChatBox.show(ChatBox.OPPONENT_CHATBOX_ID, _tempChat);
}
let _showNewOwnerChat = () => {
    ChatBox.show(ChatBox.OWNER_CHATBOX_ID, _tempChat);
}

let _opponentLeftTalbe = () => {
    AssignedVar.countMaxCurrentLoses = 0;
    Game.hideOpponentBlock();
    if (!AssignedVar.currentTable.is_opponentRageQuit) {
        if (_isTheFirstTimeCreateTable) {
            console.log(`the table have been initialized!`);
        } else {
            PopUp.show(`Đối thủ vừa thoát khỏi bàn chơi!`, PopUp.sadImgUrl);
        }
    } else {
        PopUp.show(`Đối thủ vừa rage quit khỏi bàn chơi!`, PopUp.sadImgUrl);
        let acc = User.getUserSignIn();
        acc.elo += Game.calculateElo(true, acc.elo, 1000);
        acc.wins++;
        User.setUserSignIn(acc);
        AssignedVar.currentGame.resetGameBoard();
    }
    Game.saveAndUpdateScore();
    _isTheFirstTimeCreateTable = false;
    _placeHolder_opponentLeftTable = _emptyAction;
}

let _opponentJoinTable = () => {
    PopUp.show(`Một đối thủ vừa mới gia nhập bàn của bạn!`, PopUp.happierImgUrl);
    Game.showOpponentBlock();
    _placeHolder_opponentJoinTable = _emptyAction;
}

let _letPlayerControlChessPiece = () => {
    ChatBox.show(ChatBox.OWNER_CHATBOX_ID, `Trận đấu bắt đầu!`);
    ChatBox.show(ChatBox.OPPONENT_CHATBOX_ID, `Trận đấu bắt đầu!`);

    for (let x = 0; x < 8; ++x) {
        for (let y = 0; y < 8; ++y) {
            let pos = new Vector(x, y);
            if (AssignedVar.currentGame.chessBoard[x][y].type == AssignedVar.PIECE) {
                onclickSelectedChessPieceAt(pos);
            }
        }
    }
    _placeHolder_letPlayerControlChessPiece = _emptyAction;
}
_placeHolder_letPlayerControlChessPiece = _letPlayerControlChessPiece;
_placeHolder_opponentJoinTable = _opponentJoinTable;
_placeHolder_opponentLeftTable = _opponentLeftTalbe;
_placeHolder_showNewOpponentChat = _showNewOpponentChat;
_placeHolder_showNewOwnerChat = _showNewOwnerChat;

export default class Game {
    constructor(gameMode) {
        this.gameMode = gameMode;
        this.chessBoard = [];
    }
    static get tempChat() {
        return _tempChat;
    }
    static set tempChat(val) {
        _tempChat = val;
    }
    static get isTheFirstTimeCreateTable() {
        return _isTheFirstTimeCreateTable;
    }
    static set isTheFirstTimeCreateTable(val) {
        _isTheFirstTimeCreateTable = val;
    }
    static showNewOpponentChat() {
        _placeHolder_showNewOpponentChat();
    }
    static showNewOwnerChat() {
        _placeHolder_showNewOwnerChat();
    }
    static opponentLeftTable_snapshot() {
        _placeHolder_opponentLeftTable();
    }
    static recharge_opponentLeftTable_snapshot() {
        _placeHolder_opponentLeftTable = _opponentLeftTalbe;
    }
    static recharge_opponentJoinTable_snapshot() {
        _placeHolder_opponentJoinTable = _opponentJoinTable;
    }
    static opponentJoinTable_snapshot() {
        _placeHolder_opponentJoinTable();
    }
    static initLogicPlayer() {
        Game.blackPlayer = Firebase.convertCustomObjToGenericObj(new Player(AssignedVar.BLACK));
        Game.whitePlayer = Firebase.convertCustomObjToGenericObj(new Player(AssignedVar.WHITE));
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
    letPlayerControlChessPiece_snapshot() {
        _placeHolder_letPlayerControlChessPiece();
    }
    recharge_letPlayerControlChessPiece_snapshot() {
        _placeHolder_letPlayerControlChessPiece = _letPlayerControlChessPiece;
    }
    setCurrentPlayer(isGoFirstByChessRule = true) {
        if (isGoFirstByChessRule) {
            this.currentPlayer = Game.whitePlayer;
        } else {
            this.currentPlayer = Game.blackPlayer;
        }
        _isGoFirstByChessRule = isGoFirstByChessRule;
        return _isGoFirstByChessRule;
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
        this.recharge_letPlayerControlChessPiece_snapshot();
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
    }

    static saveAndUpdateScore() {
        let acc = User.getUserSignIn();
        acc.isReady = false;
        acc.tempWins = 0;
        acc.tempLoses = 0;
        User.setUserSignIn(acc);
        Game.saveUserStatistic(acc);
    }

    static quickSaveUserStatistic() {
        let acc;
        if (User.isTableOwner()) {
            acc = AssignedVar.currentTable.owner;
        } else {
            if (AssignedVar.currentTable.opponent) {
                acc = AssignedVar.currentTable.opponent;
            } else {
                acc = User.getUserSignIn();
            }
        }
        User.setUserSignIn(acc);
    }

    static saveUserStatistic(acc) {
        User.setUserSignIn(acc);
        Firebase.setCurrentUserData(User.getUserSignInId(), acc, () => {
            console.log(`saved in db success:`, acc);
        }, (e) => {
            console.log(`setCurrentUserData error: "${e}"`);
        });
    }

    static showOpponentBlock() {
        $(`#enemy-block`).css("visibility", "visible");
    }
    static hideOpponentBlock() {
        $(`#enemy-block`).css("visibility", "hidden");
    }
    static showChessBoardAndHideLobby() {
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
        $(`${BLOCK_ID} .ready-bg`).html(`Sẵn sàng!`)
    }
    static setReadyBgOff(BLOCK_ID = `#user-block`) {
        $(`${BLOCK_ID} .ready-bg`).css({
            "background-color": "red",
            "color": "black",
        });
        $(`${BLOCK_ID} .ready-bg`).html(`Chưa sẵn sàng!`)
    }
    static calculateElo(isAccWin, accElo = 1000, enemyElo = 1000) {
        if (isAccWin) {
            return 15;
        } else {
            return -15;
        }
    }
}