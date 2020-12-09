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
        if (Game.TablesCount == 0) {
            let txt = `<h3 style="color: teal; opacity: .5; text-align: center; display: flex; justify-content: center; align-items: center;">
                        Không có bàn chơi nào! Vui lòng nhấn f5 để hệ thống tự động cập nhật bàn chơi mới!
                        Lưu ý 1: Tạm thời, chỉ có chủ phòng cầm quân trắng và được đánh trước.
                        Lưu ý 2: Không tự ý thoát ra ngoài khi đang chơi dở.
                       </h3>`;
            $(`#waiting-tables`).html(txt);
        } else {
            $(`#waiting-tables`).empty();
            for (let i = 0; i < Game.TablesCount; ++i) {
                let tableIndex = i + 1;
                createWaitingTableWith(tableIndex, allTables[i].data().owner.name, allTables[i].data().tableId);
            }
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
        PopUp.show(`Bạn phải đăng nhập để có thể sử dụng được chức năng này!`);
        return;
    }
    Firebase.currentTableId = this.id;

    let acc = User.getUserSignIn();
    acc.controllingColor = AssignedVar.BLACK;
    acc.tempLoses = 0;
    acc.isReady = false;
    AssignedVar.currentGame = new Game(AssignedVar.ONLINE);
    AssignedVar.countMaxCurrentLoses = 0;
    let propertyObj = {
        opponent: acc,
        "owner.tempLoses": 0,
        "owner.isReady": false,
        "ownerMove": null,
        "ownerLastMove": null,
        "opponentMove": null,
        "opponentLastMove": null,
    }

    PopUp.showLoading(() => {
        Firebase.updateTableProperty(Firebase.currentTableId, propertyObj, () => {
            AssignedVar.currentGame.createNewChessBoard();
            AssignedVar.currentGame.setCurrentPlayer();
            AssignedVar.IsUserInLobby = false;
            PopUp.closeModal(`#notification-modal`);
            Firebase.onSnapshotWithId(Firebase.currentTableId, tableChangedCallback);
        }, (errorCode) => {
            console.log(`onclickWaitingTable: ${errorCode}`);
            PopUp.show(`Rất tiếc! Bàn chơi đã bị chủ bàn tiêu hủy!`, PopUp.sadImgUrl);
            Game.saveAndUpdateScore();
            AssignedVar.IsUserInLobby = true;
        });
    }, `Làm ơn đợi hệ thống làm việc!`, AssignedVar.FAKE_LOADING_TIME);

}

function tableChangedCallback(tableData) {
    AssignedVar.currentTable = tableData;
    Game.quickSaveUserStatistic();
    mimicAllOwnerActionForThisAcc();
}

function mimicAllOwnerActionForThisAcc() {
    kickThisAccToLobbyWhenOwnerQuit();
    // prevent code execute when you being kick out of the table
    if (AssignedVar.currentTable.tableId == -1 || !AssignedVar.currentTable.opponent) return;
    resetBoardWhenOwnerResigned();
    mimicChessPiece();
    mimicOwnerMove();
}

function kickThisAccToLobbyWhenOwnerQuit() {
    if (AssignedVar.currentTable.tableId == -1) {
        if (!AssignedVar.IsUserInLobby) {
            AssignedVar.IsUserInLobby = true;
            PopUp.show(`Wow! Chủ bàn chơi đã tự out nên bạn cũng đã bị kick ra khỏi bàn! Thật là vi diệu!`, PopUp.jokeImgUrl);
            Game.saveAndUpdateScore();
        }
    }
}

function resetBoardWhenOwnerResigned() {
    if (AssignedVar.countMaxCurrentLoses < AssignedVar.currentTable.owner.tempLoses) {
        PopUp.show(`Thật không thể tin được! Thật tuyệt vời! Đối thủ vừa "tự đầu hàng" nên bạn không cần phải vất vả đánh nữa!`, PopUp.happierImgUrl);
        AssignedVar.countMaxCurrentLoses = AssignedVar.currentTable.owner.tempLoses;
        AssignedVar.currentGame.resetGameBoard();
    }
}

function mimicChessPiece() {
    if (AssignedVar.currentTable.owner.isReady) {
        Game.setReadyBgOn(`#user-block`);
        if (AssignedVar.IsUserAndEnemyReady) {
            AssignedVar.currentGame.letPlayerControlChessPiece();
        }
    }
}

function mimicOwnerMove() {
    // the condition below will prevent this callback execute from the last owner move
    if (AssignedVar.currentTable.lastTurn != AssignedVar.OWNER
        || !AssignedVar.currentTable.ownerLastMove || !AssignedVar.currentTable.ownerMove) { return; }

    let ownerLastMove = AssignedVar.currentTable.ownerLastMove;
    let ownerMove = AssignedVar.currentTable.ownerMove;
    let arrLastMove = ownerLastMove.split("_");
    let arrMove = ownerMove.split("_");

    let lastMove = new Vector(Number(arrLastMove[1]), Number(arrLastMove[2]));
    let move = new Vector(Number(arrMove[1]), Number(arrMove[2]));

    onclickMovePieceAt(lastMove);
    onclickMovePieceAt(move);
}