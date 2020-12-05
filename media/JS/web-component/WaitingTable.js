class WaitingTable extends HTMLElement {
    constructor() {
        super();
        this.domStr = `
            <style>
                .waiting-table-contents {
                    position: absolute;
                    top: 0px;
                    left: 0px;
                }
                .display-flex {
                    display: flex;
                }
                .player-icon {
                    position: relative;
                    top: 25%;
                    width: 20%;
                    height: 20%;
                    background-color: bisque;
                }
                .table-icon {
                    width: 60%;
                    height: 100%;
                    background-color: teal;
                }
                #table-title{
                    color: white;
                    font-size: 1.3vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    line-height: 1.3vw;
                }
            </style>
           
            <div class="equal-height-pointer" style="padding-top: 100%;"></div>
            <div class="waiting-table-contents" style="width: 100%; height: 100%;">
                <div id="table-title" style="height: 25%;">table: 1</div>
                <div class="display-flex" style="width: 100%; height: 75%;">
                        <div class="player-icon"></div>
                        <div class="table-icon"></div>
                        <div class="player-icon"></div>
                </div>
            </div>
        `;
        this.shadowR = this.attachShadow({ mode: `open` });
    }
    set name(val) {
        this.setAttribute(`name`, val);
    }
    get name() {
        return this.getAttribute(`name`)
    }
    connectedCallback() {
        $(this).css({
            "background-color": `lightseagreen`,
            "width": `20%`,
            "height": `fit-content`,
            "margin-right": `10px`,
            "margin-left": `10px`,
            "margin-top": `10px`,
            "margin-bottom": `10px`,
            "position": `relative`,
        });
        $(this.shadowR).append(this.domStr);
        $(this).hover(() => {
            $(this).css({
                "background-color": "red",
            });
        }, () => {
            $(this).css({
                "background-color": "lightseagreen",
            });
        });
        this.tableTitle = this.shadowR.getElementById(`table-title`);
    }
    static get observedAttributes() {
        return [`name`];
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case `name`:
                this.tableTitle.textContent = newVal;
                break;
        }
    }
}

window.customElements.define(`waiting-table`, WaitingTable);