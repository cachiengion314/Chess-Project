class ChessBoard extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        console.log(`hi chess-board`);
    }
}

window.customElements.define(`chess-board`, ChessBoard);