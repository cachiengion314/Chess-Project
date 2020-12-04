import Visualize from "./utility/Visualize.js";
import User from "./gameplay/User.js";
import AssignedVar from "./utility/AssignedVar.js";
import Game from "./gameplay/Game.js";

export default function initLobby() {
    Game.hideChessBoardAndShowLobby();

    setTimeout(() => {
        test();
    }, 500);
}

function test() {
    for (let i = 0; i < 14; ++i) {
        let $component = document.createElement(`waiting-table`);
        $(`#waiting-tables`).append($component);
    }
}