import Visualize from "./utility/Visualize.js";
import User from "./gameplay/User.js";
import AssignedVar from "./utility/AssignedVar.js";

export default function initLobby() {
    $(`#gameplay-group-btn`).hide();
    setTimeout(() => {
        test();
    }, 500);
}

function test() {
    for (let i = 0; i < 12; ++i) {
        let $component = document.createElement(`waiting-table`);
        $(`#waiting-tables`).append($component);
    }

}
