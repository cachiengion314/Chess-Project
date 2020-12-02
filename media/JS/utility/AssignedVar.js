export default class AssignedVar {
    static userAcc = null;
    static currentGame = null;
    static games = [];
    static haveUsedSignColButton = false;

    static FAKE_LOADING_TIME = 1500;
    static MAX_SCREEN_WIDTH = 950;
    static SIGN_COL_ZINDEX = "12";
    static NOTIFICATION_MODAL_ZINDEX = "7";
    static CUSTOM_MODAL_ZINDEX = "6";
    static READY_BTN_ZINDEX = "5";
    static CHESS_PIECE_ZINDEX = "4";
    static MAX_BLOCK_ZINDEX = "3";
    static MIN_BLOCK_ZINDEX = "2";
    static LEFT_ARROW = "&#9664;";
    static RIGHT_ARROW = "&#9658;";
    static CIRCLE = "&#9673;";

    static selectedPiece = null;
    static $selectedPiece = null;
    static selectedPieceSpecialBlocks = [];
    static legalMovesOfSelectedPiece = [];
    static coordinatesBlocks = [];

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