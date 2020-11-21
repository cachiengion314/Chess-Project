import { initGameBoard } from "./InitGameBoard.js";

$(document).ready(readyCallback);

function readyCallback() {
    initGameBoard();
    console.log(`hi appjs`)
}