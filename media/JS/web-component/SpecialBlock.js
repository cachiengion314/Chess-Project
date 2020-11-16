class SpecialBlock extends HTMLElement {
    constructor() {
        super();
    }
    get blocktype() {
        return this.getAttribute(`blocktype`);
    }
    set blocktype(val) {
        this.setAttribute(`blocktype`, val);
    }
    connectedCallback() {
        this.setAttribute(`class`, `special-block`)
    }
    static get observedAttributes() {
        return [`blocktype`];
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case `blocktype`:
                this.classList.remove(oldVal);
                this.classList.toggle(newVal);
                break;
        }
    }
}

window.customElements.define(`special-block`, SpecialBlock);