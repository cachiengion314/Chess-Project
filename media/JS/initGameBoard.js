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
import Game from "./gameplay/Game.js";
import Firebase from "./utility/Firebase.js";
import User from "./gameplay/User.js";
import AI from "./gameplay/AI.js";
import ChatBox from "./utility/ChatBox.js";

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

    Game.blackPlayer.alivePieces.push(AssignedVar.bRook, AssignedVar.bKnight, AssignedVar.bBishop, AssignedVar.bKing, AssignedVar.bQueen,
        AssignedVar.bBishop2, AssignedVar.bKnight2, AssignedVar.bRook2, ...AssignedVar.bPawns);
    Game.whitePlayer.alivePieces.push(AssignedVar.wRook, AssignedVar.wKnight, AssignedVar.wBishop, AssignedVar.wKing, AssignedVar.wQueen,
        AssignedVar.wBishop2, AssignedVar.wKnight2, AssignedVar.wRook2, ...AssignedVar.wPawns);
}

function initLogicBoard() {
    for (let x = 0; x < 8; ++x) {
        AssignedVar.currentGame.chessBoard.push([]);
        for (let y = 0; y < 8; ++y) {
            AssignedVar.currentGame.chessBoard[x].push(new Empty(new Vector(x, y)));
        }
    }
    for (let piece of Game.blackPlayer.alivePieces) {
        AssignedVar.currentGame.chessBoard[piece.currentPos.x][piece.currentPos.y] = piece;
    }
    for (let piece of Game.whitePlayer.alivePieces) {
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
            }
        }
    }
}

function onclickSelectedEmptyAt(fixedPosition) {
    let $emptyBlock = $(`#${AssignedVar.EMPTY}_${fixedPosition.convertToId()}`);
    $emptyBlock.on(`click`, () => {
        let pos = Vector.convertIdToVector($emptyBlock[0].id)
        setupOnClickCallbackAt(pos);
    });
}

export function onclickSelectedChessPieceAt(fixedPosition) {
    let $chessPiece = $(`#${AssignedVar.currentGame.chessBoard[fixedPosition.x][fixedPosition.y].id}`)[0];
    $chessPiece.onclick = () => {
        let pos = Vector.convertIdToVector($chessPiece.id);
        if (AssignedVar.currentGame.gameMode == AssignedVar.ONLINE) {
            if (User.isTableOwner()) {
                if (User.isOwnerTurn()) {
                    allowControllPieceAt(pos, $chessPiece);
                } else {
                    if (pos.isPositionHasPiece()) {
                        Visualize.cannotAttackPieceEffect($chessPiece);
                    }
                }
            } else {
                if (!User.isOwnerTurn()) {
                    allowControllPieceAt(pos, $chessPiece);
                } else {
                    if (pos.isPositionHasPiece()) {
                        Visualize.cannotAttackPieceEffect($chessPiece);
                    }
                }
            }
        } else {
            allowControllPieceAt(pos, $chessPiece);
        }
    };
}

function allowControllPieceAt(pos, $chessPiece) {
    if (AssignedVar.currentGame.currentPlayer.id == $chessPiece.controlbyplayerid) {
        setupOnClickCallbackAt(pos);
    } else {
        if (pos.isPositionInLegalMoves()) {
            setupOnClickCallbackAt(pos);
        } else {
            if (pos.isPositionHasPiece()) {
                Visualize.cannotAttackPieceEffect($chessPiece);
            }
        }
    }
}

export function mimicOnclickMovePieceAt(pos) {
    if (pos.isPositionHasPiece()) {
        if (AssignedVar.selectedPiece) {
            let pieceAtPos = AssignedVar.currentGame.chessBoard[pos.x][pos.y];
            logicDestroyEnemyPiece(pieceAtPos);
            checkDestroyKingEvent(pieceAtPos);
            mimicEnemyLogicMovePieceTo(pos);
            checkPromotePawnEvent(AssignedVar.selectedPiece);
            showCheckKing();

            unSubscribeSelectedPiece();
            changePlayerTurn();
            Game.clearAndStartCountTime();
        } else {
            subscribeSelectedPieceAt(pos);
        }
    } else {
        if (pos.isPositionInLegalMoves()) {
            checkCastleEvent(AssignedVar.selectedPiece, pos);
            mimicEnemyLogicMovePieceTo(pos);
            checkPromotePawnEvent(AssignedVar.selectedPiece);
            showCheckKing();

            unSubscribeSelectedPiece();
            changePlayerTurn();
            Game.clearAndStartCountTime();
        } else {
            if (AssignedVar.selectedPiece) {
                unSubscribeSelectedPiece();
            }
        }
    }

}

