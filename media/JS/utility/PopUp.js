export default class PopUp {
    static sadImgUrl = "./media/Image/sad.png";
    static happyImgUrl = "";
    static loadingImgUrl = "./media/Image/sand_clock.png";
    static successImgUrl = "./media/Image/success.png";
    static normalModalWidth = "65%";
    static bigModalWidth = "55%";
    static userNameTxtColor = "red";

    static onclickCloseModalBtn() {
        $(`.custom-modal-footer .close-btn`).click(() => {
            $(`.custom-modal h4`).css({
                "display": "none",
            });
            $(`.custom-modal .custom-modal-content`).animate({
                "width": "0%",
            }, "fast", () => {
                $(`.custom-modal`).css({
                    "display": "none",
                });
            });
        });
    }
    static show(content, imgUrl = PopUp.successImgUrl) {
        PopUp.calculateModalWidth();
        content = PopUp.highlightContent(content);
        $(`#notification-modal h4`).html(content);
        $(`#user-name-txt`).css({ "color": PopUp.userNameTxtColor });

        $(`#notification-modal img`).attr(`src`, imgUrl);
        $(`#notification-modal`).css({
            "display": "block",
        });
        $(`#notification-modal .custom-modal-content`).animate({
            "width": PopUp.bigModalWidth,
        }, "fast", () => {
            $(`#notification-modal .custom-modal-header`).css({
                "display": "flex",
                "justify-content": "center",
            });
            $(`#notification-modal .custom-modal-header h4`).css({
                "display": "inline",
            });
        });
        $(`#notification-modal .custom-modal-content`).animate({
            "width": PopUp.normalModalWidth,
        }, "fast");
    }
    static calculateModalWidth() {
        PopUp.normalModalWidth = (1000 / window.innerWidth * 40);
        if (PopUp.normalModalWidth > 90) {
            PopUp.normalModalWidth = 90;
        }
        if (PopUp.normalModalWidth < 40) {
            PopUp.normalModalWidth = 40;
        }
        PopUp.bigModalWidth = PopUp.normalModalWidth * 1.25;
        PopUp.normalModalWidth = PopUp.normalModalWidth.convertToPercent();
        PopUp.bigModalWidth = PopUp.bigModalWidth.convertToPercent();
    }
    static highlightContent(content) {
        let arr = content.split(`"`);
        if (arr.length == 3) {
            let div0 = `<h4 style="font-size: 1em">${arr[0]} </h4>`
            let div1 = `<h4 id="user-name-txt" style="font-size: 1em">${arr[1]}</h4>`
            let div2 = `<h4 style="font-size: 1em"> ${arr[2]}</h4>`
            content = `${div0} ${div1} ${div2}`;
        }
        return content;
    }
}

Number.prototype.convertToPercent = function () {
    return this + "%";
}