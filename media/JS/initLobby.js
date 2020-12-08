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
                        Không có bàn chơi nào! Vui lòng nhấn thử f5 để hệ thống cập nhật bàn chơi mới! 
                        Còn nếu bạn không muốn chờ lâu vui lòng click vào nút "Tạo bàn" để tạo bàn.
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
    acc.tempLoses = 0;
    acc.tempWins = 0;
    oTempLoses = 0;
    acc.controllingColor = AssignedVar.BLACK;

    AssignedVar.currentGame = new Game(AssignedVar.ONLINE);
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
            console.log(`onclickWaitingTable: ${errorCode}`);
            PopUp.show(`Bàn chơi có thể đã bị chủ bàn tiêu hủy!`, PopUp.sadImgUrl);
            Game.quitEventInvokeForOpponent();
            AssignedVar.IsUserInLobby = true;
        });
    }, `Làm ơn đợi hệ thống làm việc!`, AssignedVar.FAKE_LOADING_TIME);

}

function tableChangedCallback(tableData) {
    AssignedVar.currentTable = tableData;
    controlAllOwnerActionForThisAcc();
}

function controlAllOwnerActionForThisAcc() {
    kickThisAccToLobbyWhenOwnerQuit();

    if (AssignedVar.currentTable.tableId == -1 || !AssignedVar.currentTable.opponent) return;
    resetBoardWhenOwnerResigned();
    controlChessPiece();
    controlOwnerMove();
}

function kickThisAccToLobbyWhenOwnerQuit() {
    if (AssignedVar.currentTable.tableId == -1) {
        if (!AssignedVar.IsUserInLobby) {
            AssignedVar.IsUserInLobby = true;
            PopUp.show(`Xin lỗi! Chủ bàn chơi đã tự thoát nên bạn cũng bị đá ra khỏi bàn! Thật là nhọ!`, PopUp.sadImgUrl)
            Game.resetTempStatus();
        }
    }
}

let oTempLoses = 0;
function resetBoardWhenOwnerResigned() {
    if (oTempLoses < AssignedVar.currentTable.owner.tempLoses) {
        console.log(`owner have just resigned!`);
        PopUp.show(`Xin chúc mừng! Đối thủ vừa đầu hàng bạn! Trận đấu đã tự động được reset!`);
        oTempLoses = AssignedVar.currentTable.owner.tempLoses;
        AssignedVar.currentGame.resetGameBoard();
    }
}

function controlChessPiece() {
    if (AssignedVar.currentTable.owner.isReady) {
        Game.setReadyBgOn(`#user-block`);
        if (AssignedVar.IsUserAndEnemyReady) {
            AssignedVar.currentGame.letPlayerControlChessPiece();
        }
    }
}

function controlOwnerMove() {
    // the condition below will prevent this callback execute from the last owner move
    if (AssignedVar.currentTable.lastTurn != AssignedVar.OWNER
        || !AssignedVar.currentTable.ownerLastMove || !AssignedVar.currentTable.ownerMove) { return; }
    // the line of codes below will mimic owner move
    let ownerLastMove = AssignedVar.currentTable.ownerLastMove;
    let ownerMove = AssignedVar.currentTable.ownerMove;
    let arrLastMove = ownerLastMove.split("_");
    let arrMove = ownerMove.split("_");

    let lastMove = new Vector(Number(arrLastMove[1]), Number(arrLastMove[2]));
    let move = new Vector(Number(arrMove[1]), Number(arrMove[2]));

    onclickMovePieceAt(lastMove);
    onclickMovePieceAt(move);
}