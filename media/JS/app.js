import listenAllEvents from "./listenAllEvents.js";
import Game from "./gameplay/Game.js";
// import User from "./gameplay/User.js";

import "./web-component/WaitingTable.js";
import "./web-component/ChessPiece.js";
import "./web-component/ChessBlock.js";
import "./web-component/ChessBoard.js";

import Firebase from "./utility/Firebase.js";
import User from "./gameplay/User.js";

$(document).ready(whenDocumentFullyLoaded);

function whenDocumentFullyLoaded() {
    Firebase.initialize();
    User.saveDataForTheFirstTime();
    User.checkUserSignStatus();
    Game.initLogicPlayer();
    listenAllEvents();
}