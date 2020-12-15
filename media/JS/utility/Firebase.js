import AssignedVar from "./AssignedVar.js";
import User from "../gameplay/User.js";
import PopUp from "./PopUp.js";

let _database;
let _databaseCollectionUser;
let _databaseCollectionTables;
let _databaseCollectionChats;

let _unSubcribeTableSnapshot;
let _unSubcribeChatsSnapshot;
let _currentTableId = -1;
let _currentChatsId = -1;

let _checkInternet = true;

export default class Firebase {
    static get db() {
        return _database;
    }
    static get dbUsers() {
        return _databaseCollectionUser;
    }
    static get dbChats() {
        return _databaseCollectionChats;
    }
    static get dbTalbes() {
        return _databaseCollectionTables;
    }
    static get unSubcribeSnapshot() {
        if (_unSubcribeTableSnapshot) {
            return _unSubcribeTableSnapshot;
        }
        console.log(`you don't subcribe any table snapshot!`);
        return null;
    }
    static unSubcribeChatsSnapshot() {
        if (_unSubcribeChatsSnapshot) {
            return _unSubcribeChatsSnapshot;
        }
        console.log(`you don't subcribe any chats snapshots!`);
        return null;
    }
    static get currentChatsId() {
        if (_currentChatsId == -1) {
            return "chats-" + User.getUserSignInId();
        }
        return _currentChatsId;
    }
    static set currentChatsId(val) {
        _currentChatsId = val;
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
        Firebase.checkInternet(() => {
            
            firebase.initializeApp({
                apiKey: 'AIzaSyA8X5BGIHdic4rowTSnVhx_OrdHSkonngQ',
                authDomain: 'chess-club-online.firebaseapp.com',
                projectId: 'chess-club-online',
            });
            _database = firebase.firestore();
            _databaseCollectionUser = Firebase.db.collection(`users`);
            _databaseCollectionTables = Firebase.db.collection(`tables`);
            _databaseCollectionChats = Firebase.db.collection(`chats`);
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });
    }
    static setUser(userInfo = {}, successCompletedCallback = (id) => { }, failCompletedCallback = (error) => { }) {
        Firebase.checkInternet(() => {
            
            let customUser = new User(userInfo.name, userInfo.email, userInfo.password);
            let newUser = Firebase.convertCustomObjToGenericObj(customUser)
            let p = Firebase.dbUsers.add(newUser);
            p.then((resolve) => {
                successCompletedCallback(resolve.id);
            })
                .catch((error) => {
                    failCompletedCallback(error);
                });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });
    }

    static authenticateUser(givenUserName = `phong`, givenPassword = `12345`, completedCallback = (isRight, id, userData) => { }) {
        Firebase.checkInternet(() => {
            
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
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });
    }

    static findNameAndEmailDuplicate(givenName = "phong", givenEmail = "fun@mail.com", givenPassword = `12345`, completedCallback = (isNR, isER, uInfo) => { }) {
        Firebase.checkInternet(() => {
            
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
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });
    }

