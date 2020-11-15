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
import "./ChessPiece.js";
import "./SpecialBlock.js";

$(document).ready(readyCallback);

function readyCallback() {
    initGameBoard();
}

function initGameBoard() {
    initLogicPlayer();
    initLogicPieces();
    initLogicBoard();
    console.log(`black player:`, AssignedVar.blackPlayer);
    console.log(`white player:`, AssignedVar.whitePlayer);
    console.log(`board:`, AssignedVar.chessBoard);
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
            if (AssignedVar.chessBoard[pos.x][pos.y].type == AssignedVar.PIECE) {
                visualizePieceImageAt(pos);
            }
        }
    }
    for (let x = 0; x < 8; ++x) {
        for (let y = 0; y < 8; ++y) {
            let pos = new Vector(x, y);
            visualizedChessBlockImageAt(pos);
            selectedChessPieceAt(pos);
            if (AssignedVar.chessBoard[pos.x][pos.y].type == AssignedVar.PIECE) {
                selectHidedBlockAt(pos);
            }
        }
    }
}

function visualizedChessBlockImageAt(pos) {
    let $specialBlock = createChessComponent(AssignedVar.SPECIAL_BLOCK);
    if (pos.isXYUniform()) {
        $specialBlock.blocktype = AssignedVar.VISUALIZE_BLOCK_EVEN;
    } else {
        $specialBlock.blocktype = AssignedVar.VISUALIZE_BLOCK_ODD;
    }
    if (AssignedVar.chessBoard[pos.x][pos.y].type != AssignedVar.PIECE) {
        $specialBlock.id = AssignedVar.chessBoard[pos.x][pos.y].getId();
    } else {
        $specialBlock.id = AssignedVar.EMPTY + "_" + pos.convertToId();
    }
    setChessComponentPositionAt(pos, $specialBlock);
}

function visualizePieceImageAt(pos) {
    let $chessPiece = createChessComponent(AssignedVar.CHESS_PIECE);
    $chessPiece.name = AssignedVar.chessBoard[pos.x][pos.y].name;
    $chessPiece.id = AssignedVar.chessBoard[pos.x][pos.y].getId();
    setChessComponentPositionAt(pos, $chessPiece);
}

function setChessComponentPositionAt(pos, $chessComponent) {
    $chessComponent.style.left = pos.convertToPercentPosition().left;
    $chessComponent.style.top = pos.convertToPercentPosition().top;
}

function createChessComponent(componentName) {
    let $cComponent = document.createElement(componentName);
    $(`.chess-board`).append($cComponent);
    return $cComponent;
}

function moveLogicPieceTo(nextPos) {
    let currentPos = AssignedVar.selectedPiece.currentPos;
    AssignedVar.chessBoard[currentPos.x][currentPos.y] = new Empty(currentPos);
    AssignedVar.chessBoard[nextPos.x][nextPos.y] = AssignedVar.selectedPiece;
    AssignedVar.chessBoard[nextPos.x][nextPos.y].currentPos = nextPos;
    AssignedVar.$selectedPiece.id = AssignedVar.selectedPiece.getId();
    visualizeMovePiece(AssignedVar.$selectedPiece, currentPos, nextPos);
    return currentPos;
}

function visualizeMovePiece($selectedPiece, currentPos, nextPos) {
    $(`#${$selectedPiece.id}`).animate({
        left: nextPos.convertToPercentPosition().left,
        top: nextPos.convertToPercentPosition().top,
    }, `slow`);
}

function selectHidedBlockAt(fixedPosition) {
    let $emptyBlock = $(`#${AssignedVar.EMPTY}_${fixedPosition.convertToId()}`);
    $emptyBlock.on(`click`, () => { blockOnClickCallback($emptyBlock); });
}

function selectedChessPieceAt(fixedPosition) {
    let $chessPiece = $(`#${AssignedVar.chessBoard[fixedPosition.x][fixedPosition.y].getId()}`);
    $chessPiece.on(`click`, () => { blockOnClickCallback($chessPiece); });
}

function blockOnClickCallback($block) {
    let pos = Vector.convertIdToVector($block[0].id);
    if (Vector.isPositionHasPiece(pos)) {
        if (AssignedVar.selectedPiece) {
            if (AssignedVar.selectedPiece.currentPos.isEqualTo(pos)) {
                unSubscribeSelectedPiece();
                return;
            }
        }
        subscribeSelectedPieceAt(pos);
    } else {
        let isPosInLegalMovess = AssignedVar.legalMovesOfSelectedPiece.filter((vector) => {
            return vector.isEqualTo(pos);
        });
        if (isPosInLegalMovess.length > 0) {
            moveLogicPieceTo(pos);
            unSubscribeSelectedPiece();
        } else {
            if (AssignedVar.selectedPiece) {
                unSubscribeSelectedPiece();
            }
        }
    }
}

function subscribeSelectedPieceAt(pos) {
    // visualize
    removeAllSpecialBlocksFromLastSelectedPiece();
    // logic
    logicSubscribeSelectedPieceAt(pos);
    // visualize
    let $positionBlock = $(`#${AssignedVar.EMPTY + "_" + pos.convertToId()}`)[0];
    $positionBlock.blocktype = AssignedVar.POSITION_BLOCK;
    AssignedVar.selectedPieceSpecialBlocks.push($positionBlock);
    for (let legalMovesPos of AssignedVar.legalMovesOfSelectedPiece) {
        let $highlightBlock = $(`#${AssignedVar.EMPTY + "_" + legalMovesPos.convertToId()}`)[0];
        $highlightBlock.blocktype = AssignedVar.HIGHLIGHT_BLOCK;
        AssignedVar.selectedPieceSpecialBlocks.push($highlightBlock);
    }
}

function logicSubscribeSelectedPieceAt(pos) {
    AssignedVar.selectedPiece = AssignedVar.chessBoard[pos.x][pos.y];
    AssignedVar.$selectedPiece = $(`#${AssignedVar.chessBoard[pos.x][pos.y].getId()}`)[0];
    AssignedVar.legalMovesOfSelectedPiece = AssignedVar.selectedPiece.getAllPossibleMoves();
}

function unSubscribeSelectedPiece() {
    // visualize
    removeAllSpecialBlocksFromLastSelectedPiece();
    // logic
    logicUnSubscribeSelectedPiece();
}

function logicUnSubscribeSelectedPiece() {
    AssignedVar.selectedPiece = null;
    AssignedVar.$selectedPiece = null;
    AssignedVar.legalMovesOfSelectedPiece = [];
}

function removeAllSpecialBlocksFromLastSelectedPiece() {
    for (let block of AssignedVar.selectedPieceSpecialBlocks) {
        let pos = Vector.convertIdToVector(block.id);
        if (pos.isXYUniform()) {
            block.blocktype = AssignedVar.VISUALIZE_BLOCK_EVEN;
        } else {
            block.blocktype = AssignedVar.VISUALIZE_BLOCK_ODD;
        }
    }
    AssignedVar.selectedPieceSpecialBlocks.splice(0);
}