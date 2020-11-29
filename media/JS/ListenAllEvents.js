import AssignedVar from "./utility/AssignedVar.js";
import Vector from "./utility/Vector.js";
import Visualize from "./utility/Visualize.js";
import PopUp from "./utility/PopUp.js";
import Game from "./gameplay/Game.js";

import { initGameBoard, onclickSelectedChessPieceAt } from "./initGameBoard.js";

export default function listenAllEvents() {
    responsiveSignColEventInvoke();
    // onclick for all main buttons
    onclickCreateTableBtn();
    onclickPlaySoloBtn();
    onclickBackToLobbyBtn();
    onclickOpenSignColBtn();
    onclickReadyBtn();
    onclickResignedBtn();
    onclickOfferADrawBtn();
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
            AssignedVar.currentGame = new Game(0, AssignedVar.OFFLINE);
            AssignedVar.currentGame.createNewChessBoard();

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
            AssignedVar.currentGame = new Game(0, AssignedVar.ONLINE);
            AssignedVar.currentGame.createNewChessBoard();

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
        AssignedVar.currentGame.isUserReady = true;
        hideReadyBtn();
        if (AssignedVar.currentGame.isGamePlaying) {
            AssignedVar.currentGame.letPlayerControlChessPiece();
        }
    });
}

function onclickResignedBtn() {
    let $drawsTxt = $(`#user-block .align-end div`)[1];
    let $timeLeftTxt = $(`#user-block .align-end div`)[2];
    let $resignedBtn = $(`#function-col #gameplay-group-btn button`)[1];
    $($resignedBtn).click(() => {
        if (AssignedVar.currentGame.isGamePlaying) {
            
            PopUp.showYesNo(`Are you sure want to resign?`, PopUp.questionMarkImgUrl,
                loseGameResult
            );
        } else {
            PopUp.show(`The game have to in playing stage in order to resign the enemy!`, PopUp.sadImgUrl);
        }
    })
}
function onclickOfferADrawBtn() {
    let $drawBtn = $(`#function-col #gameplay-group-btn button`)[0];
    $($drawBtn).click(() => {
        switch (AssignedVar.currentGame.gameMode) {
            case AssignedVar.ONLINE:
                if (AssignedVar.currentGame.isGamePlaying) {
                    PopUp.show(`you have send a draw request to the enemy!`);

                } else {
                    PopUp.show(`The game have to in playing stage in order to send a draw request to the enemy!`, PopUp.sadImgUrl);
                }
                break;
            case AssignedVar.OFFLINE:
                PopUp.show(`Hey we are in the offline mode!`);
                break;
        }
    });
}

function onclickChangeThemeBtn() {
    $(`#change-theme-btn`).click(() => {
        Visualize.currentThemeIndex++;
        if (Visualize.currentThemeIndex == Visualize.themes.length) {
            Visualize.currentThemeIndex = 0;
        }
        Visualize.setThemeAt(Visualize.currentThemeIndex);
    });
}

function loseGameResult() {
    // PopUp.show(`User "${AssignedVar.thisUser.name}" have lost the game`, PopUp.sadImgUrl);
    AssignedVar.enemyUser.tempWins++;
    let $winsTxt = $(`#enemy-block .align-end div`)[0];
    $winsTxt.textContent = `Wins: ${AssignedVar.enemyUser.tempWins}`;
    AssignedVar.currentGame.resetGameBoard();
    showReadyBtn();
}

function hideReadyBtn() {
    let $readyBtn = $(`#ready-btn`);
    $($readyBtn).animate({
        "left": "100%",
        "opacity": ".5",
    }, "fast");
    $($readyBtn).animate({
        "opacity": "0",
    }, "slow", () => $($readyBtn).hide());
}

function showReadyBtn() {
    let $readyBtn = $(`#ready-btn`);
    $($readyBtn).show();
    $($readyBtn).css({
        "left": "50%",
        "opacity": "1",
    });
}