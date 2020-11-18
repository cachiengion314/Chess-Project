import Player from "./Player.js";
import AssignedVar from "./utility/AssignedVar.js";
import Vector from "./utility/Vector.js";
import Rook from "./pieces/Rook.js";
import Empty from "./pieces/Empty.js"
import Knight from "./pieces/Knight.js";
import Bishop from "./pieces/Bishop.js";
import King from "./pieces/King.js";
import Queen from "./pieces/Queen.js";
import Pawn from "./pieces/Pawn.js";
import Visualize from "./utility/Visualize.js";
import "./web-component/ChessPiece.js";
import "./web-component/ChessBlock.js";

export function initGameBoard() {
    initLogicPlayer();
    initLogicPieces();
    initLogicBoard();
}

function initLogicPlayer() {
    AssignedVar.blackPlayer = new Player(AssignedVar.BLACK);
    AssignedVar.whitePlayer = new Player(AssignedVar.WHITE);
    AssignedVar.currentPlayer = AssignedVar.whitePlayer;
}

function initLogicPieces() {
    AssignedVar.bRook = new Rook(AssignedVar.BLACK, new Vector(0, 0));
    AssignedVar.bKnight = new Knight(AssignedVar.BLACK, new Vector(1, 0));
    AssignedVar.bBishop = new Bishop(AssignedVar.BLACK, new Vector(2, 0));
    AssignedVar.bKing = new King(AssignedVar.BLACK, new Vector(3, 0));
    AssignedVar.bQueen = new Queen(AssignedVar.BLACK, new Vector(4, 0));
    AssignedVar.bBishop2 = new Bishop(AssignedVar.BLACK, new Vector(5, 0));
    AssignedVar.bKnight2 = new Knight(AssignedVar.BLACK, new Vector(6, 0));
    AssignedVar.bRook2 = new Rook(AssignedVar.BLACK, new Vector(7, 0));
    for (let i = 0; i < 8; ++i) {
        let bPawn = new Pawn(AssignedVar.BLACK, new Vector(i, 1));
        AssignedVar.bPawns.push(bPawn);
    }
    AssignedVar.wRook = new Rook(AssignedVar.WHITE, new Vector(0, 7));
    AssignedVar.wKnight = new Knight(AssignedVar.WHITE, new Vector(1, 7));
    AssignedVar.wBishop = new Bishop(AssignedVar.WHITE, new Vector(2, 7));
    AssignedVar.wKing = new King(AssignedVar.WHITE, new Vector(3, 7));
    AssignedVar.wQueen = new Queen(AssignedVar.WHITE, new Vector(4, 7));
    AssignedVar.wBishop2 = new Bishop(AssignedVar.WHITE, new Vector(5, 7));
    AssignedVar.wKnight2 = new Knight(AssignedVar.WHITE, new Vector(6, 7));
    AssignedVar.wRook2 = new Rook(AssignedVar.WHITE, new Vector(7, 7));
    for (let i = 0; i < 8; ++i) {
        let wPawn = new Pawn(AssignedVar.WHITE, new Vector(i, 6));
        AssignedVar.wPawns.push(wPawn);
    }
    AssignedVar.blackPlayer.alivePieces.push(AssignedVar.bRook, AssignedVar.bKnight, AssignedVar.bBishop, AssignedVar.bKing, AssignedVar.bQueen,
        AssignedVar.bBishop2, AssignedVar.bKnight2, AssignedVar.bRook2, ...AssignedVar.bPawns);
    AssignedVar.whitePlayer.alivePieces.push(AssignedVar.wRook, AssignedVar.wKnight, AssignedVar.wBishop, AssignedVar.wKing, AssignedVar.wQueen,
        AssignedVar.wBishop2, AssignedVar.wKnight2, AssignedVar.wRook2, ...AssignedVar.wPawns);
}

function initLogicBoard() {
    for (let x = 0; x < 8; ++x) {
        let array1 = [];
        AssignedVar.chessBoard.push(array1);
        for (let y = 0; y < 8; ++y) {
            let array2 = [];
            AssignedVar.chessBoard[x].push(array2);
            AssignedVar.chessBoard[x][y] = new Empty(new Vector(x, y));
        }
    }
    for (let piece of AssignedVar.blackPlayer.alivePieces) {
        AssignedVar.chessBoard[piece.currentPos.x][piece.currentPos.y] = piece;
    }
    for (let piece of AssignedVar.whitePlayer.alivePieces) {
        AssignedVar.chessBoard[piece.currentPos.x][piece.currentPos.y] = piece;
    }

    initVisualizeBoard();
}

function initVisualizeBoard() {
    for (let x = 0; x < 8; ++x) {
        for (let y = 0; y < 8; ++y) {
            let pos = new Vector(x, y);
            if (AssignedVar.chessBoard[x][y].type == AssignedVar.PIECE) {
                Visualize.chessPieceImageAt(pos);
            }
        }
    }
    for (let x = 0; x < 8; ++x) {
        for (let y = 0; y < 8; ++y) {
            let pos = new Vector(x, y);
            Visualize.chessBlockImageAt(pos);
            Visualize.onBlockMouseEnterOf($(`#${AssignedVar.EMPTY}_${pos.convertToId()}`)[0]);
            Visualize.onBlockMouseLeaveOf($(`#${AssignedVar.EMPTY}_${pos.convertToId()}`)[0]);

            onclickSelectedEmptyAt(pos);
            if (AssignedVar.chessBoard[x][y].type == AssignedVar.PIECE) {
                Visualize.onPieceMouseEnterOf($(`#${AssignedVar.chessBoard[x][y].id}`)[0]);
                Visualize.onPieceMouseLeaveOf($(`#${AssignedVar.chessBoard[x][y].id}`)[0]);
                onclickSelectedChessPieceAt(pos);
            }
        }
    }
    Visualize.setThemeAt(0);
    onclickChangeThemeButton();
}

