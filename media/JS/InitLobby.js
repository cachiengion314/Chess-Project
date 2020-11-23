import Visualize from "./utility/Visualize.js";

export default function initLobby() {
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