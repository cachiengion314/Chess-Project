import AssignedVar from "./utility/AssignedVar.js";
import Firebase from "./utility/Firebase.js";
import User from "./gameplay/User.js";
import Visualize from "./utility/Visualize.js";
import PopUp from "./utility/PopUp.js";
import Game from "./gameplay/Game.js";
import Vector from "./utility/Vector.js";
import ChatBox from "./utility/ChatBox.js";
import {
    mimicOnclickMovePieceAt
} from "./initGameBoard.js";
import AI from "./gameplay/AI.js";

export default function listenAllEvents() {
    // sign section
    onclickSignInBtn();
    onclickSignUpBtn();
    onclickSignOutBtn();
    // game mode section
    onclickCreateATableBtn();
    onclickPlayWithFriendBtn();
    onclickPlayWithComputerBtn();
    // Gameplay section
    onclickQuitGameBtn();
    onclickOpenSignColBtn();
    onclickReadyBtn();
    onclickResignedBtn();
    onclickOfferADrawBtn();
    onclickControllingColorBtn();
    // option section
    onclickOptionBtn();
    onclickChangeThemeBtn();
    onclickAboutUsBtn();
    onclickAI_Btn();
    // resize event section
    responsiveSignColEventInvoke();
    listenResizeEvent();
}

function onclickControllingColorBtn() {
    let $controllingColorBtn = $(`#controllingcolor-btn`)[0];
    $controllingColorBtn.onclick = () => {
        if (AssignedVar.currentGame.gameMode == AssignedVar.OFFLINE) {
            if (AssignedVar.IsUserAndEnemyReady) {
                PopUp.show(`Bạn không thể chỉnh lại màu quân mình điều khiển khi đang chơi game!`, PopUp.sadImgUrl);
                return;
            }
            if (AssignedVar.currentTable.opponent.controllingColor == AssignedVar.BLACK) {
                AssignedVar.currentTable.opponent.controllingColor = AssignedVar.WHITE;
                AssignedVar.currentTable.owner.controllingColor = AssignedVar.BLACK;
                $controllingColorBtn.textContent = `Cầm quân: đen`;
                User.correctedAccNames(`#enemy-block`, `#user-block`);
            } else {
                AssignedVar.currentTable.opponent.controllingColor = AssignedVar.BLACK;
                AssignedVar.currentTable.owner.controllingColor = AssignedVar.WHITE;
                $controllingColorBtn.textContent = `Cầm quân: trắng`;
                User.correctedAccNames(`#user-block`, `#enemy-block`);
            }
        } else {
            console.log(`AI function only! there an error!`);
        }
    }
}

function onclickAI_Btn() {
    let $aiBtn = $(`#ai-btn`)[0];
    AI.displayCurrentAI_difficult($aiBtn);
    $aiBtn.onclick = () => {
        AI.increaseAI_Difficult();
        AI.displayCurrentAI_difficult($aiBtn);
    }
}

function onclickPlayWithComputerBtn() {
    let $playWithComputerBtn = $(`#mode-group-btn button`)[2];
    $playWithComputerBtn.onclick = () => {
        AssignedVar.IsUserInLobby = false;
        AI.isOn = true;
        let userAcc = User.getUserSignIn();
        if (User.getUserSignInId() == -1) {
            userAcc = new User(`guest`, `guest@gamil.com`, `123`);
        }
        userAcc.controllingColor = AssignedVar.WHITE;
        let newTable = AssignedVar.getDefaultTable(Firebase.currentTableId, userAcc);
        AssignedVar.currentTable = newTable;
        AssignedVar.currentGame = new Game(AssignedVar.OFFLINE);
        Game.showOpponentBlock();
        AssignedVar.currentTable.opponent = Firebase.convertCustomObjToGenericObj(new User("super_Computer69", "superComputer@gmail.com", "123"));
        AssignedVar.currentTable.opponent.controllingColor = AssignedVar.BLACK;
        AssignedVar.currentGame.createNewChessBoard();
        AssignedVar.currentGame.setCurrentPlayer();
        Game.showTempStatistic(true);
    };
}

