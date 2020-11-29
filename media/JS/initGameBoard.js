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

export function initGameBoard() {
    initLogicPieces();
    initLogicBoard();
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
    AssignedVar.bPawns.splice(0);
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
    AssignedVar.wPawns.splice(0);
    for (let i = 0; i < 8; ++i) {
        let wPawn = new Pawn(AssignedVar.WHITE, new Vector(i, 6));
        AssignedVar.wPawns.push(wPawn);
    }
    AssignedVar.currentGame.blackPlayer.alivePieces.push(AssignedVar.bRook, AssignedVar.bKnight, AssignedVar.bBishop, AssignedVar.bKing, AssignedVar.bQueen,
        AssignedVar.bBishop2, AssignedVar.bKnight2, AssignedVar.bRook2, ...AssignedVar.bPawns);
    AssignedVar.currentGame.whitePlayer.alivePieces.push(AssignedVar.wRook, AssignedVar.wKnight, AssignedVar.wBishop, AssignedVar.wKing, AssignedVar.wQueen,
        AssignedVar.wBishop2, AssignedVar.wKnight2, AssignedVar.wRook2, ...AssignedVar.wPawns);
}

function initLogicBoard() {
    for (let x = 0; x < 8; ++x) {
        let array1 = [];
        AssignedVar.currentGame.chessBoard.push(array1);
        for (let y = 0; y < 8; ++y) {
            let array2 = [];
            AssignedVar.currentGame.chessBoard[x].push(array2);
            AssignedVar.currentGame.chessBoard[x][y] = new Empty(new Vector(x, y));
        }
    }
    for (let piece of AssignedVar.currentGame.blackPlayer.alivePieces) {
        AssignedVar.currentGame.chessBoard[piece.currentPos.x][piece.currentPos.y] = piece;
    }
    for (let piece of AssignedVar.currentGame.whitePlayer.alivePieces) {
        AssignedVar.currentGame.chessBoard[piece.currentPos.x][piece.currentPos.y] = piece;
    }

    initVisualizeBoard();
}

function initVisualizeBoard() {
    for (let x = 0; x < 8; ++x) {
        for (let y = 0; y < 8; ++y) {
            let pos = new Vector(x, y);
            if (AssignedVar.currentGame.chessBoard[x][y].type == AssignedVar.PIECE) {
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

            if (AssignedVar.currentGame.chessBoard[x][y].type == AssignedVar.PIECE) {
                Visualize.onPieceMouseEnterOf($(`#${AssignedVar.currentGame.chessBoard[x][y].id}`)[0]);
                Visualize.onPieceMouseLeaveOf($(`#${AssignedVar.currentGame.chessBoard[x][y].id}`)[0]);
        
                // onclickSelectedChessPieceAt(pos);
            }
        }
    }
    Visualize.initCoordinatedNumber();
    Visualize.setThemeAt(0);
}

function onclickSelectedEmptyAt(fixedPosition) {
    let $emptyBlock = $(`#${AssignedVar.EMPTY}_${fixedPosition.convertToId()}`);
    $emptyBlock.on(`click`, () => {
        let pos = Vector.convertIdToVector($emptyBlock[0].id)
        setupOnClickCallbackAt(pos);
    });
}

export function onclickSelectedChessPieceAt(fixedPosition) {
    let $chessPiece = $(`#${AssignedVar.currentGame.chessBoard[fixedPosition.x][fixedPosition.y].id}`);
    $chessPiece.on(`click`, () => {
        let pos = Vector.convertIdToVector($chessPiece[0].id);
        if (AssignedVar.currentGame.currentPlayer.id == $chessPiece[0].controlbyplayerid) {
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
            let pieceAtPos = AssignedVar.currentGame.chessBoard[pos.x][pos.y];
            if (pieceAtPos.controlByPlayerId == AssignedVar.currentGame.currentPlayer.id) {
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
        AssignedVar.currentGame.whitePlayer.alivePieces = AssignedVar.currentGame.whitePlayer.alivePieces.filter(item => {
            return item.id != logicEnemyPiece.id;
        });
        AssignedVar.currentGame.whitePlayer.deadthPieces.push(logicEnemyPiece);
    } else {
        AssignedVar.currentGame.blackPlayer.alivePieces = AssignedVar.currentGame.blackPlayer.alivePieces.filter(item => {
            return item.id != logicEnemyPiece.id;
        });
        AssignedVar.currentGame.blackPlayer.deadthPieces.push(logicEnemyPiece);
    }
    AssignedVar.currentGame.chessBoard[logicEnemyPiece.currentPos.x][logicEnemyPiece.currentPos.y] = new Empty(logicEnemyPiece.currentPos);

    Visualize.destroyEnemyPiece($(`#${logicEnemyPiece.id}`)[0]);
}

function logicMovePieceTo(nextPos) {
    let currentPos = AssignedVar.selectedPiece.currentPos;
    AssignedVar.currentGame.chessBoard[currentPos.x][currentPos.y] = new Empty(currentPos);
    AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y] = AssignedVar.selectedPiece;
    AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y].currentPos = nextPos;
    AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y].id = AssignedVar.selectedPiece.getId();
    AssignedVar.$selectedPiece.id = AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y].id;

    Visualize.logInfo();
    Visualize.movePiece(AssignedVar.$selectedPiece, currentPos, nextPos);
}

function changePlayerTurn() {
    if (AssignedVar.currentGame.currentPlayer.id == 0) {
        AssignedVar.currentGame.currentPlayer = AssignedVar.currentGame.blackPlayer;
    } else {
        AssignedVar.currentGame.currentPlayer = AssignedVar.currentGame.whitePlayer;
    }
}

function subscribeSelectedPieceAt(pos) {
    Visualize.removeAllSpecialBlocksFromLastSelectedPiece();
    logicSubscribeSelectedPieceAt(pos);
    Visualize.selectedPieceEffectAt(pos);
}

function logicSubscribeSelectedPieceAt(pos) {
    AssignedVar.selectedPiece = AssignedVar.currentGame.chessBoard[pos.x][pos.y];
    AssignedVar.$selectedPiece = $(`#${AssignedVar.currentGame.chessBoard[pos.x][pos.y].id}`)[0];
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