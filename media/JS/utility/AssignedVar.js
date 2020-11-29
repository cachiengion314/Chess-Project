export default class AssignedVar {
    static thisUser = null;
    static enemyUser = null;
    static currentGame = null;
    static games = [];
    static haveUsedSignColButton = false;
    static OFFLINE = "ofline";
    static ONLINE = "online";

    static MAX_SCREEN_WIDTH = 950;
    static SIGN_COL_ZINDEX = "12";
    static CUSTOM_MODAL_ZINDEX = "6";
    static READY_BTN_ZINDEX = "5";
    static CHESS_PIECE_ZINDEX = "4";
    static MAX_BLOCK_ZINDEX = "3";
    static MIN_BLOCK_ZINDEX = "2";
    
    static selectedPiece = null;
    static $selectedPiece = null;
    static selectedPieceSpecialBlocks = [];
    static legalMovesOfSelectedPiece = [];
    static coordinatesBlocks = [];

    static LEFT_ARROW = "&#9664;";
    static RIGHT_ARROW = "&#9658;";
    static CIRCLE = "&#9673;";
    static WHITE = `white`;
    static BLACK = `black`;
    static EMPTY = `empty`;
    static PIECE = `piece`;
    static CHESS_PIECE = `chess-piece`;
    static CHESSBOARD_BG_COLOR = `chessboard-bg-color`;
    static CHESS_BLOCK = `chess-block`;
    static POSITION_BLOCK = "position-block";
    static HIGHLIGHT_BLOCK = "highlight-block";
    static ATTACK_BLOCK = "attack-block";
    static DARK_BLOCK = "dark-block";
    static LIGHT_BLOCK = "light-block";
    static COORDINATES_COLOR = "coordinates-color";

    static KING_W = `king-w`;
    static QUEEN_W = `queen-w`;
    static BISHOP_W = `bishop-w`;
    static KNIGHT_W = `knight-w`;
    static ROOK_W = `rook-w`;
    static PAWN_W = `pawn-w`;

    static KING_B = `king-b`;
    static QUEEN_B = `queen-b`;
    static BISHOP_B = `bishop-b`;
    static KNIGHT_B = `knight-b`;
    static ROOK_B = `rook-b`;
    static PAWN_B = `pawn-b`;

    static ROOK = `rook`;
    static BISHOP = `bishop`;
    static KING = `king`;
    static QUEEN = `queen`;
    static KNIGHT = `knight`;
    static PAWN = `pawn`;

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