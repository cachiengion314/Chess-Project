import initGameBoard from "./InitGameBoard.js";
import AssignedVar from "./utility/AssignedVar.js";
import Visualize from "./utility/Visualize.js";
import initLobby from "./InitLobby.js";

import "./web-component/WaitingTable.js";

$(document).ready(whenDocumentFullyLoad);

function whenDocumentFullyLoad() {
    initLobby();
    onclickCreateTable();
    onclickBackToLobby();
}

function onclickCreateTable() {
    $(`#create-table-btn`).click(() => {
        if (AssignedVar.games.length < 1) {
            createNewChessBoard();
        } else {
            console.log(`you cannot create more game than one!`);
        }
    });
}
function onclickBackToLobby() {
    let $backLobbyBtn = $(`#back-to-lobby-btn`);
    let BACK_TO_THE_GAME = $backLobbyBtn.text();
    $backLobbyBtn.click(() => {
        if ($backLobbyBtn.text() === BACK_TO_THE_GAME) {
            $backLobbyBtn.text(`Return to the game`);
            hideChessBoardAndShowLobby();
        } else {
            showChessBoardAndHideLobby();
            $backLobbyBtn.text(BACK_TO_THE_GAME);
        }
    });
}
function emptyWaitingTables() {
    $(`#waiting-tables`).empty();
}
function createNewChessBoard() {
    showChessBoardAndHideLobby();
    let $chessBoard = document.createElement(`chess-board`);
    $(`#board-package`).append($chessBoard);
    initGameBoard();
}
function showChessBoardAndHideLobby() {
    emptyWaitingTables();
    $(`#waiting-tables`).hide(`fast`);
    $(`#board-package`)[0].setAttribute(`style`, `display: flex !important; height: 80%;`);
}
function hideChessBoardAndShowLobby() {
    $(`#board-package`)[0].setAttribute(`style`, `display: none;`);
    $(`#waiting-tables`).show(`fast`);
    initLobby();
}