function onclickAboutUsBtn() {
    let $aboutUsBtn = $(`#about-us-btn`)[0];
    $aboutUsBtn.onclick = () => {
        if (AssignedVar.IsUserAndEnemyReady) {
            PopUp.show(`Bạn không thể xem được nội dung này khi đang chơi game!`, PopUp.sadImgUrl);
        } else {
            window.location.href = "about-us.html";
        }
    }
}

function onclickOptionBtn() {
    let $optionBtn = $(`#option-btn`)[0];
    $optionBtn.onclick = () => {
        PopUp.showOption(`Tùy chọn hệ thống`);
    }
}

function onclickSignInBtn() {
    let $signInBtn = $(`#sign-col .btn-group-vertical .custom-btn`)[0];
    $signInBtn.onclick = () => {
        if (AssignedVar.IsUserAndEnemyReady) {
            PopUp.show(`Bạn không thể đăng nhập khi đang chơi game!`);
            return;
        }
        PopUp.showSignIn(() => {
            let $yourNameInput = $(`#sign-modal input`)[0];
            let $password1Input = $(`#sign-modal input`)[2];
            let $yourName = $(`#sign-modal .txt`)[0];
            let $password1 = $(`#sign-modal .txt`)[2];
            if (hasRedTxtShouldAppear($yourNameInput.value, $yourName) |
                hasRedTxtShouldAppear($password1Input.value, $password1)) {
                PopUp.show(`Bạn nên điền đúng thông tin!`, PopUp.angryImgUrl);
            } else {
                PopUp.showLoading(() => {
                    Firebase.authenticateUser($yourNameInput.value, $password1Input.value, authenticateUserCompletedCallback);
                }, "Làm ơn đợi chút cho hệ thống xác minh lại dữ liệu!", AssignedVar.FAKE_LOADING_TIME);
            }
        }, clearInputvalue);
    }
}

function onclickSignUpBtn() {
    let $signUpBtn = $(`#sign-col .btn-group-vertical .custom-btn`)[1];
    $signUpBtn.onclick = () => {
        if (AssignedVar.IsUserAndEnemyReady) {
            PopUp.show(`Bạn không thể đăng ký khi đang chơi game!`);
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
                PopUp.show(`Dường như có thông tin chưa được điền hoặc bị điền sai!`, PopUp.angryImgUrl);
            } else {
                if ($password1Input.value == $password2Input.value) {
                    PopUp.showLoading(() => {
                        Firebase.findNameAndEmailDuplicate($yourNameInput.value, $yourEmailInput.value, $password1Input.value, findNameAndEmailDuplicateCompletedCallback)
                    }, "Vui lòng đợi hệ thống xác minh!", AssignedVar.FAKE_LOADING_TIME);
                } else {
                    hasRedTxtShouldAppear($password2Input.value, $password2, $password1Input.value);
                    PopUp.show(`Cái "xác nhận lại password" của bạn không khớp với password chính!`, PopUp.jokeImgUrl);
                }
            }
        }, clearInputvalue);
    }
}

