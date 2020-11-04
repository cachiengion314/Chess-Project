export default class AssignedVar {
    static selectedPiece = null;
    static legalMovesOfSelectedPiece = [];
    static chessBoard = [];

    static boringColor = `#dddddd`;

    static whiteStr = `white`;
    static blackStr = `black`;
    static emptyStr = `empty`;
    static pieceStr = `piece`;

    static whiteKingImg = `&#9812;`;
    static whiteQueenImg = `&#9813;`;
    static whiteBishopImg = `&#9815;`;
    static whiteKnightImg = `&#9816;`;
    static whiteRookImg = `&#9814;`;
    static whitePawnImg = `&#9817;`;

    static blackKingImg = `&#9818;`;
    static blackQueenImg = `&#9819;`;
    static blackBishopImg = `&#9821;`;
    static blackKnightImg = `&#9822;`;
    static blackRookImg = `&#9820;`;
    static blackPawnImg = `&#9823;`;

    static rookStr = `rook`;
    static bishopStr = `bishop`;
    static kingStr = `king`;
    static queenStr = `queen`;
    static knightStr = `kinght`;
    static pawnnStr = `pawn`;

    static currentPlayer = null;
    static blackPlayer = null;
    static whitePlayer = null;

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