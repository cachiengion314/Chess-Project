import AssignedVar from "./utility/AssignedVar.js";
import Firebase from "./utility/Firebase.js";
import User from "./gameplay/User.js";
import Visualize from "./utility/Visualize.js";
import PopUp from "./utility/PopUp.js";
import Game from "./gameplay/Game.js";

import { initGameBoard, onclickSelectedChessPieceAt } from "./initGameBoard.js";

export default function listenAllEvents() {
    responsiveSignColEventInvoke();
    // onclick for all main buttons
    onclickSignInBtn();
    onclickSignUpBtn();
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

function onclickSignInBtn() {
    let $signInBtn = $(`#sign-col .btn-group-vertical .custom-btn`)[0];
    $signInBtn.onclick = () => {
        PopUp.showSignIn(() => {
            let $yourNameInput = $(`#sign-modal input`)[0];
            let $password1Input = $(`#sign-modal input`)[2];
            let $yourName = $(`#sign-modal .txt`)[0];
            let $password1 = $(`#sign-modal .txt`)[2];
            if (hasRedTxtShouldAppear($yourNameInput.value, $yourName) |
                hasRedTxtShouldAppear($password1Input.value, $password1)) {
                PopUp.show(`You should correct your information!`, PopUp.angryImgUrl);
            } else {
                PopUp.showLoading(() => {
                    Firebase.authenticateUser($yourNameInput.value, $password1Input.value, authenticateUserCompletedCallback);
                }, "Please waiting...! the sytem is authenticating user data from our database!");
            }
        }, clearInputvalue);
    }
}

function onclickSignUpBtn() {
    let $signUpBtn = $(`#sign-col .btn-group-vertical .custom-btn`)[1];
    $signUpBtn.onclick = () => {
        PopUp.showSignUp(() => {
            let $yourNameInput = $(`#sign-modal input`)[0];
            let $yourEmailInput = $(`#sign-modal input`)[1];
            let $password1Input = $(`#sign-modal input`)[2];
            let $password2Input = $(`#sign-modal input`)[3];
            let $yourName = $(`#sign-modal .txt`)[0];
            let $yourEmail = $(`#sign-modal .txt`)[1];
            let $password1 = $(`#sign-modal .txt`)[2];
            let $password2 = $(`#sign-modal .txt`)[3];

            if (hasRedTxtShouldAppear($yourNameInput.value, $yourName) |
                hasRedTxtShouldAppear($yourEmailInput.value, $yourEmail) |
                hasRedTxtShouldAppear($password1Input.value, $password1) |
                hasRedTxtShouldAppear($password2Input.value, $password2)) {
                PopUp.show(`You should correct your information!`, PopUp.angryImgUrl);
            } else {
                if ($password1Input.value == $password2Input.value) {
                    PopUp.showLoading(() => {
                        Firebase.findNameAndEmailDuplicate($yourNameInput.value, $yourEmailInput.value, $password1Input.value, findNameAndEmailDuplicateCompletedCallback)
                    }, "Please waiting...! the sytem is authenticating user data from our database!");
                } else {
                    hasRedTxtShouldAppear($password2Input.value, $password2, $password1Input.value);
                    PopUp.show(`Your "clarify password" doesn't match upper password`, PopUp.jokeImgUrl);
                }
            }
        }, clearInputvalue);
    }
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
            AssignedVar.currentGame = new Game(0, new User("cachiengion314"), new User("anoyingGuys"), AssignedVar.OFFLINE);
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
            AssignedVar.currentGame = new Game(0, new User("cachiengion314"), new User("anoyingGuys"), AssignedVar.ONLINE);
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
        AssignedVar.currentGame.userAcc.isReady = true;
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
            PopUp.showYesNo(`Are you sure want to resign?`, PopUp.questionImgUrl, loseGameResult);
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
// utility functions
function authenticateUserCompletedCallback(isPasswordRight, userInfo) {
    setTimeout(() => {
        if (userInfo == AssignedVar.NO_USER) {
            PopUp.show(`Sorry! Your info are not in our database!`, PopUp.questionImgUrl);
        } else {
            if (isPasswordRight) {
                PopUp.closeModal(`#sign-modal`, () => {
                    PopUp.show(`Wellcome back "${userInfo.name}"! Please play some games!`, PopUp.cuteImgUrl);
                    clearInputvalue();
                });
            } else {
                PopUp.show(`Account "${userInfo.name}" have different password! Please type the right one!`, PopUp.angryImgUrl);
            }
        }
    }, AssignedVar.FAKE_LOADING_TIME);
}

function findNameAndEmailDuplicateCompletedCallback(isNameDuplicate, isEmailDuplicate, userInfo) {
    setTimeout(() => {
        if (isNameDuplicate && !isEmailDuplicate) {
            PopUp.show(`your name is duplicate in our database! Please choose another one!`, PopUp.angryImgUrl);
        } else if (!isNameDuplicate && isEmailDuplicate) {
            PopUp.show(`your email is duplicate in our database! Please choose another one!`, PopUp.angryImgUrl);
        } else if (isNameDuplicate && isEmailDuplicate) {
            PopUp.show(`your name and email is duplicate in our database! Please choose another one!`, PopUp.angryImgUrl);
        } else {
            Firebase.setUser(userInfo, () => {
                PopUp.closeModal(`#sign-modal`, () => {
                    PopUp.show(`Congratulation! Your assignment is done!`);
                    clearInputvalue();
                });
            },
                (errorCode) => { PopUp.show(`There is an error! "${errorCode}" in this!`, PopUp.sadImgUrl) }
            );
        }
    }, AssignedVar.FAKE_LOADING_TIME);
}

function loseGameResult() {
    PopUp.show(`player "${AssignedVar.currentGame.userAcc.name}" have lost the game`, PopUp.sadImgUrl);
    AssignedVar.currentGame.enemyAcc.tempWins++;
    let $winsTxt = $(`#enemy-block .align-end div`)[0];
    $winsTxt.textContent = `Wins: ${AssignedVar.currentGame.enemyAcc.tempWins}`;
    AssignedVar.currentGame.resetGameBoard();
    showReadyBtn();
}

function hideReadyBtn() {
    let $readyBtn = $(`#ready-btn`);
    $($readyBtn).animate({
        "left": "40%",
        "opacity": ".8",
    }, "fast");
    $($readyBtn).animate({
        "left": "80%",
        "opacity": ".4",
    }, "fast");
    $($readyBtn).animate({
        "opacity": "0",
    }, "fast", () => $($readyBtn).hide());
}

function showReadyBtn() {
    let $readyBtn = $(`#ready-btn`);
    $($readyBtn).show();
    $($readyBtn).css({
        "left": "50%",
        "opacity": "1",
    });
}

function clearInputvalue() {
    $(`#sign-modal input`).val("");
}

function hasRedTxtShouldAppear(inputVal, $txtDom, password1 = `i_dont_need_password`) {
    if (inputVal == "" || password1 != `i_dont_need_password` && inputVal != password1) {
        let origintTitle = $txtDom.textContent.replace(`Type`, ``);
        origintTitle = origintTitle.replace(`again`, ``);
        origintTitle = origintTitle.replace(/"/g, ``);
        if (!$txtDom.classList.contains(`red`)) {
            $txtDom.classList.toggle(`red`);
        }
        $txtDom.textContent = `Type "${origintTitle}" again`;
        return true;
    }

    let title = $txtDom.textContent.replace(`Type`, ``);
    title = title.replace(`again`, ``);
    title = title.replace(/"/g, ``);
    $txtDom.textContent = title;
    if ($txtDom.classList.contains(`red`)) {
        $txtDom.classList.toggle(`red`);
    }
    return false;
}