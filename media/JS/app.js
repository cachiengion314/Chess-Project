import initLobby from "./initLobby.js";
import listenAllEvents from "./listenAllEvents.js";

import "./web-component/WaitingTable.js";
import "./web-component/ChessPiece.js";
import "./web-component/ChessBlock.js";
import "./web-component/ChessBoard.js";

$(document).ready(whenDocumentFullyLoaded);

function whenDocumentFullyLoaded() {
    listenAllEvents();
    initLobby();
}