export function setupOnClickCallbackAt(pos) {
    if (pos.isPositionHasPiece()) {
        if (AssignedVar.selectedPiece) {
            let pieceAtPos = AssignedVar.currentGame.chessBoard[pos.x][pos.y];
            if (pieceAtPos.controlByPlayerId == AssignedVar.currentGame.currentPlayer.id) {
                unSubscribeSelectedPiece();
            } else {
                logicDestroyEnemyPiece(pieceAtPos);
                let isKingDead = checkDestroyKingEvent(pieceAtPos);
                logicMovePieceTo(pos);
                checkPromotePawnEvent(AssignedVar.selectedPiece);
                showCheckKing();

                unSubscribeSelectedPiece();
                changePlayerTurn();
                Game.clearAndStartCountTime();
                if (!isKingDead && AI.isOn) {
                    AI.setupMoveFor(AssignedVar.currentTable.opponent.controllingColor);
                }
            }
        } else {
            subscribeSelectedPieceAt(pos);
        }
    } else {
        if (pos.isPositionInLegalMoves()) {
            checkCastleEvent(AssignedVar.selectedPiece, pos);
            logicMovePieceTo(pos);
            checkPromotePawnEvent(AssignedVar.selectedPiece);
            showCheckKing();

            unSubscribeSelectedPiece();
            changePlayerTurn();
            Game.clearAndStartCountTime();
            if (AI.isOn) {
                AI.setupMoveFor(AssignedVar.currentTable.opponent.controllingColor);
            }
        } else {
            if (AssignedVar.selectedPiece) {
                unSubscribeSelectedPiece();
            }
        }
    }
}

function showCheckKing() {
    let chessBoard = AssignedVar.currentGame.chessBoard;
    let isW_KingChecked = false;
    let isB_KingChecked = false;
    let isNeedSearch = true;
    for (let x = 0; x < chessBoard.length && isNeedSearch; ++x) {
        for (let y = 0; y < chessBoard[x].length && isNeedSearch; ++y) {
            let selectedPiece = chessBoard[x][y];
            if (selectedPiece.getWeights() > 0) {
                if (selectedPiece.color == AssignedVar.currentGame.currentPlayer.color) {
                    let friends_atkPosOnlyArr = selectedPiece.getAtkPosOnly();
                    for (let f_pos of friends_atkPosOnlyArr) {
                        let potentialEnemyKing = AssignedVar.currentGame.chessBoard[f_pos.x][f_pos.y];
                        if (potentialEnemyKing.getWeights() == 60000) {
                            if (potentialEnemyKing.color == AssignedVar.BLACK) {
                                ChatBox.show(ChatBox.OWNER_CHATBOX_ID, `Cẩn thận! Chiếu tướng đấy!`);
                                isB_KingChecked = true;
                            } else {
                                ChatBox.show(ChatBox.OPPONENT_CHATBOX_ID, `Cẩn thận! Chiếu tướng đấy!`);
                                isW_KingChecked = true;
                            }
                            isNeedSearch = false;
                            break;
                        }
                    }
                }
            }
        }
    }
    AssignedVar.wKing.isChecked = isW_KingChecked;
    AssignedVar.bKing.isChecked = isB_KingChecked;
}

export function logicDestroyEnemyPiece(logicEnemyPiece) {
    if (logicEnemyPiece.controlByPlayerId == 0) {
        Game.whitePlayer.alivePieces = Game.whitePlayer.alivePieces.filter(item => {
            return item.id != logicEnemyPiece.id;
        });
        Game.whitePlayer.deathPieces.push(logicEnemyPiece);
    } else {
        Game.blackPlayer.alivePieces = Game.blackPlayer.alivePieces.filter(item => {
            return item.id != logicEnemyPiece.id;
        });
        Game.blackPlayer.deathPieces.push(logicEnemyPiece);
    }
    AssignedVar.currentGame.chessBoard[logicEnemyPiece.currentPos.x][logicEnemyPiece.currentPos.y] = new Empty(logicEnemyPiece.currentPos);

    Visualize.destroyEnemyPiece($(`#${logicEnemyPiece.id}`)[0]);
}

function checkCastleEvent(logicPiece, nextPos) {
    if (logicPiece.name == AssignedVar.KING_W || logicPiece.name == AssignedVar.KING_B) {
        if (logicPiece.posToCastle && logicPiece.posToCastleRook) {
            if (nextPos.isEqualTo(logicPiece.posToCastle) && !logicPiece.hasMoved) {
                let dir = logicPiece.posToCastleRook.plusVector(logicPiece.posToCastle.multipliByNumber(-1)).multipliByNumber(-1);
                let newPos = logicPiece.posToCastle.plusVector(dir);
                let oldRook = AssignedVar.currentGame.chessBoard[logicPiece.posToCastleRook.x][logicPiece.posToCastleRook.y];
                if (oldRook.type == AssignedVar.PIECE) {
                    AssignedVar.currentGame.chessBoard[oldRook.currentPos.x][oldRook.currentPos.y] = new Empty(oldRook.currentPos);
                    Visualize.destroyEnemyPiece($(`#${oldRook.id}`)[0]);
                }
                let newRook = spawnLogicPieceAt(newPos, Rook, logicPiece.color);
                newRook.hasMoved = true;
                logicPiece.posToCastle = null;
                logicPiece.posToCastleRook = null;
            }
        }
    }
}

