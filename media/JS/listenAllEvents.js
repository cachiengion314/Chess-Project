import AssignedVar from "./utility/AssignedVar.js";
import Firebase from "./utility/Firebase.js";
import User from "./gameplay/User.js";
import Visualize from "./utility/Visualize.js";
import PopUp from "./utility/PopUp.js";
import Game from "./gameplay/Game.js";
import Vector from "./utility/Vector.js";

import {
    subscribeSelectedPieceAt, changePlayerTurn, logicMovePieceTo, logicDestroyEnemyPiece,
    unSubscribeSelectedPiece, setupOnClickCallbackAt, updateToFirestoreData
} from "./initGameBoard.js";

export default function listenAllEvents() {
    User.saveDataForTheFirstTime();
    User.checkUserSignStatus();
    responsiveSignColEventInvoke();
    // onclick for all main buttons
    onclickSignInBtn();
    onclickSignUpBtn();
    onclickSignOutBtn();
    onclickOnlineModeBtn();
    onclickPlaySoloBtn();
    onclickQuitGameBtn();
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
        if (AssignedVar.IsUserAndEnemyReady) {
            PopUp.show(`You cannot sign in when playing`);
            return;
        }
        PopUp.showSignIn(() => {
            let $yourNameInput = $(`#sign-modal input`)[0];
            let $password1Input = $(`#sign-modal input`)[2];
            let $yourName = $(`#sign-modal .txt`)[0];
            let $password1 = $(`#sign-modal .txt`)[2];
            if (hasRedTxtShouldAppear($yourNameInput.value, $yourName) |
                hasRedTxtShouldAppear($password1Input.value, $password1)) {
                PopUp.show(`You should correct your informations!`, PopUp.angryImgUrl);
            } else {
                PopUp.showLoading(() => {
                    Firebase.authenticateUser($yourNameInput.value, $password1Input.value, authenticateUserCompletedCallback);
                }, "Please waiting...! the sytem is authenticating user data from our database!", AssignedVar.FAKE_LOADING_TIME);
            }
        }, clearInputvalue);
    }
}

function onclickSignUpBtn() {
    let $signUpBtn = $(`#sign-col .btn-group-vertical .custom-btn`)[1];
    $signUpBtn.onclick = () => {
        if (AssignedVar.IsUserAndEnemyReady) {
            PopUp.show(`You cannot sign up when playing`);
            return;
        }
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
                PopUp.show(`You should correct your informations!`, PopUp.angryImgUrl);
            } else {
                if ($password1Input.value == $password2Input.value) {
                    PopUp.showLoading(() => {
                        Firebase.findNameAndEmailDuplicate($yourNameInput.value, $yourEmailInput.value, $password1Input.value, findNameAndEmailDuplicateCompletedCallback)
                    }, "Please waiting...! the sytem is authenticating user data from our database!", AssignedVar.FAKE_LOADING_TIME);
                } else {
                    hasRedTxtShouldAppear($password2Input.value, $password2, $password1Input.value);
                    PopUp.show(`Your "clarify password" doesn't match upper password`, PopUp.jokeImgUrl);
                }
            }
        }, clearInputvalue);
    }
}

function onclickSignOutBtn() {
    let $signOutBtn = $(`#sign-col .btn-group-vertical .custom-btn`)[2];
    $signOutBtn.onclick = () => {
        PopUp.showYesNo(`Are you sure want to sign out?`, PopUp.questionImgUrl, () => {
            User.signOut();
            PopUp.show(`You have been sign out!`);
        });
    }
}

