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
    set controlbyplayerid(val) {
        if (typeof val == `number`) {
            this.setAttribute(`controlbyplayerid`, val);
        } else {
            if (val == `white`) {
                this.setAttribute(`controlbyplayerid`, 0);
            } else if (val == `black`) {
                this.setAttribute(`controlbyplayerid`, 1)
            }
        }
    }
    get controlbyplayerid() {
        return this.getAttribute(`controlbyplayerid`);
    }
    static get observedAttributes() {
        return [`name`, `controlbyplayerid`];
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case `name`:
                this.classList.remove(oldVal);
                this.classList.toggle(newVal);
                let arr = newVal.split(`-`);
                let corlor = arr[arr.length - 1];
                if (corlor == `w`) {
                    this.setAttribute(`controlbyplayerid`, 0);
                } else {
                    this.setAttribute(`controlbyplayerid`, 1);
                }
                break;
            case `controlbyplayerid`:
                if (newVal == `white`) {
                    this.setAttribute(`controlbyplayerid`, 0);
                } else if (newVal == `black`) {
                    this.setAttribute(`controlbyplayerid`, 1);
                }
                break;
        }
    }
}

window.customElements.define(`chess-piece`, ChessPiece);