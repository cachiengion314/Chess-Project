import AssignedVar from "../utility/AssignedVar.js";
import Firebase from "../utility/Firebase.js";
import PopUp from "../utility/PopUp.js";
import Game from "../gameplay/Game.js";
import initLobby from "../initLobby.js";

export default class User {
    constructor(name, email, password) {
        this.id = null;
        this.name = name;
        this.email = email;
        this.password = AssignedVar.md5(password);
        this.elo = 1000;
        this.wins = 0;
        this.draws = 0;
        this.loses = 0;
        this.tempWins = 0;
        this.tempDraws = 0;
        this.tempLoses = 0;
        this.isReady = false;
        this.controllingColor = AssignedVar.EMPTY;
        this.themeIndex = 0;
        let d = new Date();
        this.accDateCreated = d.toLocaleDateString() + "_" + `${d.getHours()}:${d.getMinutes()}`;
    }
    static isOwnerTurn() {
        if (AssignedVar.currentGame.currentPlayer.color == AssignedVar.currentTable.owner.controllingColor) {
            return true;
        }
        return false;
    }
    static isMyPiece(piece) {
        if (User.isTableOwner()) {
            if (User.isOwnerPiece(piece)) {
                return true;
            }
            return false;
        }
        if (!User.isOwnerPiece(piece)) {
            return true;
        }
        return false;
    }

    static isOwnerPiece(piece) {
        if (piece.color == AssignedVar.WHITE) {
            if (AssignedVar.currentTable.owner.controllingColor == AssignedVar.WHITE) {
                return true;
            }
            return false;
        }
        if (AssignedVar.currentTable.owner.controllingColor == AssignedVar.BLACK) {
            return true;
        }
        return false;
    }

