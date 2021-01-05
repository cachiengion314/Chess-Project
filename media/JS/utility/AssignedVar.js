import Game from "../gameplay/Game.js";
import Firebase from "./Firebase.js";
import initLobby from "../initLobby.js";
import PopUp from "./PopUp.js";
import AI from "../gameplay/AI.js";

let _isUserAndEnemyReady = false;
let _isUserInLobby = true;
let _countMaxCurrentLoses = 0;

let _bKnight;
let _bBishop;
let _bKing;
let _bQueen;
let _bBishop2;
let _bKnight2;
let _bRook2;
let _bRook;
let _bPawns = [];
let _wRook;
let _wKnight;
let _wBishop;
let _wKing;
let _wQueen;
let _wBishop2;
let _wKnight2;
let _wRook2;
let _wPawns = [];

export default class AssignedVar {
    static currentGame = null;
    static haveUsedSignColButton = false;
    static currentTable = null;
    static currentChats = null;

    static md5(Content) {
        return CryptoJS.MD5(Content).toString()
    }

    static get countMaxCurrentLoses() {
        if (AssignedVar.IsUserInLobby) {
            _countMaxCurrentLoses = 0;
        }
        return _countMaxCurrentLoses;
    }
    static set countMaxCurrentLoses(val) {
        _countMaxCurrentLoses = val;
    }
    static get IsUserAndEnemyReady() {
        _isUserAndEnemyReady = false;
        if (!AssignedVar.currentGame) {
            _isUserAndEnemyReady = false;
            return _isUserAndEnemyReady;
        }
        switch (AssignedVar.currentGame.gameMode) {
            case AssignedVar.ONLINE:
                if (!AssignedVar.currentTable.opponent) {
                    _isUserAndEnemyReady = false;
                } else if (AssignedVar.currentTable.opponent.isReady && AssignedVar.currentTable.owner.isReady) {
                    _isUserAndEnemyReady = true;
                }
                break;
            case AssignedVar.OFFLINE:
                if (AssignedVar.currentTable.owner.isReady) {
                    _isUserAndEnemyReady = true;
                }
                break;
        }
        return _isUserAndEnemyReady;
    }
    static set IsUserInLobby(val) {
        if (val) {
            AI.isOn = false;
            Game.hideChessBoardAndShowLobby();
            Game.hideQuitGameBtn();
            initLobby();
        } else {
            Game.showChessBoardAndHideLobby();
            Game.showQuitGameBtn();
        }
        _isUserInLobby = val;
    }
    static get IsUserInLobby() {
        return _isUserInLobby;
    }
    static getDefaultTable(tableId, owner) {
        let _defaultTable = {};
        _defaultTable.tableId = tableId;
        _defaultTable.owner = owner;
        _defaultTable.ownerLastMove = null;
        _defaultTable.ownerMove = null;
        _defaultTable.opponent = null;
        _defaultTable.opponentLastMove = null;
        _defaultTable.opponentMove = null;
        _defaultTable.lastTurn = null;
        _defaultTable.playersNumber = 1;
        _defaultTable.is_ownerRageQuit = false;
        _defaultTable.is_opponentRageQuit = false;
        _defaultTable.chatsId = `chats-` + owner.id;

        return _defaultTable;
    }

    static getDefaultChats(chatsId) {
        let _defaultChats = {};
        _defaultChats.chatsId = chatsId;
        _defaultChats.ownerChat = null;
        _defaultChats.opponentChat = null;

        return _defaultChats;
    }

    static selectedPiece = null;
    static $selectedPiece = null;
    static selectedPieceSpecialBlocks = [];
    static legalMovesOfSelectedPiece = [];
    static coordinatesBlocks = [];

