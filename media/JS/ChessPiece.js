class ChessPiece extends HTMLElement {
    constructor() {
        super();
    }
    get name() {
        return this.getAttribute(`name`);
    }
    set name(val) {
        this.setAttribute(`name`, val);
    }
    static get observedAttributes() {
        return [`name`, ];
    }
    connectedCallback() {
        this.setAttribute(`class`, `chess-piece`);
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case `name`:
                this.classList.remove(oldVal);
                this.classList.toggle(newVal);
                break;
        }
    }
}

window.customElements.define(`chess-piece`, ChessPiece);