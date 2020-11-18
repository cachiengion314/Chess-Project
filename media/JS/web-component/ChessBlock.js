class ChessBlock extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.setAttribute(`class`, `chess-block`)
    }
}

window.customElements.define(`chess-block`, ChessBlock);