function onclickSignOutBtn() {
    let $signOutBtn = $(`#sign-col .btn-group-vertical .custom-btn`)[2];
    $signOutBtn.onclick = () => {
        if (AssignedVar.IsUserAndEnemyReady) {
            PopUp.show(`Bạn không thể đăng xuất khi đang chơi game!`);
            return;
        }
        PopUp.showYesNo(`Bạn có chắc muốn đăng xuất?`, PopUp.questionImgUrl, () => {
            User.signOut();
            PopUp.show(`Bạn đã đăng xuất thành công!`);
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

        let width = "30%";
        if (window.innerWidth < window.innerHeight) {
            width = "57%";
        }
        $(`#sign-col-content`).animate({
            "width": width,
        }, "fast");
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
                    let width = "18%";

                    $(`#sign-col`).css({
                        "display": "flex",
                        "width": width,
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

function onclickResignedBtn() {
    let $resignedBtn = $(`#function-col #gameplay-group-btn button`)[1];
    $resignedBtn.onclick = () => {
        if (AssignedVar.IsUserAndEnemyReady) {
            PopUp.showYesNo(`Bạn có chắc muốn đầu hàng ngay bây giờ?`, PopUp.questionImgUrl, Game.loseGameResult);
        } else {
            PopUp.show(`Bạn phải chơi game thì mới đầu hàng được!`, PopUp.sadImgUrl);
        }
    };
}

function onclickOfferADrawBtn() {
    let $drawBtn = $(`#function-col #gameplay-group-btn button`)[0];
    $drawBtn.onclick = () => {
        switch (AssignedVar.currentGame.gameMode) {
            case AssignedVar.ONLINE:
                if (AssignedVar.IsUserAndEnemyReady) {
                    PopUp.show(`Chức năng chưa hoạt động! Hãy dùng nút đầu hàng!`);
                } else {
                    PopUp.show(`Chức năng chưa hoạt động! Hãy dùng nút đầu hàng!`, PopUp.sadImgUrl);
                }
                break;
            case AssignedVar.OFFLINE:
                PopUp.show(`Chức năng chưa hoạt động! Hãy dùng nút đầu hàng!`);
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
        if (AssignedVar.currentGame.gameMode == AssignedVar.ONLINE) {
            let prop = AssignedVar.OWNER;
            let propertyObj = {};
            if (User.isTableOwner()) {
                AssignedVar.currentTable.owner.isReady = true;
                Game.setReadyBgOn(`#user-block`);
                propertyObj[prop] = AssignedVar.currentTable.owner;
            } else {
                AssignedVar.currentTable.opponent.isReady = true;
                Game.setReadyBgOn(`#enemy-block`);
                prop = AssignedVar.OPPONENT;
                propertyObj[prop] = AssignedVar.currentTable.opponent;
            }
            Firebase.updateTableProperty(Firebase.currentTableId, propertyObj, () => {
                console.log(`readyBtn is clicked by ${prop}! updated in db!`);
            }, (errorCode) => {
                console.log(`error: "${errorCode}"!`);
            });
        } else {
            AssignedVar.currentTable.owner.isReady = true;
            Game.setReadyBgOn(`#user-block`);
            AssignedVar.currentTable.opponent.isReady = true;
            Game.setReadyBgOn(`#enemy-block`);
        }
        if (AssignedVar.IsUserAndEnemyReady) {
            AssignedVar.currentGame.letPlayerControlChessPiece_snapshot();
        }
    });
}

function onclickPlayWithFriendBtn() {
    let $playWithFriendBtn = $(`#mode-group-btn button`)[1];
    $playWithFriendBtn.onclick = () => {
        AssignedVar.IsUserInLobby = false;
        let userAcc = User.getUserSignIn();
        if (User.getUserSignInId() == -1) {
            userAcc = new User(`guest`, `guest@gamil.com`, `123`);
        }
        userAcc.controllingColor = AssignedVar.WHITE;
        let newTable = AssignedVar.getDefaultTable(Firebase.currentTableId, userAcc);
        AssignedVar.currentTable = newTable;
        AssignedVar.currentGame = new Game(AssignedVar.OFFLINE);
        Game.showOpponentBlock();
        AssignedVar.currentTable.opponent = Firebase.convertCustomObjToGenericObj(new User("guest2", "guest2@gmail.com", "123"));
        AssignedVar.currentGame.createNewChessBoard();
        AssignedVar.currentGame.setCurrentPlayer();
        Game.showTempStatistic(true);
    };
}

function onclickQuitGameBtn() {
    let $quitGameBtn = $(`#function-col button`)[1];
    $quitGameBtn.onclick = () => {
        if (!AssignedVar.IsUserAndEnemyReady) {
            if (AssignedVar.currentGame.gameMode == AssignedVar.ONLINE) {
                if (User.isTableOwner()) {
                    User.owner_quitAction();
                } else {
                    User.opponent_quitAction();
                }
            } else {
                AssignedVar.IsUserInLobby = true;
            }
        } else {
            PopUp.show(`Bạn không thể thoát game khi đang chơi! Hãy đầu hàng hoặc đánh bại đối thủ để thoát!`, PopUp.sadImgUrl);
        }
    };
}
//////
//////
//////
function onclickCreateATableBtn() {
    let $createTableBtn = $(`#mode-group-btn button`)[0];
    $createTableBtn.onclick = () => {
        if (User.getUserSignInId() == -1) {
            PopUp.show(`Bạn phải đăng nhập để có thể sử dụng được chức năng này!`);
            return;
        }
        let acc = User.getUserSignIn();
        if (!acc) {
            console.log(`user may accidently delete their own localStorage data!`);
            PopUp.show(`Bạn không thể tạo bàn vì lý do kĩ thuật!`);
            return;
        }
        acc.controllingColor = AssignedVar.WHITE;
        let newTable = AssignedVar.getDefaultTable(Firebase.currentTableId, acc);
        AssignedVar.currentTable = newTable;
        AssignedVar.currentGame = new Game(AssignedVar.ONLINE);
        Game.isTheFirstTimeCreateTable = true;

        let newChats = AssignedVar.getDefaultChats(Firebase.currentChatsId);

        PopUp.showLoading(() => {
            Firebase.setChats(Firebase.currentChatsId, newChats, () => {
                Firebase.onSnapshotWithChatsId(Firebase.currentChatsId, chatsChangedCallback);
            }, (e) => {
                console.log(`setChats error: ${e}`);
            });

            Firebase.setTable(Firebase.currentTableId, newTable, () => {
                AssignedVar.IsUserInLobby = false;
                AssignedVar.currentGame.createNewChessBoard();
                AssignedVar.currentGame.setCurrentPlayer();
                Game.hideOpponentBlock();
                Game.showTempStatistic(true);

                PopUp.closeModal(`#notification-modal`, () => {
                    Firebase.onSnapshotWithId(Firebase.currentTableId, tableChangedCallback);
                    PopUp.showLoading(() => {
                        PopUp.show(`Khi thấy đối thủ vào phòng! Hãy nhấn "Sẵn sàng"! Khi cả hai sẵn sàng, trận đấu sẽ được bắt đầu!`, PopUp.cuteImgUrl);
                    }, `Đợi chút! Hệ thống đang tải hướng dẫn chơi!`, AssignedVar.FAKE_LOADING_TIME);
                });

            }, (errorCode) => {
                console.log(`error: "${errorCode}"!`);
                AssignedVar.currentGame = null;
            });
        }, `Vui lòng chờ đợi hệ thống tạo bàn!`, AssignedVar.FAKE_LOADING_TIME);
    };
}
///////
///////
///////
function chatsChangedCallback(chatsData) {
    AssignedVar.currentChatsId = chatsData;
    mimicOpponentChat();
}
function tableChangedCallback(tableData) {
    AssignedVar.currentTable = tableData;
    Game.quickSaveUserStatistic();
    mimicAllOpponentActionForThisAcc();
}

function mimicAllOpponentActionForThisAcc() {
    if (AssignedVar.currentTable.tableId == -1) return;
    opponentJoinTableEvent();
    noOpponentInTable();

    if (!AssignedVar.currentTable.opponent) return;
    resetBoardWhenOpponentResigned();
    mimicChessPiece();
    mimicOpponentMove();
}

function opponentJoinTableEvent() {
    if (AssignedVar.currentTable.opponent) {
        Game.opponentJoinTable_snapshot();
    } else {
        Game.recharge_opponentJoinTable_snapshot();
    }
}

function noOpponentInTable() {
    if (!AssignedVar.currentTable.opponent) {
        Game.opponentLeftTable_snapshot();
    } else {
        Game.recharge_opponentLeftTable_snapshot();
    }
}

function resetBoardWhenOpponentResigned() {
    if (AssignedVar.countMaxCurrentLoses < AssignedVar.currentTable.opponent.tempLoses) {
        AssignedVar.countMaxCurrentLoses = AssignedVar.currentTable.opponent.tempLoses;
        PopUp.show(`Xin chúc mừng! Bạn đã thắng!`, PopUp.jokeImgUrl);
        AssignedVar.currentGame.resetGameBoard();
        Game.showTempStatistic();
    }
}

function mimicOpponentChat() {
    if (Game.tempChat != AssignedVar.currentChats.opponentChat) {
        Game.tempChat = AssignedVar.currentChats.opponentChat;
        Game.showNewOpponentChat();
    }
}

function mimicChessPiece() {
    if (AssignedVar.currentTable.opponent && AssignedVar.currentTable.opponent.isReady) {
        Game.setReadyBgOn(`#enemy-block`);
        if (AssignedVar.IsUserAndEnemyReady) {
            AssignedVar.currentGame.letPlayerControlChessPiece_snapshot();
        }
    }
}

function mimicOpponentMove() {
    if (AssignedVar.currentTable.lastTurn != AssignedVar.OPPONENT
        || !AssignedVar.currentTable.opponentLastMove || !AssignedVar.currentTable.opponentMove) { return; }

    let opponentLastMove = AssignedVar.currentTable.opponentLastMove;
    let opponentMove = AssignedVar.currentTable.opponentMove;
    let arrLastMove = opponentLastMove.split("_");
    let arrMove = opponentMove.split("_");

    let lastMove = new Vector(Number(arrLastMove[1]), Number(arrLastMove[2]));
    let move = new Vector(Number(arrMove[1]), Number(arrMove[2]));

    mimicOnclickMovePieceAt(lastMove);
    mimicOnclickMovePieceAt(move);
}
/////////
/////////
/////////
function authenticateUserCompletedCallback(isPasswordRight, userId, userDataFromDb) {
    if (userDataFromDb == AssignedVar.NO_USER) {
        PopUp.show(`Xin lỗi! Tên đăng nhập của bạn không nằm trong cơ sở dữ liệu của chúng tôi`, PopUp.questionImgUrl);
    } else {
        if (isPasswordRight) {
            PopUp.closeModal(`#sign-modal`, () => {
                PopUp.show(`Xin chào bạn "${userDataFromDb.name}"! Hy vọng bạn sẽ thấy thích thú với game của chúng tôi!`, PopUp.cuteImgUrl);
                clearInputvalue();
                User.signIn(userId, userDataFromDb);
            });
        } else {
            PopUp.show(`Tài khoản "${userDataFromDb.name}" có password khác với cái bạn vừa nhập!`, PopUp.angryImgUrl);
        }
    }
}

function findNameAndEmailDuplicateCompletedCallback(isNameDuplicate, isEmailDuplicate, userInfo) {
    if (isNameDuplicate && !isEmailDuplicate) {
        PopUp.show(`Tên của bạn trùng với tên của người khác trong cơ sở dữ liệu! Xin vui lòng nhập tên khác!`, PopUp.angryImgUrl);
    } else if (!isNameDuplicate && isEmailDuplicate) {
        PopUp.show(`Email của bạn trùng với tên của người khác trong cơ sở dữ liệu! Xin vui lòng nhập Email khác!`, PopUp.angryImgUrl);
    } else if (isNameDuplicate && isEmailDuplicate) {
        PopUp.show(`Cả tên lẫn email của bạn trùng với của người khác trong cơ sở dữ liệu! Xin vui lòng nhập dữ liệu khác!`, PopUp.angryImgUrl);
    } else {
        Firebase.setUser(userInfo, (userId) => {
            PopUp.closeModal(`#sign-modal`, () => {
                PopUp.show(`Xin chúc mừng! Bạn đã đăng ký thành công!`);
                clearInputvalue();
                User.signIn(userId, userInfo);
            });
        },
            (errorCode) => { PopUp.show(`Error! "${errorCode}"!`, PopUp.sadImgUrl) }
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