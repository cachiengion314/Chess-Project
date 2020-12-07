import Visualize from "./utility/Visualize.js";
import AssignedVar from "./utility/AssignedVar.js";
import User from "./gameplay/User.js";
import Firebase from "./utility/Firebase.js";
import Game from "./gameplay/Game.js";
import PopUp from "./utility/PopUp.js";
import Vector from "./utility/Vector.js";

import {
    subscribeSelectedPieceAt, changePlayerTurn, logicMovePieceTo, logicDestroyEnemyPiece,
    unSubscribeSelectedPiece, setupOnClickCallbackAt, onclickMovePieceAt
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
    if (User.getUserSignInId() == -1) {
        PopUp.show(`You have to sign in to enable this feature!`);
        return;
    }

    Firebase.currentTableId = this.id;
    console.log(`click, firebaseCurrentTalbeId:`, Firebase.currentTableId);
    let acc = User.getChessClubObj()[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][User.getUserSignInId()];
    acc.controllingColor = AssignedVar.BLACK;
    console.log(acc.controllingColor);
    AssignedVar.currentGame = new Game(acc, AssignedVar.ONLINE);
    let propertyObj = {
        opponent: acc,
    }

    PopUp.showLoading(() => {
        AssignedVar.currentGame.createNewChessBoard();
        AssignedVar.currentGame.setCurrentPlayer();
        AssignedVar.IsUserInLobby = false;

        Firebase.updateTableProperty(Firebase.currentTableId, propertyObj, () => {
            PopUp.closeModal(`#notification-modal`);
            Firebase.onSnapshotWithId(Firebase.currentTableId, tableChangedCallback);
        }, (errorCode) => {
            PopUp.show(`Sorry! There an error: "${errorCode}" in this action`, PopUp.sadImgUrl);
            AssignedVar.currentGame = null;
        });
    }, `Please waiting server to create table!`, AssignedVar.FAKE_LOADING_TIME);

}

function tableChangedCallback(tableData) {
    // the condition below will prevent this callback execute the last owner move
    if (tableData.lastTurn == AssignedVar.OPPONENT || !tableData.ownerLastMove || !tableData.ownerMove) { return; }
    // the line of codes below only execute owner move
    let ownerLastMove = tableData.ownerLastMove;
    let ownerMove = tableData.ownerMove;
    let arrLastMove = ownerLastMove.split("_");
    let arrMove = ownerMove.split("_");

    let lastMove = new Vector(Number(arrLastMove[1]), Number(arrLastMove[2]));
    let move = new Vector(Number(arrMove[1]), Number(arrMove[2]));

    onclickMovePieceAt(lastMove);
    onclickMovePieceAt(move);
}