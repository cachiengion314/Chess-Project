import Visualize from "./utility/Visualize.js";
import AssignedVar from "./utility/AssignedVar.js";
import User from "./gameplay/User.js";
import Firebase from "./utility/Firebase.js";
import Game from "./gameplay/Game.js";

export default function initLobby() {
    Firebase.queryAllTable((allGames) => {
        Game.TablesCount = allGames.length;

        Game.hideChessBoardAndShowLobby();
        for (let i = 0; i < Game.TablesCount; ++i) {
            let tableIndex = i + 1;
            createWaitingTableWith(tableIndex, allGames[i].data().userAcc.name);
        }
    });
}

function createWaitingTableWith(index, createdUserName) {
    let $table = document.createElement(`waiting-table`);
    $(`#waiting-tables`).append($table);
    $table.name = "waiting-table-" + index + "-" + createdUserName;
    return $table;
}