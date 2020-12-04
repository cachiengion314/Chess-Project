import Game from "../gameplay/Game.js";

let _isUserAndEnemyReady = false;
let _isUserInLobby = true;

export default class AssignedVar {
    static userAcc = null;
    static currentGame = null;
    static haveUsedSignColButton = false;

    static get IsUserAndEnemyReady() {
        _isUserAndEnemyReady = false;
        if (!AssignedVar.currentGame) {
            _isUserAndEnemyReady = false;
        } else {
            if (AssignedVar.currentGame.enemyAcc.isReady && AssignedVar.currentGame.userAcc.isReady) {
                _isUserAndEnemyReady = true;
            }
        }
        return _isUserAndEnemyReady;
    }
    static set IsUserInLobby(val) {
        Game.hideChatbox();
        if (val) {
            Game.hideChessBoardAndShowLobby();
            Game.hideQuitGameBtn();
        } else {
            Game.showChessBoardAndHideLobby();
            Game.showQuitGameBtn();
            if (AssignedVar.currentGame && AssignedVar.currentGame.gameMode == AssignedVar.ONLINE) {
                Game.showChatbox();
            }
        }
        _isUserInLobby = val;
    }
    static get IsUserInLobby() {
        return _isUserInLobby;
    }

    static selectedPiece = null;
    static $selectedPiece = null;
    static selectedPieceSpecialBlocks = [];
    static legalMovesOfSelectedPiece = [];
    static coordinatesBlocks = [];

    static chessClubObj = {
        "current_user_signin_id": -1,
        "all_accounts_sign_up_in_this_browser": {},
    }
    static get FAKE_LOADING_TIME() {
        return 1500;
    }
    static get MAX_SCREEN_WIDTH() {
        return 950;
    }
    static get SIGN_COL_ZINDEX() {
        return "12";
    }
    static get NOTIFICATION_MODAL_ZINDEX() {
        return "7";
    }
    static get CUSTOM_MODAL_ZINDEX() {
        return "6";
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
        return "white";
    }
    static get BLACK() {
        return "black";
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

    static bRook;
    static bKnight;
    static bBishop;
    static bKing;
    static bQueen;
    static bBishop2;
    static bKnight2;
    static bRook2;
    static bPawns = [];
    static wRook;
    static wKnight;
    static wBishop;
    static wKing;
    static wQueen;
    static wBishop2;
    static wKnight2;
    static wRook2;
    static wPawns = [];
}