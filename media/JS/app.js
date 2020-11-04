import Player from "./Player.js";
import AssignedVar from "./AssignedVar.js";
import Vector from "./Vector.js";
import Rook from "./pieces/Rook.js";
import Empty from "./pieces/Empty.js"
import Knight from "./pieces/Knight.js";
import Bishop from "./pieces/Bishop.js";
import King from "./pieces/King.js";
import Queen from "./pieces/Queen.js";
import Pawn from "./pieces/Pawn.js";

initGameBoard();

function initGameBoard() {
    initLogicPlayer();
    initLogicPieces();
    initLogicBoard();
    console.log(`black player:`, AssignedVar.blackPlayer);
    console.log(`white player:`, AssignedVar.whitePlayer);
    console.log(`board:`, AssignedVar.chessBoard);
}

function initLogicPlayer() {
    AssignedVar.blackPlayer = new Player(AssignedVar.blackStr);
    AssignedVar.whitePlayer = new Player(AssignedVar.whiteStr);
    AssignedVar.currentPlayer = AssignedVar.whitePlayer;
}

function initLogicPieces() {
    AssignedVar.bRook = new Rook(AssignedVar.blackStr, new Vector(0, 0));
    AssignedVar.bKnight = new Knight(AssignedVar.blackStr, new Vector(1, 0));
    AssignedVar.bBishop = new Bishop(AssignedVar.blackStr, new Vector(2, 0));
    AssignedVar.bKing = new King(AssignedVar.blackStr, new Vector(3, 0));
    AssignedVar.bQueen = new Queen(AssignedVar.blackStr, new Vector(4, 0));
    AssignedVar.bBishop2 = new Bishop(AssignedVar.blackStr, new Vector(5, 0));
    AssignedVar.bKnight2 = new Knight(AssignedVar.blackStr, new Vector(6, 0));
    AssignedVar.bRook2 = new Rook(AssignedVar.blackStr, new Vector(7, 0));
    for (let i = 0; i < 8; ++i) {
        let bPawn = new Pawn(AssignedVar.blackStr, new Vector(i, 1));
        AssignedVar.bPawns.push(bPawn);
    }
    AssignedVar.wRook = new Rook(AssignedVar.whiteStr, new Vector(0, 7));
    AssignedVar.wKnight = new Knight(AssignedVar.whiteStr, new Vector(1, 7));
    AssignedVar.wBishop = new Bishop(AssignedVar.whiteStr, new Vector(2, 7));
    AssignedVar.wKing = new King(AssignedVar.whiteStr, new Vector(3, 7));
    AssignedVar.wQueen = new Queen(AssignedVar.whiteStr, new Vector(4, 7));
    AssignedVar.wBishop2 = new Bishop(AssignedVar.whiteStr, new Vector(5, 7));
    AssignedVar.wKnight2 = new Knight(AssignedVar.whiteStr, new Vector(6, 7));
    AssignedVar.wRook2 = new Rook(AssignedVar.whiteStr, new Vector(7, 7));
    for (let i = 0; i < 8; ++i) {
        let wPawn = new Pawn(AssignedVar.whiteStr, new Vector(i, 6));
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
        AssignedVar.chessBoard[piece.currentPos.xPos][piece.currentPos.yPos] = piece;
    }
    for (let piece of AssignedVar.whitePlayer.alivePieces) {
        AssignedVar.chessBoard[piece.currentPos.xPos][piece.currentPos.yPos] = piece;
    }

    initVisualizeBoard();
}

function moveLogicPiece(nextPos) {
    let piece = AssignedVar.selectedPiece;
    let currentPos = AssignedVar.selectedPiece.currentPos;
    AssignedVar.chessBoard[currentPos.xPos][currentPos.yPos] = new Empty(currentPos);
    AssignedVar.chessBoard[nextPos.xPos][nextPos.yPos] = AssignedVar.selectedPiece;
    AssignedVar.chessBoard[nextPos.xPos][nextPos.yPos].currentPos = nextPos;

    visualizeMovePiece(piece, currentPos, nextPos);
    return currentPos;
}

// all below are visualize effect functions 
function initVisualizeBoard() {
    for (let x = 0; x < 8; ++x) {
        for (let y = 0; y < 8; ++y) {
            let pos = new Vector(x, y);
            if (AssignedVar.chessBoard[x][y].type == AssignedVar.pieceStr) {
                visualizedImageAt(pos)
            }
            selectedChessBlockAt(pos);
        }
    }
}

function visualizedImageAt(pos) {
    document.getElementById(pos.convertToId()).innerHTML = AssignedVar.chessBoard[pos.xPos][pos.yPos].image;
}

function selectedChessBlockAt(pos) {
    document.getElementById(pos.convertToId()).onclick = () => {

        if (Vector.isPositionHasPiece(pos)) {
            if (AssignedVar.selectedPiece) {
                if (AssignedVar.selectedPiece.currentPos.isEqualTo(pos)) {
                    unSubscribeSelectedPieceFrom(AssignedVar.selectedPiece.currentPos);
                    return;
                }
            }
            subscribeSelectedPieceAt(pos);
        } else {
            let isPosInLegalMovess = AssignedVar.legalMovesOfSelectedPiece.filter((vector) => {
                return vector.isEqualTo(pos);
            });
            if (isPosInLegalMovess.length > 0) {
                let lastPos = moveLogicPiece(pos);
                unSubscribeSelectedPieceFrom(lastPos);
            } else {
                if (AssignedVar.selectedPiece) {
                    unSubscribeSelectedPieceFrom(AssignedVar.selectedPiece.currentPos);
                }
            }
        }
    }
}

function subscribeSelectedPieceAt(pos) {
    // visualize
    if (AssignedVar.selectedPiece) {
        document.getElementById(AssignedVar.selectedPiece.currentPos.convertToId()).style.backgroundColor = AssignedVar.boringColor;
    }
    if (AssignedVar.legalMovesOfSelectedPiece.length > 0) {
        for (let vector of AssignedVar.legalMovesOfSelectedPiece) {
            document.getElementById(vector.convertToId()).style.backgroundColor = AssignedVar.boringColor;
        }
    }
    // logic
    AssignedVar.selectedPiece = AssignedVar.chessBoard[pos.xPos][pos.yPos];
    AssignedVar.legalMovesOfSelectedPiece = AssignedVar.selectedPiece.getAllPossibleMoves();
    // visualize
    document.getElementById(pos.convertToId()).style.backgroundColor = `teal`;
    for (let vector of AssignedVar.legalMovesOfSelectedPiece) {
        document.getElementById(vector.convertToId()).style.backgroundColor = `springgreen`;
    }
}

function unSubscribeSelectedPieceFrom(lastPos) {
    // visualize
    for (let vector of AssignedVar.legalMovesOfSelectedPiece) {
        document.getElementById(vector.convertToId()).style.backgroundColor = AssignedVar.boringColor;
    }
    document.getElementById(lastPos.convertToId()).style.backgroundColor = AssignedVar.boringColor;
    document.getElementById(AssignedVar.selectedPiece.currentPos.convertToId()).style.backgroundColor = AssignedVar.boringColor;
    // logic
    AssignedVar.selectedPiece = null;
    AssignedVar.legalMovesOfSelectedPiece = [];
}

function visualizeMovePiece(piece, currentPos, nextPos) {
    document.getElementById(currentPos.convertToId()).innerHTML = ``;
    document.getElementById(nextPos.convertToId()).innerHTML = piece.image;
}