    static queryAllTable(completedCallback = (allTables) => { }) {
        Firebase.checkInternet(() => {
            
            let p = Firebase.dbTalbes.get();
            p.then((querySnapshot) => {
                let documents = querySnapshot.docs;
                completedCallback(documents);
            });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });
    }
    static onSnapshotWithChatsId(chatId = `id`, changedCallback = (tableData) => { }) {
        Firebase.checkInternet(() => {
            
            _unSubcribeChatsSnapshot = Firebase.dbChats.doc(chatId)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        AssignedVar.currentChats = doc.data();
                        changedCallback(AssignedVar.currentChats);
                    }
                });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }
    static onSnapshotWithId(id = `id`, changedCallback = (tableData) => { }) {
        Firebase.checkInternet(() => {
            
            _unSubcribeTableSnapshot = Firebase.dbTalbes.doc(id)
                .onSnapshot((doc) => {
                    if (doc.exists) {
                        AssignedVar.currentTable = doc.data();
                        changedCallback(AssignedVar.currentTable);
                    }
                });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }
    static updateChatsProperty(chatId, propertyObj, resolveCallback = () => { }, failCallback = (e) => { }) {
        Firebase.checkInternet(() => {
            
            let ref = Firebase.dbChats.doc(chatId);
            ref.update(propertyObj)
                .then(() => {
                    resolveCallback();
                })
                .catch((e) => {
                    failCallback(e);
                })
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }

    static updateTableProperty(tableId, propertyObj, resolveCallback = () => { }, failCallback = (errorCode) => { }) {
        Firebase.checkInternet(() => {

            let ref = Firebase.dbTalbes.doc(tableId);
            ref.update(propertyObj)
                .then(() => {
                    resolveCallback();
                })
                .catch((errorCode) => {
                    failCallback(errorCode);
                });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }

    static updateMove(tableId, pieceLastMove, pieceMove, resolveCallback = () => { }) {
        Firebase.checkInternet(() => {
            
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
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }

    static updateCurrentUserData(userId, propObj, resolveCallback = () => { }, failCallback = (errorCode) => { }) {
        Firebase.checkInternet(() => {

            let ref = Firebase.dbTalbes.doc(userId);
            ref.update(propObj)
                .then(() => {
                    resolveCallback();
                })
                .catch((errorCode) => {
                    failCallback(errorCode);
                });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }

    static setCurrentUserData(userId, userObj, resolveCallback = (docData) => { }, failCallback = (errorCode) => { }) {
        Firebase.checkInternet(() => {
        
            let p = Firebase.dbUsers.doc(userId).set(userObj);
            p.then(() => {
                resolveCallback();
            })
                .catch((errorCode) => {
                    failCallback(errorCode);
                });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }
    static getChats(chatsId, resolveCallback = (docData) => { }, failCallback = (errorCode) => { }) {
        Firebase.checkInternet(() => {

            let p = Firebase.dbChats.doc(chatsId).get();
            p.then((doc) => {
                if (doc.exists) {
                    AssignedVar.currentChats = doc.data();
                    resolveCallback(AssignedVar.currentChats);
                }
            })
                .catch((errorCode) => {
                    failCallback(errorCode);
                });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }
    static getTable(tableId, resolveCallback = (docData) => { }, failCallback = (errorCode) => { }) {
        Firebase.checkInternet(() => {

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
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }
    static setChats(chatId, chatObj, resolveCallback = () => { }, failCallback = (error) => { }) {
        Firebase.checkInternet(() => {

            let p = Firebase.dbChats.doc(chatId).set(chatObj);
            p.then(() => {
                resolveCallback();
            })
                .catch((errorCode) => {
                    failCallback(errorCode);
                });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }
    static setTable(tableId, tableObj, resolveCallback = () => { }, failCallback = (error) => { }) {
        Firebase.checkInternet(() => {

            let p = Firebase.dbTalbes.doc(tableId).set(tableObj);
            p.then(() => {
                resolveCallback();
            })
                .catch((errorCode) => {
                    failCallback(errorCode);
                });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }
    static deleteChats(chatsId, resolveCallback = () => { }, failCallback = (errorCode) => { }) {
        Firebase.checkInternet(() => {

            Firebase.dbChats.doc(chatsId).delete()
                .then(() => {
                    resolveCallback();
                })
                .catch((errorCode) => {
                    failCallback(errorCode);
                });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


    }
    static deleteTable(tableId, isOwnerRageQuit = false, resolveCallback = () => { }, failCallback = (errorCode) => { }) {
        Firebase.checkInternet(() => {

            Firebase.updateTableProperty(tableId, { "tableId": -1, is_ownerRageQuit: isOwnerRageQuit }, () => {
                // actually delete code below here
                Firebase.dbTalbes.doc(tableId).delete()
                    .then(() => {
                        resolveCallback();
                    })
                    .catch((errorCode) => {
                        failCallback(errorCode);
                    });
            }, (errorCode) => {
                console.log(`can't update table -1: ${errorCode}!`);
            });
        }, (e) => {
            PopUp.show(`Không có kết nối mạng! Vui lòng thử lại sau!`);
            console.log(e);
        });


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
    static checkInternet(resolveCallback = () => { }, failCallback = (e) => { }) {
        fetch(`https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple`).then(() => {
            _checkInternet = true;
            resolveCallback();
            return _checkInternet
        }, (e) => {
            _checkInternet = false;
            failCallback(e);
            return _checkInternet;
        })

        return _checkInternet;
    }
}