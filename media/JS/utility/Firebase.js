import AssignedVar from "./AssignedVar.js";
import User from "../gameplay/User.js";
import Game from "../gameplay/Game.js";

let _database;
let _databaseCollectionUser;
let _databaseCollectionTables;
let _unSubcribeSnapshot;

export default class Firebase {
    static get db() {
        return _database;
    }
    static get dbUsers() {
        return _databaseCollectionUser;
    }
    static get dbTalbes() {
        return _databaseCollectionTables;
    }
    static get UnSubcribeSnapshot() {
        return _unSubcribeSnapshot;
    }

    static initialize() {
        firebase.initializeApp({
            apiKey: 'AIzaSyA8X5BGIHdic4rowTSnVhx_OrdHSkonngQ',
            authDomain: 'chess-club-online.firebaseapp.com',
            projectId: 'chess-club-online',
        });
        _database = firebase.firestore();
        _databaseCollectionUser = Firebase.db.collection(`users`);
        _databaseCollectionTables = Firebase.db.collection(`tables`);
    }
    static setUser(userInfo = {}, successCompletedCallback = (id) => { }, failCompletedCallback = (error) => { }) {
        let customUser = new User(userInfo.name, userInfo.email, userInfo.password);
        let newUser = Firebase.convertCustomObjToGenericObj(customUser)
        let p = Firebase.dbUsers.add(newUser);
        p.then((resolve) => {
            successCompletedCallback(resolve.id);
        })
            .catch((error) => {
                failCompletedCallback(error);
            });
    }
    // for sign in feature
    static authenticateUser(givenUserName = `phong`, givenPassword = `12345`, completedCallback = (isRight, id, userData) => { }) {
        let isGivenPasswordRight = false;
        let p = Firebase.dbUsers.where(`name`, `==`, givenUserName).get();
        p.then((querySnapshot) => {
            if (!querySnapshot.empty) {
                let documents = querySnapshot.docs;
                let userPassword = documents[0].data().password;
                if (userPassword === givenPassword) {
                    isGivenPasswordRight = true;
                }
                completedCallback(isGivenPasswordRight, documents[0].id, documents[0].data());
            } else {
                completedCallback(isGivenPasswordRight, -1, AssignedVar.NO_USER);
            }
        });
    }
    // for sign up feature
    static findNameAndEmailDuplicate(givenName = "phong", givenEmail = "fun@mail.com", givenPassword = `12345`, completedCallback = (isNR, isER, uInfo) => { }) {
        let isNameDuplicate = false;
        let isEmailDuplicate = false;
        let userInfo = new User(givenName, givenEmail, givenPassword);
        let pName = Firebase.dbUsers.where(`name`, `==`, givenName).get();
        pName.then((querySnapshot) => {
            if (!querySnapshot.empty) {
                isNameDuplicate = true;
            }
            let pEmail = Firebase.dbUsers.where(`email`, `==`, givenEmail).get();
            pEmail.then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    isEmailDuplicate = true;
                }
                completedCallback(isNameDuplicate, isEmailDuplicate, userInfo);
            });
        });
    }
    static queryAllTable(completedCallback = (allTables) => { }) {
        let p = Firebase.dbTalbes.get();
        p.then((querySnapshot) => {
            let documents = querySnapshot.docs;
            completedCallback(documents);
        });
    }
    static onSnapshotWithId(id = `id`, changedCallback = (data) => { }) {
        unSubcribeSnapshot = Firebase.dbUsers.doc(id)
            .onSnapshot((doc) => {
                changedCallback(doc.data());
            });
    }
    static setTable(tableId, gameRawObj, resolveCallback = () => { }, failCallback = (error) => { }) {
        let gameInfo = Firebase.simptifyGameObj(gameRawObj);

        let p = Firebase.dbTalbes.doc(tableId).set(gameInfo);
        p.then(() => {
            resolveCallback();
        })
            .catch((errorCode) => {
                failCallback(errorCode);
            });
    }
    static simptifyGameObj(gameObj) {
        let gObj;
        gObj = Firebase.convertCustomObjToGenericObj(gameObj);
        gObj.chessBoard = Firebase.simptifyChessBoard(gObj.chessBoard);
        gObj.currentPlayer = Firebase.simptifyPlayerData(gObj.currentPlayer);

        return gObj;
    }

    static convertCustomObjToGenericObj(customObj) {
        let genericObj = {};
        for (let property in customObj) {
            genericObj[property] = customObj[property];
        }
        return genericObj;
    }
    static simptifyChessBoard(chessBoard) {
        let cb = {};
        for (let x = 0; x < 8; ++x) {
            let arrX = [];
            cb[x] = arrX;
            for (let y = 0; y < 8; ++y) {
                let rawObj = chessBoard[x][y];
                let convertedObj = Firebase.convertCustomObjToGenericObj(rawObj);
                cb[x].push(convertedObj);
                cb[x][y] = cb[x][y].id;
            }
        }
        return cb;
    }
    static simptifyPlayerData(player) {
        let p = Firebase.convertCustomObjToGenericObj(player);
        for (let i = 0; i < player.alivePieces.length; ++i) {
            p.alivePieces[i] = player.alivePieces[i].id;
        }
        for (let i = 0; i < player.deathPieces.length; ++i) {
            p.deathPieces[i] = player.deathPieces[i].id;
        }
        return p;
    }
    static simptifyDirections(directions) {
        let d = [];
        for (let vector of directions) {
            d.push(vector.convertToId());
        }
        return d;
    }
}