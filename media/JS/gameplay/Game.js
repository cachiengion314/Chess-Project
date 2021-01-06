import AssignedVar from "../utility/AssignedVar.js";
import Player from "../gameplay/Player.js";
import Vector from "../utility/Vector.js";
import { initGameBoard, onclickSelectedChessPieceAt, mimicOnclickMovePieceAt } from "../initGameBoard.js";
import Firebase from "../utility/Firebase.js";
import User from "./User.js";
import PopUp from "../utility/PopUp.js";
import ChatBox from "../utility/ChatBox.js";
import Visualize from "../utility/Visualize.js";
import AI from "./AI.js";
import Utility from "../utility/Utility.js";

let $chessBoard;
let _blackPlayer;
let _whitePlayer;
let _isGoFirstByChessRule = true;
let _isTheFirstTimeCreateTable = true;
let _tempChat;
let _ownerTime = 10;
let _opponentTime = 10;

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

let _opponentLeftTable = () => {
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
    Game.showTempStatistic(true);
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

    Game.clearAndStartCountTime();

    for (let x = 0; x < 8; ++x) {
        for (let y = 0; y < 8; ++y) {
            let pos = new Vector(x, y);
            if (AssignedVar.currentGame.chessBoard[x][y].type == AssignedVar.PIECE) {
                onclickSelectedChessPieceAt(pos);
            }
        }
    }

    if (AssignedVar.currentGame.gameMode == AssignedVar.OFFLINE) {
        if (AI.isOn) {
            if (!User.isOwnerTurn()) {
                AI.setupMoveFor(AssignedVar.currentTable.opponent.controllingColor);
            }
        }
    }

    _placeHolder_letPlayerControlChessPiece = _emptyAction;
}
_placeHolder_letPlayerControlChessPiece = _letPlayerControlChessPiece;
_placeHolder_opponentJoinTable = _opponentJoinTable;
_placeHolder_opponentLeftTable = _opponentLeftTable;
_placeHolder_showNewOpponentChat = _showNewOpponentChat;
_placeHolder_showNewOwnerChat = _showNewOwnerChat;