function onclickSelectedEmptyAt(fixedPosition) {
    let $emptyBlock = $(`#${AssignedVar.EMPTY}_${fixedPosition.convertToId()}`);
    $emptyBlock.on(`click`, () => {
        let pos = Vector.convertIdToVector($emptyBlock[0].id)
        setupOnClickCallbackAt(pos);
    });
}

function onclickSelectedChessPieceAt(fixedPosition) {
    let $chessPiece = $(`#${AssignedVar.chessBoard[fixedPosition.x][fixedPosition.y].id}`);
    $chessPiece.on(`click`, () => {
        let pos = Vector.convertIdToVector($chessPiece[0].id);
        if (AssignedVar.currentPlayer.id == $chessPiece[0].controlbyplayerid) {
            setupOnClickCallbackAt(pos);
        } else {
            if (pos.isPositionInLegalMoves()) {
                setupOnClickCallbackAt(pos);
            } else {
                if (pos.isPositionHasPiece()) {
                    Visualize.cannotAttackPieceEffect($chessPiece[0]);
                }
            }
        }
    });
}

function setupOnClickCallbackAt(pos) {
    if (pos.isPositionHasPiece()) {
        if (AssignedVar.selectedPiece) {
            let pieceAtPos = AssignedVar.chessBoard[pos.x][pos.y];
            if (pieceAtPos.controlByPlayerId == AssignedVar.currentPlayer.id) {
                unSubscribeSelectedPiece();
            } else {
                logicDestroyEnemyPiece(pieceAtPos);
                logicMovePieceTo(pos);
                unSubscribeSelectedPiece();
                changePlayerTurn();
            }
        } else {
            subscribeSelectedPieceAt(pos);
        }
    } else {
        if (pos.isPositionInLegalMoves()) {
            logicMovePieceTo(pos);
            unSubscribeSelectedPiece();
            changePlayerTurn();
        } else {
            if (AssignedVar.selectedPiece) {
                unSubscribeSelectedPiece();
            }
        }
    }
}

function logicDestroyEnemyPiece(logicEnemyPiece) {
    if (logicEnemyPiece.controlByPlayerId == 0) {
        AssignedVar.whitePlayer.alivePieces = AssignedVar.whitePlayer.alivePieces.filter(item => {
            return item.id != logicEnemyPiece.id;
        });
        AssignedVar.whitePlayer.deadthPieces.push(logicEnemyPiece);
    } else {
        AssignedVar.blackPlayer.alivePieces = AssignedVar.blackPlayer.alivePieces.filter(item => {
            return item.id != logicEnemyPiece.id;
        });
        AssignedVar.blackPlayer.deadthPieces.push(logicEnemyPiece);
    }
    AssignedVar.chessBoard[logicEnemyPiece.currentPos.x][logicEnemyPiece.currentPos.y] = new Empty(logicEnemyPiece.currentPos);

    Visualize.destroyEnemyPiece($(`#${logicEnemyPiece.id}`)[0]);
}

function logicMovePieceTo(nextPos) {
    let currentPos = AssignedVar.selectedPiece.currentPos;
    AssignedVar.chessBoard[currentPos.x][currentPos.y] = new Empty(currentPos);
    AssignedVar.chessBoard[nextPos.x][nextPos.y] = AssignedVar.selectedPiece;
    AssignedVar.chessBoard[nextPos.x][nextPos.y].currentPos = nextPos;
    AssignedVar.chessBoard[nextPos.x][nextPos.y].id = AssignedVar.selectedPiece.getId();
    AssignedVar.$selectedPiece.id = AssignedVar.chessBoard[nextPos.x][nextPos.y].id;

    Visualize.logInfo();
    Visualize.movePiece(AssignedVar.$selectedPiece, currentPos, nextPos);
}

function changePlayerTurn() {
    if (AssignedVar.currentPlayer.id == 0) {
        AssignedVar.currentPlayer = AssignedVar.blackPlayer;
    } else {
        AssignedVar.currentPlayer = AssignedVar.whitePlayer;
    }
}

function subscribeSelectedPieceAt(pos) {
    Visualize.removeAllSpecialBlocksFromLastSelectedPiece();
    logicSubscribeSelectedPieceAt(pos);
    Visualize.selectedPieceEffectAt(pos);
}

function logicSubscribeSelectedPieceAt(pos) {
    AssignedVar.selectedPiece = AssignedVar.chessBoard[pos.x][pos.y];
    AssignedVar.$selectedPiece = $(`#${AssignedVar.chessBoard[pos.x][pos.y].id}`)[0];
    AssignedVar.legalMovesOfSelectedPiece = AssignedVar.selectedPiece.getAllPossibleMoves();
}

function unSubscribeSelectedPiece() {
    Visualize.removeAllSpecialBlocksFromLastSelectedPiece();
    logicUnSubscribeSelectedPiece();
}

function logicUnSubscribeSelectedPiece() {
    AssignedVar.selectedPiece = null;
    AssignedVar.$selectedPiece = null;
    AssignedVar.legalMovesOfSelectedPiece = [];
}

function onclickChangeThemeButton() {
    $(`#change-theme-btn`).on(`click`, () => {
        Visualize.currentThemeIndex++;
        if (Visualize.currentThemeIndex == Visualize.themes.length) {
            Visualize.currentThemeIndex = 0;
        }
        Visualize.setThemeAt(Visualize.currentThemeIndex);
    });
}