import Visualize from "./utility/Visualize.js";
import AssignedVar from "./utility/AssignedVar.js";
import User from "./gameplay/User.js";
import Firebase from "./utility/Firebase.js";
import Game from "./gameplay/Game.js";
import PopUp from "./utility/PopUp.js";

export default function initLobby() {
    Firebase.queryAllTable((allGames) => {
        Game.TablesCount = allGames.length;
        Game.hideChessBoardAndShowLobby();
        for (let i = 0; i < Game.TablesCount; ++i) {
            let tableIndex = i + 1;
            createWaitingTableWith(tableIndex, allGames[i].data().userAcc.name, allGames[i].data().id);
        }
    });
}

function createWaitingTableWith(index, createdUserName, id) {
    let $table = document.createElement(`waiting-table`);
    $(`#waiting-tables`).append($table);
    $table.name = "waiting-table-" + index + "-" + createdUserName;
    $table.id = `table-` + id;
    $table.onclick = onclickWaitingTable;
    return $table;
}

function onclickWaitingTable() {
    Firebase.getTable(this.id, (gameData) => {
        let acc = User.getChessClubObj()[AssignedVar.KEY_ALL_ACCOUNTS_SIGN_UP][User.getUserSignInId()];
        gameData.enemyAcc = acc;
        AssignedVar.currentGame = gameData;

        PopUp.showLoading(() => {
            AssignedVar.currentGame.createNewChessBoard();

            Firebase.updateEnemyAcc(this.id, acc, () => {
                AssignedVar.IsUserInLobby = false;
                PopUp.closeModal(`#notification-modal`);
                Firebase.onSnapshotWithId(Firebase.curretnTableId, tableChangedCallback);
            }, (errorCode) => {
                PopUp.show(`Sorry! There an error: "${errorCode}" in this action`, PopUp.sadImgUrl);
                AssignedVar.currentGame = null;
            });
        }, `Please waiting server to create table!`, AssignedVar.FAKE_LOADING_TIME);
    });
}
function tableChangedCallback(firebaseGameObjData) {
    if (firebaseGameObjData.currentPlayer.id == 0) {
        for (let i = 0; i < firebaseGameObjData.whitePlayer.alivePieces.length; ++i) {
            let modifiedPos = firebaseGameObjData.whitePlayer.alivePieces[i].currentPos;
            let originPos = new Vector(modifiedPos.x, modifiedPos.y);
            if (Game.whitePlayer.alivePieces[i]) {
                originPos = Game.whitePlayer.alivePieces[i].currentPos;
            }
            if (!originPos.isEqualTo(modifiedPos)) {
                setupOnClickCallbackAt(originPos);
                setupOnClickCallbackAt(modifiedPos);
                break;
            }
        }
    } else {
        for (let i = 0; i < firebaseGameObjData.blackPlayer.alivePieces.length; ++i) {
            let modifiedPos = firebaseGameObjData.blackPlayer.alivePieces[i].currentPos;
            let originPos = new Vector(modifiedPos.x, modifiedPos.y);
            if (Game.blackPlayer.alivePieces[i]) {
                originPos = Game.blackPlayer.alivePieces[i].currentPos;
            }
            if (!originPos.isEqualTo(modifiedPos)) {
                setupOnClickCallbackAt(originPos);
                setupOnClickCallbackAt(modifiedPos);
                break;
            }
        }
    }
}