function onclickOpenSignColBtn() {
    $(`#sign-col-btn`).click(() => {
        AssignedVar.haveUsedSignColButton = true;
        $(`#sign-col`).css({
            "display": "flex",
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
                        "display": "flex",
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

function onclickPlaySoloBtn() {
    let $playSoloBtn = $(`#mode-group-btn button`)[1];
    $playSoloBtn.onclick = () => {
        if (!AssignedVar.IsUserAndEnemyReady) {
            AssignedVar.currentGame = new Game(0, new User("cachiengion314", "dfsdf", "sdfsdf"), AssignedVar.OFFLINE);
            AssignedVar.currentGame.enemyAcc = new User("sdfsdf", "dfsdf", "sdfsdf");
            AssignedVar.currentGame.createNewChessBoard();
            AssignedVar.currentGame.setCurrentPlayer();
            AssignedVar.IsUserInLobby = false;
        } else {
            PopUp.show(`You cannot play more than "1" game`, PopUp.sadImgUrl);
        }
    };
}

function onclickQuitGameBtn() {
    let $quitGameBtn = $(`#function-col button`)[1];
    $quitGameBtn.onclick = () => {
        if (!AssignedVar.IsUserAndEnemyReady) {
            AssignedVar.IsUserInLobby = true;
        } else {
            PopUp.show(`You cannot quit when the game is still playing!`, PopUp.sadImgUrl);
        }
    };
}

function onclickResignedBtn() {
    let $resignedBtn = $(`#function-col #gameplay-group-btn button`)[1];
    $resignedBtn.onclick = () => {
        if (AssignedVar.IsUserAndEnemyReady) {
            PopUp.showYesNo(`Are you sure want to resign?`, PopUp.questionImgUrl, loseGameResult);
        } else {
            PopUp.show(`The game have to in playing stage in order to resign the enemy!`, PopUp.sadImgUrl);
        }
    };
}

function onclickOfferADrawBtn() {
    let $drawBtn = $(`#function-col #gameplay-group-btn button`)[0];
    $drawBtn.onclick = () => {
        switch (AssignedVar.currentGame.gameMode) {
            case AssignedVar.ONLINE:
                if (AssignedVar.IsUserAndEnemyReady) {
                    PopUp.show(`you have send a draw request to the enemy!`);
                } else {
                    PopUp.show(`The game have to in playing stage in order to send a draw request to the enemy!`, PopUp.sadImgUrl);
                }
                break;
            case AssignedVar.OFFLINE:
                PopUp.show(`Hey we are in the offline mode!`);
                break;
        }
    };
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


function onclickReadyBtn() {
    $(`#ready-btn`).click(function () {
        Game.hideReadyBtn();
        let yourAcc = User.getChessClubObj()[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][User.getUserSignInId()];
        AssignedVar.currentGame.letPlayerControlChessPiece();

        if (AssignedVar.IsUserAndEnemyReady) {
        }
       
    });
}
//////
/////
////
function onclickOnlineModeBtn() {
    let $createTableBtn = $(`#mode-group-btn button`)[0];
    $createTableBtn.onclick = () => {
        let id = User.getUserSignInId();
        switch (id) {
            case -1:
                PopUp.show(`You have to sign in to enable this feature!`);
                break;
            default:
                if (!AssignedVar.IsUserAndEnemyReady) {
                    let userAcc = User.getChessClubObj()[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][User.getUserSignInId()];
                    AssignedVar.currentGame = new Game(User.getUserSignInId(), userAcc, AssignedVar.ONLINE);

                    PopUp.showLoading(() => {
                        AssignedVar.currentGame.createNewChessBoard();
                        AssignedVar.currentGame.setCurrentPlayer();

                        let newTable = {
                            tableId: Firebase.curretnTableId,
                            owner: userAcc,
                            ownerLastMove: null,
                            ownerMove: null,

                            opponent: null,
                            opponentLastMove: null,
                            opponentMove: null,

                            currentTurn: `owner`,
                        }

                        Firebase.setTable(Firebase.curretnTableId, newTable, () => {
                            AssignedVar.IsUserInLobby = false;
                            PopUp.closeModal(`#notification-modal`);
                            Firebase.onSnapshotWithId(Firebase.curretnTableId, tableChangedCallback);
                        }, (errorCode) => {
                            PopUp.show(`Sorry! There an error: "${errorCode}" in this action`, PopUp.sadImgUrl);
                            AssignedVar.currentGame = null;
                        });
                    }, `Please waiting server to create table!`, AssignedVar.FAKE_LOADING_TIME);

                } else {
                    PopUp.show(`You cannot play more than "1" game`, PopUp.sadImgUrl);
                }
        }
    };
}
///////
////////
// utility functions and callbacks section
// for sign in feature
// onSnapshot change for the server side
function tableChangedCallback(tableData) {
    if (!tableData.opponentLastMove || !tableData.opponentMove) { return; }
    console.log("tableData", tableData);
    let opponentLastMove = tableData.opponentLastMove;
    let opponentMove = tableData.opponentMove;
    let arrLastMove = opponentLastMove.split("_");
    let arrMove = opponentMove.split("_");

    let lastMove = new Vector(Number(arrLastMove[1], Number[arrLastMove[2]]));
    let move = new Vector(Number(arrMove[1], Number[arrMove[2]]));

    setupOnClickCallbackAt(lastMove);
    setupOnClickCallbackAt(move);

    console.log(`last move, move`, lastMove, move);
}

function authenticateUserCompletedCallback(isPasswordRight, userId, userDataFromDb) {
    if (userDataFromDb == AssignedVar.NO_USER) {
        PopUp.show(`Sorry! Your info are not in our database!`, PopUp.questionImgUrl);
    } else {
        if (isPasswordRight) {
            PopUp.closeModal(`#sign-modal`, () => {
                PopUp.show(`Wellcome back "${userDataFromDb.name}"! Hope you have some funs!`, PopUp.cuteImgUrl);
                clearInputvalue();
                User.signIn(userId, userDataFromDb);
            });
        } else {
            PopUp.show(`Account "${userDataFromDb.name}" have different password! Please type the right one!`, PopUp.angryImgUrl);
        }
    }
}
// for sign up feature
function findNameAndEmailDuplicateCompletedCallback(isNameDuplicate, isEmailDuplicate, userInfo) {
    if (isNameDuplicate && !isEmailDuplicate) {
        PopUp.show(`your name is duplicate in our database! Please choose another one!`, PopUp.angryImgUrl);
    } else if (!isNameDuplicate && isEmailDuplicate) {
        PopUp.show(`your email is duplicate in our database! Please choose another one!`, PopUp.angryImgUrl);
    } else if (isNameDuplicate && isEmailDuplicate) {
        PopUp.show(`your name and email is duplicate in our database! Please choose another one!`, PopUp.angryImgUrl);
    } else {
        Firebase.setUser(userInfo, (userId) => {
            PopUp.closeModal(`#sign-modal`, () => {
                PopUp.show(`Congratulation! Your assignment is done!`);
                clearInputvalue();
                User.signIn(userId, userInfo);
            });
        },
            (errorCode) => { PopUp.show(`There is an error! "${errorCode}" in this!`, PopUp.sadImgUrl) }
        );
    }
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
            "display": "flex",
        });
        $(`#sign-col-content`).css({
            "width": "100%",
        });
    }
}

function loseGameResult() {
    PopUp.show(`player "${AssignedVar.currentGame.userAcc.name}" have lost the game`, PopUp.sadImgUrl);
    AssignedVar.currentGame.enemyAcc.tempWins++;
    let $winsTxt = $(`#enemy-block .align-end div`)[0];
    $winsTxt.textContent = `Wins: ${AssignedVar.currentGame.enemyAcc.tempWins}`;
    AssignedVar.currentGame.resetGameBoard();
    Game.showReadyBtn();
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

function clearInputvalue() {
    $(`#sign-modal input`).val("");
}