    static chessClubObj = {
        "current_user_signin_id": -1,
        "currentAI_DifficultIndex": 0,
        "all_accounts_sign_up_in_this_browser": {},
    }
    static get CRAZY() {
        return "crazy";
    }
    static get NORMAL() {
        return "normal";
    }
    static get EASY() {
        return "easy";
    }
    static get HARD() {
        return "hard";
    }
    static get FAKE_LOADING_TIME() {
        return 1500;
    }
    static get MAX_SCREEN_WIDTH() {
        return 950;
    }
    static get OWNER() {
        return "owner";
    }
    static get OPPONENT() {
        return "opponent";
    }
    static get CHATBOX_ZINDEX() {
        return "5";
    }
    static get SIGN_COL_ZINDEX() {
        return "7";
    }
    static get NOTIFICATION_MODAL_ZINDEX() {
        return "9";
    }
    static get CUSTOM_MODAL_ZINDEX() {
        return "8";
    }
    static get READY_BTN_ZINDEX() {
        return "5";
    }
    static get CHESS_PIECE_ZINDEX() {
        return "4";
    }
    static get MAX_BLOCK_ZINDEX() {
        return "3";
    }
    static get MIN_BLOCK_ZINDEX() {
        return "2";
    }
    static get KEY_CHESS_CLUB_ONLINE() {
        return "chess_club_online";
    }
    static get KEY_ALL_ACCOUNTS_SIGN_UP() {
        return "all_accounts_sign_up_in_this_browser";
    }
    static get KEY_CURRENT_USER_SIGNIN_ID() {
        return "current_user_signin_id";
    }
    static get KEY_CURRENT_AI_DIFFICULT_INDEX() {
        return "currentAI_DifficultIndex";
    }
    static get OFFLINE() {
        return "offline";
    }
    static get ONLINE() {
        return "online";
    }
    static get NO_USER() {
        return "no_user";
    }
    static get WHITE() {
        return true;
    }
    static get BLACK() {
        return false;
    }
    static get EMPTY() {
        return "empty";
    }
    static get PIECE() {
        return "piece";
    }
    static get CHESS_PIECE() {
        return "chess-piece";
    }
    static get CHESSBOARD_BG_COLOR() {
        return "chessboard-bg-color";
    }
    static get CHESS_BLOCK() {
        return "chess-block";
    }
    static get POSITION_BLOCK() {
        return "position-block";
    }
    static get HIGHLIGHT_BLOCK() {
        return "highlight-block";
    }
    static get ATTACK_BLOCK() {
        return "attack-block";
    }
    static get DARK_BLOCK() {
        return "dark-block";
    }
    static get LIGHT_BLOCK() {
        return "light-block";
    }
    static get COORDINATES_COLOR() {
        return "coordinates-color";
    }
    static get TIME_EACH_TURN() {
        return 1000;
    }
    static get KING_W() {
        return "king-w";
    }
    static get QUEEN_W() {
        return "queen-w";
    }
    static get BISHOP_W() {
        return "bishop-w";
    }
    static get KNIGHT_W() {
        return "knight-w";
    }
    static get ROOK_W() {
        return "rook-w";
    }
    static get PAWN_W() {
        return "pawn-w";
    }
    static get KING_B() {
        return "king-b";
    }
    static get QUEEN_B() {
        return "queen-b";
    }
    static get BISHOP_B() {
        return "bishop-b";
    }
    static get KNIGHT_B() {
        return "knight-b";
    }
    static get ROOK_B() {
        return "rook-b";
    }
    static get PAWN_B() {
        return "pawn-b";
    }
    static get ROOK() {
        return "rook";
    }
    static get BISHOP() {
        return "bishop";
    }
    static get KING() {
        return "king";
    }
    static get QUEEN() {
        return "queen";
    }
    static get KNIGHT() {
        return "knight";
    }
    static get PAWN() {
        return "pawn";
    }

    static get bRook() {
        return _bRook;
    }
    static set bRook(val) {
        _bRook = (val);
    }
    static get bKnight() {
        return _bKnight;
    }
    static set bKnight(val) {
        _bKnight = (val);
    }
    static get bBishop() {
        return _bBishop;
    }
    static set bBishop(val) {
        _bBishop = (val);
    }

    static get bKing() {
        return _bKing;
    }
    static set bKing(val) {
        _bKing = (val);
    }

    static get bQueen() {
        return _bQueen;
    }
    static set bQueen(val) {
        _bQueen = (val);
    }
    static get bBishop2() {
        return _bBishop2;
    }
    static set bBishop2(val) {
        _bBishop2 = (val);
    }
    static get bKnight2() {
        return _bKnight2;
    }
    static set bKnight2(val) {
        _bKnight2 = (val);
    }
    static get bRook2() {
        return _bRook2;
    }
    static set bRook2(val) {
        _bRook2 = (val);
    }
    static get bPawns() {
        return _bPawns;
    }
    static set bPawns(val) {
        _bPawns = val;
    }
    static get wRook() {
        return _wRook;
    }
    static set wRook(val) {
        _wRook = (val);
    }
    static get wKnight() {
        return _wKnight;
    }
    static set wKnight(val) {
        _wKnight = (val);
    }
    static get wBishop() {
        return _wBishop;
    }
    static set wBishop(val) {
        _wBishop = (val);
    }
    static get wKing() {
        return _wKing;
    }
    static set wKing(val) {
        _wKing = (val);
    }
    static get wQueen() {
        return _wQueen;
    }
    static set wQueen(val) {
        _wQueen = (val);
    }
    static get wBishop2() {
        return _wBishop2;
    }
    static set wBishop2(val) {
        _wBishop2 = (val);
    }
    static get wKnight2() {
        return _wKnight2;
    }
    static set wKnight2(val) {
        _wKnight2 = (val);
    }
    static get wRook2() {
        return _wRook2;
    }
    static set wRook2(val) {
        _wRook2 = (val);
    }
    static get wPawns() {
        return _wPawns;
    }
    static set wPawns(val) {
        _wPawns = val;
    }
}