export default class Game {
    constructor(gameMode) {
        this.gameMode = gameMode;
        this.chessBoard = [];
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
        Visualize.initCoordinatedNumber();
        Visualize.setThemeAt(Utility.randomFromAToMax(0, Visualize.themes.length));
    }
    resetGameBoard() {
        if (AssignedVar.currentGame.gameMode == AssignedVar.ONLINE) {
            if (User.isTableOwner()) {
                User.showUserStatistic(AssignedVar.currentTable.owner);
            } else {
                User.showUserStatistic(AssignedVar.currentTable.opponent);
            }
        }
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
        Game.clearAndStartCountTime();
        Game.initLogicPlayer();
        this.setCurrentPlayer();
        initGameBoard();
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
        _placeHolder_opponentLeftTable = _opponentLeftTable;
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
        User.correctedAccNames();
        if (AssignedVar.currentGame && AssignedVar.currentGame.gameMode == AssignedVar.ONLINE) {
            Game.showOnlineGroupBtn();
            Game.showChatbox();
        } else if (AssignedVar.currentGame && AssignedVar.currentGame.gameMode == AssignedVar.OFFLINE) {
            if (AI.isOn) {
                Game.showPlayWithComputerGroupBtn();
            } else {
                Game.showPlayWithFriendGroupBtn();
            }
            Game.hideChatbox();
        }
    }
    static hideChessBoardAndShowLobby() {
        Game.emptyBoardPackage();
        Game.hideChatbox();
        $(`#mode-group-btn`).show(`fast`);
        $(`#gameplay-group-btn`).hide(`fast`);
        $(`#gameplay`).hide(`fast`);
        $(`#waiting-tables`).show(`fast`);
    }
    static showOnlineGroupBtn() {
        $(`#mode-group-btn`).hide(`fast`);
        $(`#gameplay-group-btn`).show(`fast`);
        let $surrender1Btn = $(`#surrender1-btn`)[0];
        let $surrender2Btn = $(`#surrender2-btn`)[0];
        let $colorBtn = $(`#controllingcolor-btn`)[0];
        let $aiBtn = $(`#ai-btn`)[0];
        $($aiBtn).hide();
        $($surrender1Btn).text(`Đầu hàng`);
        $($surrender2Btn).hide();
        $($colorBtn).hide();
    }
    static showPlayWithFriendGroupBtn() {
        $(`#mode-group-btn`).hide(`fast`);
        $(`#gameplay-group-btn`).show(`fast`);
        let $surrender1Btn = $(`#surrender1-btn`)[0];
        let $surrender2Btn = $(`#surrender2-btn`)[0];
        let $colorBtn = $(`#controllingcolor-btn`)[0];
        let $aiBtn = $(`#ai-btn`)[0];
        $($colorBtn).hide();
        $($aiBtn).hide();
        $($surrender1Btn).show();
        $($surrender2Btn).show();
        $($surrender1Btn).text(`Đầu hàng cho người 1`);
        $($surrender2Btn).text(`Đầu hàng cho người 2`);
    }
    static showPlayWithComputerGroupBtn() {
        $(`#mode-group-btn`).hide(`fast`);
        $(`#gameplay-group-btn`).show(`fast`);
        let $surrender1Btn = $(`#surrender1-btn`)[0];
        let $surrender2Btn = $(`#surrender2-btn`)[0];
        let $colorBtn = $(`#controllingcolor-btn`)[0];
        let $aiBtn = $(`#ai-btn`)[0];
        $($colorBtn).show();
        $($aiBtn).show();
        $($surrender1Btn).show();
        $($surrender2Btn).hide();
        $($surrender1Btn).text(`Đầu hàng`);
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
    static showTempStatistic(isFirstTimeShow = false) {
        let $opponentTempWins = $(`#enemy-block .align-end div`)[0];
        let $ownerTempWins = $(`#user-block .align-end div`)[0];
        let $opponentTime = $(`#enemy-block .align-end div`)[2];
        let $ownerTime = $(`#user-block .align-end div`)[2];
        if (isFirstTimeShow) {
            $opponentTempWins.textContent = `wins: ` + 0;
            $ownerTempWins.textContent = `wins: ` + 0;
            $opponentTime.textContent = `time: ` + AssignedVar.TIME_EACH_TURN;
            $ownerTime.textContent = `time: ` + AssignedVar.TIME_EACH_TURN;
            return;
        }
        if (AssignedVar.currentTable && AssignedVar.currentTable.opponent) {
            $opponentTempWins.textContent = `wins: ` + AssignedVar.currentTable.opponent.tempWins;
        }
        $ownerTempWins.textContent = `wins: ` + AssignedVar.currentTable.owner.tempWins;
    }
    static get ownerTime() {
        return _ownerTime;
    }
    static set ownerTime(val) {
        $(`#user-block .align-end div`)[2].textContent = `time: ` + val;
        _ownerTime = val;
    }
    static get opponentTime() {
        return _opponentTime;
    }
    static set opponentTime(val) {
        $(`#enemy-block .align-end div`)[2].textContent = `time: ` + val;
        _opponentTime = val
    }
    static clearAndStartCountTime() {
        Game.ownerTime = AssignedVar.TIME_EACH_TURN;
        Game.opponentTime = AssignedVar.TIME_EACH_TURN;
        clearTimeout(Game.clearCountOnwerTime);
        clearTimeout(Game.clearCountOpponentTime);
        if (AssignedVar.IsUserAndEnemyReady) {
            if (User.isOwnerTurn()) {
                Game.countOwnerTime();
            } else {
                Game.countOpponentTime();
            }
        }
    }
    static clearCountOnwerTime = 0;
    static clearCountOpponentTime = 0;
    static countOpponentTime() {
        Game.clearCountOpponentTime = setTimeout(() => {
            Game.opponentTime--;
            if (Game.opponentTime <= 0) {
                Game.overTimeResult();
                return;
            }
            Game.countOpponentTime();
        }, 1000);
    }
    static countOwnerTime() {
        Game.clearCountOnwerTime = setTimeout(() => {
            Game.ownerTime--;
            if (Game.ownerTime <= 0) {
                Game.overTimeResult();
                return;
            }
            Game.countOwnerTime();
        }, 1000);
    }
    static overTimeResult() {
        if (AssignedVar.currentGame.gameMode == AssignedVar.ONLINE) {
            if (User.isTableOwner()) {
                if (User.isOwnerTurn()) {
                    Game.loseGameResult();
                }
            } else {
                if (!User.isOwnerTurn()) {
                    Game.loseGameResult();
                }
            }
        } else {
            if (User.isOwnerTurn()) {
                Game.loseGameResult();
            } else {
                Game.winGameResult_onlyForOfflineMode();
            }
        }
    }
    static winGameResult_onlyForOfflineMode() {
        let ownerAcc = AssignedVar.currentTable.owner;
        let $ownerTempWins = $(`#user-block .align-end div`)[0];
        $ownerTempWins.textContent = `wins:  ${++ownerAcc.tempWins}`;

        AssignedVar.currentGame.resetGameBoard();
        PopUp.show(`Bạn "${ownerAcc.name}" đã thắng cuộc!`, PopUp.happierImgUrl);
    }
    static loseGameResult() {
        let propObj = {};
        let ownerAcc = AssignedVar.currentTable.owner;
        let opponentAcc = AssignedVar.currentTable.opponent;
        let user = ownerAcc;

        let USER_LOSES = "owner.loses";
        let USER_TEMPLOSES = "owner.tempLoses";
        if (!User.isTableOwner()) {
            USER_LOSES = "opponent.loses";
            USER_TEMPLOSES = "opponent.tempLoses";
            user = opponentAcc;

            propObj["opponent.elo"] = opponentAcc.elo += Game.calculateElo(false);

            propObj["owner.elo"] = ownerAcc.elo += Game.calculateElo(true);
            propObj["owner.wins"] = ++ownerAcc.wins;
            propObj["owner.tempWins"] = ++ownerAcc.tempWins;
        } else {
            propObj["owner.elo"] = ownerAcc.elo += Game.calculateElo(false);

            propObj["opponent.elo"] = opponentAcc.elo += Game.calculateElo(true);
            propObj["opponent.wins"] = ++opponentAcc.wins;
            propObj["opponent.tempWins"] = ++opponentAcc.tempWins;
        }
        let LOSER_NAME = user.name;
        propObj[USER_LOSES] = ++user.loses;
        propObj[USER_TEMPLOSES] = ++user.tempLoses;

        Game.showTempStatistic();

        if (AssignedVar.currentGame.gameMode == AssignedVar.OFFLINE) {
            PopUp.show(`Bạn "${AssignedVar.currentTable.owner.name}" đã thua cuộc!`, PopUp.sadImgUrl);
            AssignedVar.currentGame.resetGameBoard();
        } else {
            let updateObj = {
                ...propObj,
                opponentLastMove: null, opponentMove: null, lastTurn: null,
                ownerLastMove: null, ownerMove: null, "opponent.isReady": false, "owner.isReady": false,
            }
            PopUp.showLoading(() => {
                Firebase.updateTableProperty(Firebase.currentTableId, updateObj, () => {
                    console.log(`owner and opponent score is updated!`);
                    PopUp.show(`Bạn "${LOSER_NAME}" đã thua cuộc!`, PopUp.sadImgUrl);
                    AssignedVar.currentGame.resetGameBoard();
                }, (e) => {
                    console.log(`loseGameResultUpdate!: "${e}"`);
                });
            }, `Đợi chút! Hệ thống đang xử lý yêu cầu!`, AssignedVar.FAKE_LOADING_TIME);
        }
    }

    static calculateElo(isAccWin, accElo = 1000, enemyElo = 1000) {
        if (isAccWin) {
            return 15;
        } else {
            return -15;
        }
    }
}