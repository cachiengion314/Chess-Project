class ChessPiece extends HTMLElement {
    constructor() {
        super();
    }
    get imgname() {
        return this.getAttribute(`imgname`);
    }
    set imgname(val) {
        this.setAttribute(`imgname`, val);
    }
    static get observedAttributes() {
        return [`imgname`, ];
    }
    connectedCallback() {
        this.setAttribute(`class`, `chess-piece`);
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case `imgname`:
                this.classList.remove(oldVal);
                this.classList.toggle(newVal);
                break;
        }
    }
}

window.customElements.define(`chess-piece`, ChessPiece);