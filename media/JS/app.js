import initLobby from "./InitLobby.js";
import listenAllEvents from "./ListenAllEvents.js";

$(document).ready(whenDocumentFullyLoad);

function whenDocumentFullyLoad() {
    listenAllEvents();
    initLobby();
}