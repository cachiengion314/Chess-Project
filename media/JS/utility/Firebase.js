import AssignedVar from "./AssignedVar.js";
import User from "../gameplay/User.js";
import Game from "../gameplay/Game.js";
import Vector from "./Vector.js";
import King from "../pieces/King.js";
import Queen from "../pieces/Queen.js";
import Bishop from "../pieces/Bishop.js";
import Knight from "../pieces/Knight.js";
import Rook from "../pieces/Rook.js";
import Pawn from "../pieces/Pawn.js";
import Empty from "../pieces/Empty.js";

let _database;
let _databaseCollectionUser;
let _databaseCollectionTables;

let _unSubcribeSnapshot;
let _currentTableId = -1;

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
    static get unSubcribeSnapshot() {
        if (_unSubcribeSnapshot) {
            return _unSubcribeSnapshot;
        }
        return console.log(`You don't subcribe any snapshots!`);
    }
    static set currentTableId(value) {
        _currentTableId = value;
    }
    static get currentTableId() {
        if (_currentTableId == -1) {
            return `table-` + User.getUserSignInId();
        }
        return _currentTableId;
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
    static onSnapshotWithId(id = `id`, changedCallback = (tableData) => { }) {
        _unSubcribeSnapshot = Firebase.dbTalbes.doc(id)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    AssignedVar.currentTable = doc.data();
                    changedCallback(AssignedVar.currentTable);
                }
            });
    }

    static updateTableProperty(tableId, propertyObj, resolveCallback = () => { }, failCallback = (errorCode) => { }) {
        let ref = Firebase.dbTalbes.doc(tableId);
        ref.update(propertyObj)
            .then(() => {
                resolveCallback();
            })
            .catch((errorCode) => {
                failCallback(error);
                console.log(`there an error:`, errorCode);
            });
    }

    static updateMove(tableId, pieceLastMove, pieceMove, resolveCallback = () => { }) {
        let obj = {};
        let move = "ownerMove";
        let lastMove = "ownerLastMove";
        let lastTurn = AssignedVar.OWNER;
        let mytableId = `table-` + User.getUserSignInId();
        if (tableId != mytableId) {
            move = "opponentMove";
            lastMove = "opponentLastMove";
            lastTurn = AssignedVar.OPPONENT;
        }

        obj[move] = pieceMove;
        obj[lastMove] = pieceLastMove;
        obj["lastTurn"] = lastTurn;

        let ref = Firebase.dbTalbes.doc(tableId);
        ref.update(obj)
            .then(() => {
                resolveCallback();
            })
            .catch((errorCode) => {

            });
    }
    static getTable(tableId, resolveCallback = (docData) => { }, failCallback = (errorCode) => { }) {
        let p = Firebase.dbTalbes.doc(tableId).get();
        p.then((doc) => {
            if (doc.exists) {
                AssignedVar.currentTable = doc.data();
                resolveCallback(AssignedVar.currentTable);
            }
        })
            .catch((errorCode) => {
                failCallback(errorCode);
            });
    }
    static setTable(tableId, tableObj, resolveCallback = () => { }, failCallback = (error) => { }) {
        let p = Firebase.dbTalbes.doc(tableId).set(tableObj);
        p.then(() => {
            resolveCallback();
        })
            .catch((errorCode) => {
                failCallback(errorCode);
            });
    }
    static deleteTable(tableId, resolveCallback = () => { }, failCallback = (errorCode) => { }) {
        Firebase.updateTableProperty(Firebase.currentTableId, { tableId: -1 }, () => {
            // delete code here
            let p = Firebase.dbTalbes.doc(tableId).delete();
            p.then(() => {
                Firebase.unSubcribeSnapshot();
                resolveCallback();
            })
                .catch((errorCode) => {
                    failCallback(errorCode);
                });
        }, (errorCode) => {
            console.log(`can't update: ${errorCode}!`);
        })
    }

    static isEmptyObj(obj) {
        for (let property in obj) {
            return false;
        }
        return true;
    }

    static convertCustomObjToGenericObj(customObj) {
        let genericObj = {};
        for (let property in customObj) {
            genericObj[property] = customObj[property];
        }
        return genericObj;
    }
}