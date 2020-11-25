import AssignedVar from "./utility/AssignedVar.js";
import initGameBoard from "./InitGameBoard.js";

import "./web-component/WaitingTable.js";

export default function listenAllEvents() {
    responsiveSignColEventInvoke();
    onclickCreateTableBtn();
    onclickPlaySoloBtn();
    onclickBackToLobbyBtn();
    onclickOpenSignColBtn();
    listenResizeEvent();
}

function onclickOpenSignColBtn() {
    $(`#sign-col-btn`).click(() => {
        AssignedVar.haveUsedSignColButton = true;
        $(`#sign-col`).css({
            "display": "block",
            "background-color": "rgba(0, 0, 0, 0.7)",
            "width": "100vw",
            "height": "100vh",
            "z-index": "12",
            "position": "fixed",
            "top": "0",
            "left": "0",
        });
        if (window.innerWidth < 501) {
            $(`#sign-col-content`).animate({
                "width": "40%",
            }, "fast");
        } else {
            $(`#sign-col-content`).animate({
                "width": "30%",
            }, "fast");
        }
    });

    onclickCloseSignColEvent();
}

function onclickCloseSignColEvent() {
    let $signCol = $(`#sign-col`);
    $(window).on(`click`, (e) => {
        if (e.target == $signCol[0]) {
            $signCol.css({
                display: "none",
                width: "0%",
            });
            $(`#sign-col-content`).css({
                width: "0%",
            });
        }
    });
}

function listenResizeEvent() {
    $(window).bind(`resize`, function () {
        switch (AssignedVar.haveUsedSignColButton) {
            case true:
                if (window.innerWidth > AssignedVar.MAX_SCREEN_WIDTH) {
                    $(`#sign-col`).css({
                        "display": "block",
                        "width": "18%",
                        "height": "100vh",
                        "position": "relative",
                    });
                    $(`#sign-col-content`).css({
                        "width": "100%",
                    });
                    AssignedVar.haveUsedSignColButton = false;
                }
                break;
            case false:
                responsiveSignColEventInvoke();
                break;
        }
    });
}

function responsiveSignColEventInvoke() {
    let $signCol = $(`#sign-col`);
    if (window.innerWidth < AssignedVar.MAX_SCREEN_WIDTH) {
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
}
function onclickPlaySoloBtn() {
    $(`#play-solo-btn`).click(() => {
        if (AssignedVar.games.length < 1) {
            createNewChessBoard();
            let $backLobbyBtn = $(`#back-to-lobby-btn`);
            $backLobbyBtn.html(AssignedVar.LEFT_ARROW);
        } else {
            console.log(`you cannot create more game than one!`);
        }
    });
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