    static isTableOwner() {
        if (AssignedVar.currentTable) {
            let owner = AssignedVar.currentTable.owner;
            let userId = User.getUserSignInId();
            if (owner.id != userId) {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }

    static getUserSignIn() {
        return Firebase.convertCustomObjToGenericObj(User.getChessClubObj()[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][User.getUserSignInId()]);
    }

    static setUserSignIn(user) {
        let updateChessClubOb = User.getChessClubObj();
        updateChessClubOb[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][User.getUserSignInId()] = user;
        User.setChessClubObj(updateChessClubOb);
    }

    static signIn(id, userInfo) {
        let $signIn = $(`#sign-col .custom-btn`)[0];
        let $signUp = $(`#sign-col .custom-btn`)[1];
        let $signOut = $(`#sign-col .custom-btn`)[2];
        $($signIn).hide();
        $($signUp).hide();
        $($signOut).show();
        let obj = User.getChessClubObj();
        userInfo.id = id;
        obj[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][id] = userInfo;
        User.setChessClubObj(obj);
        User.showWelcomeTitle(`Xin chào bạn ${userInfo.name} đến với chess club online!`);
        AssignedVar.IsUserInLobby = true;
        User.showUserStatistic(userInfo);
        User.setUserSignInId(id);
    }

    static signOut() {
        let $signIn = $(`#sign-col .custom-btn`)[0];
        let $signUp = $(`#sign-col .custom-btn`)[1];
        let $signOut = $(`#sign-col .custom-btn`)[2];
        $($signIn).show();
        $($signUp).show();
        $($signOut).hide();
        User.showWelcomeTitle(`Chào mừng đến với chess club online! Vui lòng đăng nhập!`);
        AssignedVar.IsUserInLobby = true;
        User.hideUserStatistic();
        User.setUserSignInId(-1);
    }

    static opponent_quitAction(tableId = Firebase.currentTableId) {
        PopUp.showLoading(() => {
            Firebase.unSubcribeSnapshot();
            Firebase.unSubcribeChatsSnapshot();

            User.tables[tableId].table.opponent = null;
            let cPlayersNumber = --User.tables[tableId].table.playersNumber;
            console.log(`table.playersNumber:`, User.tables[tableId].table.playersNumber);
            if (AssignedVar.currentTable) {
                cPlayersNumber = --AssignedVar.currentTable.playersNumber;
            }
            Firebase.updateTableProperty(tableId,
                {
                    playersNumber: cPlayersNumber,
                    opponent: null, opponentLastMove: null, opponentMove: null, lastTurn: null,
                    ownerLastMove: null, ownerMove: null, "owner.isReady": false, "owner.tempLoses": 0,
                    "owner.tempWins": 0,
                }, () => {
                    Game.saveAndUpdateScore();
                    AssignedVar.IsUserInLobby = true;
                    PopUp.closeModal(`#notification-modal`);
                }, (errorCode) => {
                    console.log(`updateTableProperty: !${errorCode}!`);
                    PopUp.closeModal(`#notification-modal`);
                });
        }, `Vui lòng đợi hệ thống làm việc!`, AssignedVar.FAKE_LOADING_TIME);
    }

    static owner_quitAction(tableId = Firebase.currentTableId) {
        PopUp.showLoading(() => {
            Firebase.unSubcribeChatsSnapshot();
            Firebase.deleteChats(Firebase.currentChatsId, () => {
                console.log(`deleteChats success!`);
            }, (e) => {
                console.log(`deleteTable: "${e}"!`);
            });

            Firebase.unSubcribeSnapshot();
            Firebase.deleteTable(tableId, false, () => {
                PopUp.closeModal(`#notification-modal`);
                Game.saveAndUpdateScore();
                AssignedVar.IsUserInLobby = true;
            }, (e) => {
                console.log(`deleteTable: "${e}"!`);
                PopUp.closeModal(`#notification-modal`);
            });
        }, `Vui lòng đợi hệ thống xóa bàn đấu trên cơ sở dữ liệu`, AssignedVar.FAKE_LOADING_TIME);
    }

    static saveDataForTheFirstTime() {
        if (User.isFirstTime()) {
            User.setChessClubObj(AssignedVar.chessClubObj);
        }
    }
    static checkUserSignStatus() {
        let userInfo = User.getChessClubObj()[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][User.getUserSignInId()];
        if (User.getUserSignInId() == -1) {
            User.signOut();
        } else {
            User.signIn(User.getUserSignInId(), userInfo);
        }
    }
    static isFirstTime() {
        let rawObj = localStorage.getItem(AssignedVar.KEY_CHESS_CLUB_ONLINE);
        if (rawObj == undefined || rawObj == null) {
            return true;
        }
        return false;
    }

    static setChessClubObj(obj) {
        localStorage.setItem(AssignedVar.KEY_CHESS_CLUB_ONLINE, JSON.stringify(obj));
    }

    static getChessClubObj() {
        return JSON.parse(localStorage.getItem(AssignedVar.KEY_CHESS_CLUB_ONLINE));
    }

    static setUserSignInId(id) {
        let obj = User.getChessClubObj();
        obj[AssignedVar.KEY_CURRENT_USER_SIGNIN_ID] = id;
        User.setChessClubObj(obj);
    }

    static getUserSignInId() {
        let id = User.getChessClubObj()[AssignedVar.KEY_CURRENT_USER_SIGNIN_ID];
        if (id == null || id == undefined || id == -1) {
            return -1;
        }
        return id;
    }
    static tables = {}
    static checkRageQuit() {
        if (User.getUserSignInId() == -1) return;
        let accId = User.getUserSignInId();
        console.log(`user.tables`, User.tables);
        for (let prop in User.tables) {
            if (User.tables[prop].table.owner.id == accId) {
                console.log(`owner have just raged quit!`);
                User.owner_rageQuitAction(prop);
            } else if (User.tables[prop].table.opponent && User.tables[prop].table.opponent.id == accId && !User.tables[prop].table.is_ownerRageQuit) {
                console.log(`opponent have just raged quit!`);
                User.opponent_rageQuitAction(prop);
            } else {
                console.log(`just a normal reload!`);
            }
        }
    }

    static opponent_rageQuitAction(tableId) {
        PopUp.showLoading(() => {
            User.tables[tableId].table.opponent.id = null;
            let cPlayersNumber = --User.tables[tableId].table.playersNumber;
            if (AssignedVar.currentTable) {
                cPlayersNumber = --AssignedVar.currentTable.playersNumber;
            }
            let ownerWins = ++User.tables[tableId].table.owner.wins;
            Firebase.updateTableProperty(tableId,
                {
                    playersNumber: cPlayersNumber, is_opponentRageQuit: true,
                    opponent: null, opponentLastMove: null, opponentMove: null, lastTurn: null,
                    ownerLastMove: null, ownerMove: null, "owner.isReady": false, "owner.tempLoses": 0,
                    "owner.tempWins": 0, "owner.wins": ownerWins,
                }, () => {
                    let acc = User.getUserSignIn();
                    acc.elo += Game.calculateElo(false, acc.elo, User.tables[tableId].table.owner.elo);
                    acc.loses++;
                    User.setUserSignIn(acc);
                    Game.saveAndUpdateScore();
                    AssignedVar.IsUserInLobby = true;
                    PopUp.closeModal(`#notification-modal`);
                }, (errorCode) => {
                    console.log(`updateTableProperty: !${errorCode}!`);
                    PopUp.closeModal(`#notification-modal`);
                });
        }, `Bạn vừa tự ý out khỏi bàn chơi! Lần sau hãy nhấn thoát game!`, AssignedVar.FAKE_LOADING_TIME, PopUp.angryImgUrl);
    }

    static owner_rageQuitAction(tableId) {
        PopUp.showLoading(() => {
            Firebase.deleteChats(Firebase.currentChatsId, () => {
                console.log(`deleteChats success!`);
            }, (e) => {
                console.log(`deleteTable: "${e}"!`);
            });

            Firebase.deleteTable(tableId, true, () => {
                PopUp.closeModal(`#notification-modal`);
                let acc = User.getUserSignIn();
                acc.elo += Game.calculateElo(false, acc.elo, 1000);
                acc.loses++;
                User.setUserSignIn(acc);
                Game.saveAndUpdateScore();
                AssignedVar.IsUserInLobby = true;
            }, (e) => {
                console.log(`deleteTable: "${e}"!`);
                PopUp.closeModal(`#notification-modal`);
            });
        }, `Bạn vừa tự ý out khỏi bàn chơi! Lần sau hãy nhấn thoát game!`, AssignedVar.FAKE_LOADING_TIME, PopUp.angryImgUrl);
    }

    static showUserStatistic(userInfo) {
        $(`#user-statistic`).show();
        let $name = $(`#user-statistic .statistic-txt`)[0];
        let $elo = $(`#user-statistic .statistic-txt`)[1];
        let $wins = $(`#user-statistic .statistic-txt`)[2];
        let $loses = $(`#user-statistic .statistic-txt`)[3];
        let $draws = $(`#user-statistic .statistic-txt`)[4];
        $($name).html(`${userInfo.name}`);
        $($elo).html(`${userInfo.elo}`);
        $($wins).html(`${userInfo.wins}`);
        $($loses).html(`${userInfo.loses}`);
        $($draws).html(`${userInfo.draws}`);
    }

    static showWelcomeTitle(content) {
        $(`#sign-col h4`).text(content);
    }

    static hideUserStatistic() {
        $(`#user-statistic`).hide();
    }
    static correctedAccNames() {
        if (!AssignedVar.currentGame) return;
        let ownerName = AssignedVar.currentTable.owner.name;
        $(`#user-block .player`).text(`${ownerName}`);
        if (AssignedVar.currentTable.opponent) {
            let opponentName = AssignedVar.currentTable.opponent.name;
            $(`#enemy-block .player`).text(`${opponentName}`);
        }
    }
}