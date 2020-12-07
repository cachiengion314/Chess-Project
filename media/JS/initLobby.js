import Visualize from "./utility/Visualize.js";
import AssignedVar from "./utility/AssignedVar.js";
import User from "./gameplay/User.js";
import Firebase from "./utility/Firebase.js";
import Game from "./gameplay/Game.js";
import PopUp from "./utility/PopUp.js";
import Vector from "./utility/Vector.js";

import {
    subscribeSelectedPieceAt, changePlayerTurn, logicMovePieceTo, logicDestroyEnemyPiece,
    unSubscribeSelectedPiece, setupOnClickCallbackAt, updateToFirestoreData
} from "./initGameBoard.js";

export default function initLobby() {
    Firebase.queryAllTable((allTables) => {
        Game.TablesCount = allTables.length;
        Game.hideChessBoardAndShowLobby();
        for (let i = 0; i < Game.TablesCount; ++i) {
            let tableIndex = i + 1;
            createWaitingTableWith(tableIndex, allTables[i].data().owner.name, allTables[i].data().tableId);
        }
    });
}

function createWaitingTableWith(index, createdUserName, id) {
    let $table = document.createElement(`waiting-table`);
    $(`#waiting-tables`).append($table);
    $table.name = "waiting-table-" + index + "-" + createdUserName;
    $table.id = id;
    $table.onclick = onclickWaitingTable;
    return $table;
}

function onclickWaitingTable() {
    Firebase.curretnTableId = this.id;
    console.log(`click, firebaseCurrentTalbeId:`, Firebase.curretnTableId);
    let acc = User.getChessClubObj()[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][User.getUserSignInId()];
    AssignedVar.currentGame = new Game(User.getUserSignInId(), acc, AssignedVar.ONLINE);
    let propertyObj = {
        opponent: acc,
    }

    PopUp.showLoading(() => {
        AssignedVar.currentGame.createNewChessBoard();
        AssignedVar.currentGame.setCurrentPlayer();
        AssignedVar.IsUserInLobby = false;

        Firebase.updateTableProperty(Firebase.curretnTableId, propertyObj, () => {
            PopUp.closeModal(`#notification-modal`);
            Firebase.onSnapshotWithId(Firebase.curretnTableId, tableChangedCallback);
        }, (errorCode) => {
            PopUp.show(`Sorry! There an error: "${errorCode}" in this action`, PopUp.sadImgUrl);
            AssignedVar.currentGame = null;
        });
    }, `Please waiting server to create table!`, AssignedVar.FAKE_LOADING_TIME);

}

function tableChangedCallback(tableData) {
    if (!tableData.ownerLastMove || !tableData.ownerMove) { return; }

    let ownerLastMove = tableData.ownerLastMove;
    let ownerMove = tableData.ownerMove;
    let arrLastMove = ownerLastMove.split("_");
    let arrMove = ownerMove.split("_");

    let lastMove = new Vector(Number(arrLastMove[1], Number[arrLastMove[2]]));
    let move = new Vector(Number(arrMove[1], Number[arrMove[2]]));

    setupOnClickCallbackAt(lastMove);
    setupOnClickCallbackAt(move);

    console.log(`last move, move`, lastMove, move);
}