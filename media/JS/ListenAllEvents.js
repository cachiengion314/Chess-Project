import AssignedVar from "./utility/AssignedVar.js";
import Vector from "./utility/Vector.js";
import Visualize from "./utility/Visualize.js";
import { initGameBoard, onclickSelectedChessPieceAt } from "./InitGameBoard.js";

import "./web-component/WaitingTable.js";

export default function listenAllEvents() {
    responsiveSignColEventInvoke();
    onclickCreateTableBtn();
    onclickPlaySoloBtn();
    onclickBackToLobbyBtn();
    onclickOpenSignColBtn();
    onclickReadyBtn();
    onclickChangeThemeBtn();
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
            "z-index": AssignedVar.SIGN_COL_ZINDEX,
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

            $(`#play-group-btn`).hide(`fast`);
            $(`#gameplay-group-btn`).show(`fast`);
            let secondBtn = $(`#gameplay-group-btn button`)[1];
            let thirdBtn = $(`#gameplay-group-btn button`)[2];
            $(secondBtn).text(`Resigned for player 1`);
            $(thirdBtn).text(`Resigned for player 2`);

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

            $(`#play-group-btn`).hide(`fast`);
            $(`#gameplay-group-btn`).show(`fast`);
            let secondBtn = $(`#gameplay-group-btn button`)[1];
            let thirdBtn = $(`#gameplay-group-btn button`)[2];
            $(secondBtn).text(`Resigned`);
            $(thirdBtn).hide();

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

function onclickReadyBtn() {
    $(`#ready-btn`).click(function () {
        AssignedVar.isPlayerReady = true;
        $(this).hide("fast");

        if (AssignedVar.isPlayerReady /* && AssignedVar.isEnemyReady) */) {
            letPlayerControlChessPiece();
        }
    });
}

function onclickChangeThemeBtn() {
    $(`#change-theme-btn`).on(`click`, () => {
        Visualize.currentThemeIndex++;
        if (Visualize.currentThemeIndex == Visualize.themes.length) {
            Visualize.currentThemeIndex = 0;
        }
        Visualize.setThemeAt(Visualize.currentThemeIndex);
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

function letPlayerControlChessPiece() {
    for (let x = 0; x < 8; ++x) {
        for (let y = 0; y < 8; ++y) {
            let pos = new Vector(x, y);
            if (AssignedVar.chessBoard[x][y].type == AssignedVar.PIECE) {
                onclickSelectedChessPieceAt(pos);
            }
        }
    }
}