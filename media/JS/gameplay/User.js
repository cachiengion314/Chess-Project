import AssignedVar from "../utility/AssignedVar.js";
import Firebase from "../utility/Firebase.js";

export default class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
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
        this.accDateCreated = d.toLocaleDateString() + "_" + `${d.getHours()}-${d.getMinutes()}`;
    }
    static isTableOwner() {
        let owner = AssignedVar.currentTable.owner;
        let userName = User.getUserSignIn().name;
        if (owner.name != userName) {
            return false
        }
        return true;
    }
    static getUserSignIn() {
        return Firebase.convertCustomObjToGenericObj(User.getChessClubObj()[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][User.getUserSignInId()]);
    }
    static setUserSignIn(user) {
        let updateChessClubOb = User.getChessClubObj();
        updateChessClubOb[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][User.getUserSignInId] = user;
        User.setChessClubObj(updateChessClubOb);
    }
    static signIn(id, userInfo) {
        let $signIn = $(`#sign-col .custom-btn`)[0];
        let $signUp = $(`#sign-col .custom-btn`)[1];
        let $signOut = $(`#sign-col .custom-btn`)[2];
        $($signIn).hide();
        $($signUp).hide();
        $($signOut).show();
        let userName = userInfo.name;
        let obj = User.getChessClubObj();
        obj[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][id] = userInfo;
        User.setChessClubObj(obj);
        User.showWelcomeTitle(`Welcome ${userName} to chess club online!`);
        AssignedVar.IsUserInLobby = true;
        User.showUserStatistic();
        User.setUserSignInId(id);
    }
    static signOut() {
        let $signIn = $(`#sign-col .custom-btn`)[0];
        let $signUp = $(`#sign-col .custom-btn`)[1];
        let $signOut = $(`#sign-col .custom-btn`)[2];
        $($signIn).show();
        $($signUp).show();
        $($signOut).hide();
        User.showWelcomeTitle(`Welcome to chess club online! Please sign in`);
        AssignedVar.IsUserInLobby = true;
        User.hideUserStatistic();
        User.setUserSignInId(-1);
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
    static showUserStatistic() {
        $(`#user-statistic`).show();
    }
    static showWelcomeTitle(content) {
        $(`#sign-col h4`).text(content);
    }
    static hideUserStatistic() {
        $(`#user-statistic`).hide();
    }
}