function spawnLogicPieceAt(pos, Class, color) {
    AssignedVar.currentGame.chessBoard[pos.x][pos.y] = new Class(color, pos);
    Visualize.chessPieceImageAt(pos);
    onclickSelectedChessPieceAt(pos);
    Visualize.onPieceMouseEnterOf($(`#${AssignedVar.currentGame.chessBoard[pos.x][pos.y].id}`)[0]);
    Visualize.onPieceMouseLeaveOf($(`#${AssignedVar.currentGame.chessBoard[pos.x][pos.y].id}`)[0]);
    return AssignedVar.currentGame.chessBoard[pos.x][pos.y];
}

function checkPromotePawnEvent(logicPiece) {
    let color = AssignedVar.WHITE;
    let currentPos = logicPiece.currentPos;
    if (currentPos.isBoardLastLine()) {
        if (logicPiece.name == AssignedVar.PAWN_W) {
            AssignedVar.currentGame.chessBoard[currentPos.x][currentPos.y] = new Queen(AssignedVar.WHITE, currentPos);
            Visualize.promotePawnEvent($(`#${logicPiece.id}`)[0], currentPos, color);
        } else if (logicPiece.name == AssignedVar.PAWN_B) {
            color = AssignedVar.BLACK;
            AssignedVar.currentGame.chessBoard[currentPos.x][currentPos.y] = new Queen(AssignedVar.BLACK, currentPos);
            Visualize.promotePawnEvent($(`#${logicPiece.id}`)[0], currentPos, color);
        }
    }
}

function checkDestroyKingEvent(logicEnemyPiece) {
    if (logicEnemyPiece.name == AssignedVar.KING_W || logicEnemyPiece.name == AssignedVar.KING_B) {
        if (AssignedVar.currentGame.gameMode == AssignedVar.ONLINE) {
            if (User.isMyPiece(logicEnemyPiece)) {
                Game.loseGameResult();
            }
        } else {
            if (User.isOwnerPiece(logicEnemyPiece)) {
                setTimeout(() => {
                    Game.loseGameResult();
                }, 300);
            } else {
                setTimeout(() => {
                    Game.winGameResult_onlyForOfflineMode();
                }, 300);
            }
        }
        return true;
    }
    return false;
}

function mimicEnemyLogicMovePieceTo(nextPos) {
    let currentPos = AssignedVar.selectedPiece.currentPos;
    AssignedVar.currentGame.chessBoard[currentPos.x][currentPos.y] = new Empty(currentPos);
    AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y] = AssignedVar.selectedPiece;
    AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y].currentPos = nextPos;
    AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y].id = AssignedVar.selectedPiece.getId();
    AssignedVar.$selectedPiece.id = AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y].id;

    Visualize.movePiece(AssignedVar.$selectedPiece, currentPos, nextPos);
}

export function logicMovePieceTo(nextPos) {
    let currentPos = AssignedVar.selectedPiece.currentPos;
    AssignedVar.currentGame.chessBoard[currentPos.x][currentPos.y] = new Empty(currentPos);
    AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y] = AssignedVar.selectedPiece;
    AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y].currentPos = nextPos;
    AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y].id = AssignedVar.selectedPiece.getId();
    AssignedVar.$selectedPiece.id = AssignedVar.currentGame.chessBoard[nextPos.x][nextPos.y].id;

    let name = AssignedVar.$selectedPiece.id.split("_")[0];
    let lastMoveId = name + "_" + currentPos.convertToId();
    if (AssignedVar.currentGame.gameMode == AssignedVar.ONLINE) {
        Firebase.updateMove(Firebase.currentTableId, lastMoveId, AssignedVar.$selectedPiece.id, () => {
            console.log(`logicMovePieceTo: lastMoveId, moveId`, lastMoveId, AssignedVar.$selectedPiece.id);
        });
    }

    Visualize.movePiece(AssignedVar.$selectedPiece, currentPos, nextPos);
}

export function changePlayerTurn() {
    if (AssignedVar.currentGame.currentPlayer.id == 0) {
        AssignedVar.currentGame.currentPlayer = Game.blackPlayer;
    } else {
        AssignedVar.currentGame.currentPlayer = Game.whitePlayer;
    }
}

export function subscribeSelectedPieceAt(pos) {
    Visualize.removeAllSpecialBlocksFromLastSelectedPiece();
    logicSubscribeSelectedPieceAt(pos);
    Visualize.selectedPieceEffectAt(pos);
}

function logicSubscribeSelectedPieceAt(pos) {
    AssignedVar.selectedPiece = AssignedVar.currentGame.chessBoard[pos.x][pos.y];
    AssignedVar.$selectedPiece = $(`#${AssignedVar.currentGame.chessBoard[pos.x][pos.y].id}`)[0];
    AssignedVar.legalMovesOfSelectedPiece = AssignedVar.selectedPiece.getAllPossibleMoves();
}

export function unSubscribeSelectedPiece() {
    Visualize.removeAllSpecialBlocksFromLastSelectedPiece();
    logicUnSubscribeSelectedPiece();
}

function logicUnSubscribeSelectedPiece() {
    AssignedVar.selectedPiece = null;
    AssignedVar.$selectedPiece = null;
    AssignedVar.legalMovesOfSelectedPiece = [];
}