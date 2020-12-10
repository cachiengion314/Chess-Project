import Visualize from "./utility/Visualize.js";
import AssignedVar from "./utility/AssignedVar.js";
import User from "./gameplay/User.js";
import Firebase from "./utility/Firebase.js";
import Game from "./gameplay/Game.js";
import PopUp from "./utility/PopUp.js";
import Vector from "./utility/Vector.js";

import {
    onclickMovePieceAt
} from "./initGameBoard.js";

export default function initLobby() {
    Firebase.queryAllTable((allTables) => {
        Game.hideChessBoardAndShowLobby();
        if (allTables.length == 0) {
            let txt = `<h3 style="color: teal; opacity: .5; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <div>Thật khó tin, toàn server không hề có nổi một bàn chơi nào!</div>
                        <div class="space-vertical"></div>
                        <div>Xin hãy thử nhấn f5 để hệ thống tự động cập nhật bàn chơi mới xem sao!</div>
                       </h3>`;
            $(`#waiting-tables`).html(txt);
        } else {
            $(`#waiting-tables`).empty();
            for (let i = 0; i < allTables.length; ++i) {
                if (allTables[i].data().tableId != -1) {
                    let tableIndex = i + 1;
                    let table = createWaitingTableWith(tableIndex, allTables[i].data());
                    User.tables[allTables[i].data().tableId] = table;
                }
            }
            User.checkRageQuit();
        }
    });
}

function createWaitingTableWith(index, data) {
    let $table = document.createElement(`waiting-table`);
    $(`#waiting-tables`).append($table);
    $table.id = data.tableId;
    $table.owner = data.owner;
    $table.ownerid = data.owner.id;
    if (data.opponent) {
        $table.opponentid = data.opponent.id;
        $table.opponent = data.opponent;
    }
    $table.playersnumber = data.playersNumber;
    $table.name = `Bàn số: ${index} | Chủ: ${data.owner.name} | số lượng: ${data.playersNumber}`;
    $table.onclick = onclickWaitingTable;
    return $table;
}

function onclickWaitingTable() {
    if (User.getUserSignInId() == -1) {
        PopUp.show(`Bạn phải đăng nhập để có thể sử dụng được chức năng này!`, PopUp.boringImgUrl);
        return;
    }
    if (User.tables[this.id] && User.tables[this.id].playersnumber >= 2) {
        PopUp.show(`Bàn này đã có đủ ${User.tables[this.id].playersnumber} người rồi! Chúng ta không nên vào phá!`, PopUp.boringImgUrl);
        return;
    }
    Firebase.currentTableId = this.id;
    let playersNumber = ++User.tables[Firebase.currentTableId].playersnumber;

    let acc = User.getUserSignIn();
    if (!acc) {
        console.log(`user may accidently delete their own localStorage data!`);
        PopUp.show(`you cannot join`);
        return;
    }
    acc.controllingColor = AssignedVar.BLACK;
    acc.tempLoses = 0;
    acc.isReady = false;
    AssignedVar.currentGame = new Game(AssignedVar.ONLINE);
    AssignedVar.countMaxCurrentLoses = 0;
    let propertyObj = {
        opponent: acc,
        is_opponentRageQuit: false,
        "owner.tempLoses": 0,
        "owner.isReady": false,
        "ownerMove": null,
        "ownerLastMove": null,
        "opponentMove": null,
        "opponentLastMove": null,
        "playersNumber": playersNumber,
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
            PopUp.show(`Rất tiếc! Có thể bàn chơi đã bị chủ bàn hủy!`, PopUp.sadImgUrl);
            Game.saveAndUpdateScore();
            AssignedVar.IsUserInLobby = true;
        });
    }, `Vui lòng đợi hệ thống làm việc!`, AssignedVar.FAKE_LOADING_TIME);
}

function tableChangedCallback(tableData) {
    AssignedVar.currentTable = tableData;
    Game.quickSaveUserStatistic();
    mimicAllOwnerActionForThisAcc();
}

function mimicAllOwnerActionForThisAcc() {
    kickThisAccToLobbyWhenOwnerQuit();
    if (AssignedVar.currentTable.tableId == -1 || !AssignedVar.currentTable.opponent) return;
    resetBoardWhenOwnerResigned();
    mimicChessPiece();
    mimicOwnerMove();
}

function kickThisAccToLobbyWhenOwnerQuit() {
    if (AssignedVar.currentTable.tableId == -1) {
        if (!AssignedVar.IsUserInLobby) {
            AssignedVar.IsUserInLobby = true;
            PopUp.show(`Wow! Chủ bàn đã tự out nên bạn cũng đã bị kick ra khỏi bàn! Thật là vi diệu!`, PopUp.jokeImgUrl);
            Game.saveAndUpdateScore();
        }
    }
}

function resetBoardWhenOwnerResigned() {
    if (AssignedVar.countMaxCurrentLoses < AssignedVar.currentTable.owner.tempLoses) {
        PopUp.show(`Thật không thể tin được! Chủ phòng vừa "tự đầu hàng" nên bạn không cần phải vất vả đánh nữa!`, PopUp.happierImgUrl);
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