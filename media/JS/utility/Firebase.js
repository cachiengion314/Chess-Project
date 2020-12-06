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
let _dbCurrentGameData;

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
    static get dbCurretnGameData() {
        return _dbCurrentGameData;
    }
    static get curretnTableId() {
        return `table-` + User.getUserSignInId();
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
    static onSnapshotWithId(id = `id`, changedCallback = (gameObjData) => { }) {
        _unSubcribeSnapshot = Firebase.dbTalbes.doc(id)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    _dbCurrentGameData = doc.data();
                    changedCallback(Firebase.restoreGameObj(doc.data()));
                }
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

    static restoreGameObj(rawDataObj) {
        if (!rawDataObj) return;
        let r;
        let chessBoard = [];
        let userAcc = Firebase.convertCustomObjToGenericObj(rawDataObj.userAcc);
        let enemyAcc = Firebase.convertCustomObjToGenericObj(rawDataObj.enemyAcc);
        if (Firebase.isEmptyObj(enemyAcc)) {
            enemyAcc = null;
        }
        let gameMode = rawDataObj.gameMode;
        let id = rawDataObj.id;
        let currentPlayer = Firebase.restorePlayerObj(rawDataObj.currentPlayer);
        let whitePlayer = Firebase.restorePlayerObj(rawDataObj.whitePlayer);
        let blackPlayer = Firebase.restorePlayerObj(rawDataObj.blackPlayer);

        for (let x = 0; x < 8; ++x) {
            chessBoard.push([]);
            for (let y = 0; y < 8; ++y) {
                let stringObj = rawDataObj.chessBoard[x][y];
                let rObj = Firebase.convertStringToObj(stringObj);
                chessBoard[x].push(rObj);
            }
        }
        r = new Game(id, userAcc, gameMode);
        r.enemyAcc = enemyAcc;
        r.currentPlayer = currentPlayer;
        r.blackPlayer = blackPlayer;
        r.whitePlayer = whitePlayer;
        r.chessBoard = chessBoard;

        return r;
    }
    static restorePlayerObj(playerObj) {
        let p = Firebase.convertCustomObjToGenericObj(playerObj);
        p["alivePieces"] = [];
        p["deathPieces"] = [];
        let cpAlivePieces = [];
        let cpDeathPieces = [];

        for (let value of playerObj.alivePieces) {
            let rObj = Firebase.convertStringToObj(value);
            cpAlivePieces.push(rObj);
        }
        for (let value of playerObj.deathPieces) {
            let rObj = Firebase.convertStringToObj(value);
            cpAlivePieces.push(rObj);
        }
        p["alivePieces"].push(...cpAlivePieces);
        p["deathPieces"].push(...cpDeathPieces);

        return p;
    }
    static convertStringToObj(str = `king-w_0_0`) {
        let obj;
        let arr = str.split("_");
        let pieceName = arr[0];
        let currentPos = new Vector(Number(arr[1]), Number(arr[2]));
        if (pieceName == AssignedVar.KING_W) {
            obj = new King(AssignedVar.WHITE, currentPos);
        } else if (pieceName == AssignedVar.QUEEN_W) {
            obj = new Queen(AssignedVar.WHITE, currentPos);
        } else if (pieceName == AssignedVar.BISHOP_W) {
            obj = new Bishop(AssignedVar.WHITE, currentPos);
        } else if (pieceName == AssignedVar.KNIGHT_W) {
            obj = new Knight(AssignedVar.WHITE, currentPos);
        } else if (pieceName == AssignedVar.ROOK_W) {
            obj = new Rook(AssignedVar.WHITE, currentPos);
        } else if (pieceName == AssignedVar.PAWN_W) {
            obj = new Pawn(AssignedVar.WHITE, currentPos);
        } else if (pieceName == AssignedVar.KING_B) {
            obj = new King(AssignedVar.BLACK, currentPos);
        } else if (pieceName == AssignedVar.QUEEN_B) {
            obj = new Queen(AssignedVar.BLACK, currentPos);
        } else if (pieceName == AssignedVar.BISHOP_B) {
            obj = new Bishop(AssignedVar.BLACK, currentPos);
        } else if (pieceName == AssignedVar.KNIGHT_B) {
            obj = new Knight(AssignedVar.BLACK, currentPos);
        } else if (pieceName == AssignedVar.ROOK_B) {
            obj = new Rook(AssignedVar.BLACK, currentPos);
        } else if (pieceName == AssignedVar.PAWN_B) {
            obj = new Pawn(AssignedVar.BLACK, currentPos);
        } else if (pieceName == AssignedVar.EMPTY) {
            obj = new Empty(currentPos);
        }
        return obj;
    }
    static isEmptyObj(obj) {
        for (let property in obj) {
            return false;
        }
        return true;
    }

    static simptifyGameObj(gameObj) {
        let gObj;
        gObj = Firebase.convertCustomObjToGenericObj(gameObj);
        gObj.chessBoard = Firebase.simptifyChessBoard(gObj.chessBoard);
        gObj.currentPlayer = Firebase.simptifyPlayerData(gObj.currentPlayer);
        gObj.whitePlayer = Firebase.simptifyPlayerData(gObj.whitePlayer);
        gObj.blackPlayer = Firebase.simptifyPlayerData(gObj.blackPlayer);

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
        p["alivePieces"] = [];
        p["deathPieces"] = [];
        for (let i = 0; i < player.alivePieces.length; ++i) {
            p["alivePieces"].push(player.alivePieces[i].id);
        }
        for (let i = 0; i < player.deathPieces.length; ++i) {
            p["deathPieces"].push(player.deathPieces[i].id);
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