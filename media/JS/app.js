import initLobby from "./initLobby.js";
import listenAllEvents from "./listenAllEvents.js";

import "./web-component/WaitingTable.js";
import "./web-component/ChessPiece.js";
import "./web-component/ChessBlock.js";
import "./web-component/ChessBoard.js";
import AssignedVar from "./utility/AssignedVar.js";
import User from "./gameplay/User.js";

$(document).ready(whenDocumentFullyLoaded);

function whenDocumentFullyLoaded() {
    firebaseInitialize();
    
    getUser();
    listenAllEvents();
    initLobby();
}

function firebaseInitialize() {
    firebase.initializeApp({
        apiKey: 'AIzaSyA8X5BGIHdic4rowTSnVhx_OrdHSkonngQ',
        authDomain: 'chess-club-online.firebaseapp.com',
        projectId: 'chess-club-online',
    });

    AssignedVar.db = firebase.firestore();
    AssignedVar.dbUsers = AssignedVar.db.collection(`users`);
}
function setUser() {
    let me1 = new User(`cachiengion314`, `cachiengion314@gmail.com`, `12345`);
    let me2 = new User(`lung123`, `lung123@gmail.com`, `12345`);
    let me3 = new User(`xuan`, `xuan@gmail.com`, `12345`);
    let me4 = new User(`phong`, `phong@gmail.com`, `12345`);
    let me5 = new User(`tuanhtranthi`, `tuanhtranthi@gmail.com`, `12345`);
    me1 = convertCustomObjToGenericObj(me1);
    me2 = convertCustomObjToGenericObj(me2);
    me3 = convertCustomObjToGenericObj(me3);
    me4 = convertCustomObjToGenericObj(me4);
    me5 = convertCustomObjToGenericObj(me5);

    AssignedVar.dbUsers.doc().set(me1);
    AssignedVar.dbUsers.doc().set(me2);
    AssignedVar.dbUsers.doc().set(me3);
    AssignedVar.dbUsers.doc().set(me4);
    AssignedVar.dbUsers.doc().set(me5);

}
function getUser() {
    let promiseUser = AssignedVar.dbUsers.get();
    promiseUser.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        });
    });
}
function convertCustomObjToGenericObj(customObj) {
    let genericObj = {};
    for (let property in customObj) {
        genericObj[property] = customObj[property];
    }
    return genericObj;
}