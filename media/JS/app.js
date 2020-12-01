import initLobby from "./initLobby.js";
import listenAllEvents from "./listenAllEvents.js";

import "./web-component/WaitingTable.js";
import "./web-component/ChessPiece.js";
import "./web-component/ChessBlock.js";
import "./web-component/ChessBoard.js";
import AssignedVar from "./utility/AssignedVar.js";
import User from "./gameplay/User.js";
import Firebase from "./utility/Firebase.js";

$(document).ready(whenDocumentFullyLoaded);

function whenDocumentFullyLoaded() {
    Firebase.initialize();

    listenAllEvents();
    initLobby();
}

