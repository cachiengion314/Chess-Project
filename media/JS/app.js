import initGameBoard from "./InitGameBoard.js";
import AssignedVar from "./utility/AssignedVar.js";
import initLobby from "./InitLobby.js";

import "./web-component/WaitingTable.js";

$(document).ready(whenDocumentFullyLoad);

function whenDocumentFullyLoad() {
    initLobby();
    onclickCreateTableBtn();
    onclickBackToLobbyBtn();
    onclickOpenSignColBtn();
}

let haveUseJS = false;

function onclickOpenSignColBtn() {
    let $signCol = $(`#sign-col`);
    $(`#sign-col-btn`).click(() => {
        haveUseJS = true;
        $signCol.css({
            "display": "block",
            "background-color": "black",
            "width": "100vw",
            "height": "100vh",
            "z-index": "12",
            "position": "fixed",
            "top": "0",
            "left": "0",
        });

        $(`#sign-col-content`).animate({
            "width": "22%",
        }, "fast");
    });

    $(window).bind(`resize`, function () {
        if (window.innerWidth > 850 && haveUseJS) {
            haveUseJS = false;
            $signCol.css({
                "display": "block",
                "width": "15%",
                "height": "100vh",
                "position": "relative",
            });

            $(`#sign-col-content`).css({
                "width": "100%",
            });
        }
        if (window.innerWidth < 850) {
            $signCol.css({
                "display": "none",
            });
            $(`#sign-col-content`).css({
                "width": "0%",
            });
        } else {
            $signCol.css({
                "display": "block",
            });
            $(`#sign-col-content`).css({
                "width": "100%",
            });
        }
    });

    window.onclick = function (e) {
        if (e.target == $signCol[0]) {
            $signCol.css({
                display: "none",
                width: "0%",
            });
            $(`#sign-col-content`).css({
                width: "0%",
            });
        }
    };
}

function onclickCreateTableBtn() {
    $(`#create-table-btn`).click(() => {
        if (AssignedVar.games.length < 1) {
            createNewChessBoard();
            let $backLobbyBtn = $(`#back-to-lobby-btn`);
            $backLobbyBtn.html(AssignedVar.LEFT_ARROW);
        } else {
            console.log(`you cannot create more game than one!`);
        }
    });
}
// need to fix this soon
function onclickBackToLobbyBtn() {
    // let $backLobbyBtn = $(`#back-to-lobby-btn`);

    // $backLobbyBtn.click(() => {

    //     if ($(`#back-to-lobby-btn`).html() === AssignedVar.CIRCLE) {
    //         console.log(`back to the lobby`, $backLobbyBtn.html());
    //         return;
    //     }
    //     let arr = $backLobbyBtn.text().split();
    //     let str = "";
    //     for (let value of arr) {
    //         str += value;
    //     }
    //     console.log(str, AssignedVar.LEFT_ARROW);
    //     if (str === AssignedVar.LEFT_ARROW) {
    //         console.log(`hidhfidhsifhdf`);
    //         $backLobbyBtn.html(AssignedVar.RIGHT_ARROW);
    //         hideChessBoardAndShowLobby();
    //     } else if (str === AssignedVar.RIGHT_ARROW) {
    //         showChessBoardAndHideLobby();
    //         $backLobbyBtn.html(AssignedVar.LEFT_ARROW);
    //     }
    // });
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