import AssignedVar from "./AssignedVar.js";

let _unSubcribeTimeout;

export default class PopUp {
    static sadImgUrl = "./media/Image/sad.png";
    static happyImgUrl = "./media/Image/happy.png";
    static happierImgUrl = "./media/Image/happier.png"
    static angryImgUrl = "./media/Image/angry.png"
    static loadingImgUrl = "./media/Image/sand_clock.png";
    static successImgUrl = "./media/Image/success.png";
    static questionImgUrl = "./media/Image/question.png";
    static jokeImgUrl = "./media/Image/joke.png";
    static boringImgUrl = "./media/Image/boring.png";
    static cuteImgUrl = "./media/Image/cute.png";

    static normalModalWidth = "65%";
    static bigModalWidth = "55%";
    static userNameTxtColor = "red";

    static showOption(content = "option", yesCallback = () => { }, noCallback = () => { }) {
        let OPTION_MODAL_ID = `#option-modal`;
        PopUp.openModal(OPTION_MODAL_ID);

        let $noBtn = $(`${OPTION_MODAL_ID} .custom-modal-footer .close-btn`)[0];
        let $yesBtn = $(`${OPTION_MODAL_ID} .custom-modal-footer .close-btn`)[1];
        $noBtn.onclick = () => {
            PopUp.closeModal(OPTION_MODAL_ID);
        }
        $yesBtn.onclick = () => {
            PopUp.closeModal(OPTION_MODAL_ID, yesCallback);
        };

        content = PopUp.highlightContent(content);
        $(`${OPTION_MODAL_ID} h4`).html(content);
        $(`#user-name-txt`).css({ "color": PopUp.userNameTxtColor });
    }

    static showSignIn(signInCallback = () => { }, cancelCallback = () => { }) {
        let SIGN_MODAL_ID = `#sign-modal`;
        PopUp.openModal(SIGN_MODAL_ID);

        let $cancelBtn = $(`${SIGN_MODAL_ID} .custom-modal-footer .close-btn`)[0]
        let $signInBtn = $(`${SIGN_MODAL_ID} .custom-modal-footer .close-btn`)[1];
        $signInBtn.textContent = `Đăng nhập!`;
        $cancelBtn.onclick = () => {
            PopUp.closeModal(SIGN_MODAL_ID, cancelCallback);
        }
        $signInBtn.onclick = () => {
            signInCallback();
        }
        let $nameBlock = $(`${SIGN_MODAL_ID} .txt-input`)[0];
        let $emailBlock = $(`${SIGN_MODAL_ID} .txt-input`)[1];
        let $password1Block = $(`${SIGN_MODAL_ID} .txt-input`)[2];
        let $password2Block = $(`${SIGN_MODAL_ID} .txt-input`)[3];
        $($nameBlock).show();
        $($emailBlock).hide();
        $($password1Block).show();
        $($password2Block).hide();

        let yourName = $(`${SIGN_MODAL_ID} .txt`)[0];
        yourName.textContent = `Tên của bạn`;
        let yourPass = $(`${SIGN_MODAL_ID} .txt`)[2];
        yourPass.textContent = `Password của bạn`;
        $(`${SIGN_MODAL_ID} .txt`).removeClass(`red`);

        $(`${SIGN_MODAL_ID} img`).attr(`src`, PopUp.happierImgUrl)
        $(`${SIGN_MODAL_ID} h4`).html(`Hãy đăng nhập nào!`);
    }

    static showSignUp(signUpCallback = () => { }, cancelCallback = () => { }) {
        let SIGN_MODAL_ID = `#sign-modal`;
        PopUp.openModal(SIGN_MODAL_ID);

        let $cancelBtn = $(`${SIGN_MODAL_ID} .custom-modal-footer .close-btn`)[0]
        let $signUpBtn = $(`${SIGN_MODAL_ID} .custom-modal-footer .close-btn`)[1];
        $signUpBtn.textContent = `Đăng ký!`;
        $cancelBtn.onclick = () => {
            PopUp.closeModal(SIGN_MODAL_ID, cancelCallback);
        }
        $signUpBtn.onclick = () => {
            signUpCallback();
        }

        let $nameBlock = $(`${SIGN_MODAL_ID} .txt-input`)[0];
        let $emailBlock = $(`${SIGN_MODAL_ID} .txt-input`)[1];
        let $password1Block = $(`${SIGN_MODAL_ID} .txt-input`)[2];
        let $password2Block = $(`${SIGN_MODAL_ID} .txt-input`)[3];
        $($nameBlock).show();
        $($emailBlock).show();
        $($password1Block).show();
        $($password2Block).show();

        let yourName = $(`${SIGN_MODAL_ID} .txt`)[0];
        yourName.textContent = `Tên của bạn`;
        let yourEmail = $(`${SIGN_MODAL_ID} .txt`)[1];
        yourEmail.textContent = `Email của bạn`;
        let yourPass = $(`${SIGN_MODAL_ID} .txt`)[2];
        yourPass.textContent = `Password của bạn`;
        let clarifyPass = $(`${SIGN_MODAL_ID} .txt`)[3];
        clarifyPass.textContent = `Xác nhận lại password`;
        $(`${SIGN_MODAL_ID} .txt`).removeClass(`red`);

        $(`${SIGN_MODAL_ID} img`).attr(`src`, PopUp.happyImgUrl)
        $(`${SIGN_MODAL_ID} h4`).html(`Hãy đăng ký để chơi online nào!`);
    }

    static showWait(closeConditionCallback, content = `Please stand by!`, fakeLoadingTime = 0, imgUrl = PopUp.loadingImgUrl) {
        let WAIT_MODAL_ID = `#wait-modal`;
        PopUp.openModal(WAIT_MODAL_ID, imgUrl);

        content = PopUp.highlightContent(content);
        $(`${WAIT_MODAL_ID} h4`).html(content);
        $(`#user-name-txt`).css({ "color": PopUp.userNameTxtColor });

        clearTimeout(_unSubcribeTimeout);
        _unSubcribeTimeout = setTimeout(closeConditionCallback, fakeLoadingTime);
    }

    static showLoading(closeConditionCallback, content = `Please stand by!`, fakeLoadingTime = 0, imgUrl = PopUp.loadingImgUrl) {
        let NOTIFICATION_MODAL_ID = `#notification-modal`;
        PopUp.openModal(NOTIFICATION_MODAL_ID, imgUrl);

        let $okBtn = $(`${NOTIFICATION_MODAL_ID} .custom-modal-footer .close-btn`)[0];
        let $noBtn = $(`${NOTIFICATION_MODAL_ID} .custom-modal-footer .close-btn`)[1];
        let $yesBtn = $(`${NOTIFICATION_MODAL_ID} .custom-modal-footer .close-btn`)[2];
        $($yesBtn).hide();
        $($noBtn).hide();
        $($okBtn).hide();

        content = PopUp.highlightContent(content);
        $(`${NOTIFICATION_MODAL_ID} h4`).html(content);
        $(`#user-name-txt`).css({ "color": PopUp.userNameTxtColor });

        clearTimeout(_unSubcribeTimeout);
        _unSubcribeTimeout = setTimeout(closeConditionCallback, fakeLoadingTime);
    }

    static showYesNo(content = "yes or no", imgUrl = PopUp.sadImgUrl, yesCallback = () => { }, noCallback = () => { }) {
        let NOTIFICATION_MODAL_ID = `#notification-modal`;
        PopUp.openModal(NOTIFICATION_MODAL_ID, imgUrl);

        let $okBtn = $(`${NOTIFICATION_MODAL_ID} .custom-modal-footer .close-btn`)[0];
        let $noBtn = $(`${NOTIFICATION_MODAL_ID} .custom-modal-footer .close-btn`)[1];
        let $yesBtn = $(`${NOTIFICATION_MODAL_ID} .custom-modal-footer .close-btn`)[2];
        $($yesBtn).show();
        $($noBtn).show();
        $($okBtn).hide();
        $noBtn.onclick = () => {
            PopUp.closeModal(NOTIFICATION_MODAL_ID, noCallback);
        };
        $yesBtn.onclick = () => {
            PopUp.closeModal(NOTIFICATION_MODAL_ID, yesCallback);
        };

        content = PopUp.highlightContent(content);
        $(`${NOTIFICATION_MODAL_ID} h4`).html(content);
        $(`#user-name-txt`).css({ "color": PopUp.userNameTxtColor });
    }

    static show(content = "notify", imgUrl = PopUp.successImgUrl) {
        let NOTIFICATION_MODAL_ID = `#notification-modal`;
        PopUp.openModal(NOTIFICATION_MODAL_ID, imgUrl);

        let $okBtn = $(`${NOTIFICATION_MODAL_ID} .custom-modal-footer .close-btn`)[0];
        let $noBtn = $(`${NOTIFICATION_MODAL_ID} .custom-modal-footer .close-btn`)[1];
        let $yesBtn = $(`${NOTIFICATION_MODAL_ID} .custom-modal-footer .close-btn`)[2];
        $($yesBtn).hide();
        $($noBtn).hide();
        $($okBtn).show();
        $okBtn.onclick = () => {
            PopUp.closeModal(NOTIFICATION_MODAL_ID);
        };

        content = PopUp.highlightContent(content);
        $(`${NOTIFICATION_MODAL_ID} h4`).html(content);
        $(`#user-name-txt`).css({ "color": PopUp.userNameTxtColor });
    }

    static closeModal(MODAL_ID, completedCallback = () => { }) {
        $(`${MODAL_ID} h4`).css({
            "display": "none",
        });
        $(`${MODAL_ID} .custom-modal-content`).animate({
            "width": "0%",
        }, "fast", () => {
            $(`${MODAL_ID}`).css({
                "display": "none",
            });
            setTimeout(completedCallback, 100);
        });
    }

    static openModal(MODAL_ID, imgUrl = PopUp.successImgUrl) {
        PopUp.calculateModalWidth();
        $(`${MODAL_ID}`).css({
            "display": "block",
            "z-index": AssignedVar.CUSTOM_MODAL_ZINDEX,
        });
        if (MODAL_ID == "#notification-modal" || MODAL_ID == "#wait-modal") {
            $(`${MODAL_ID} img`).attr(`src`, imgUrl);
            $(`${MODAL_ID}`).css({
                "z-index": AssignedVar.NOTIFICATION_MODAL_ZINDEX,
            });
        }
        $(`${MODAL_ID} .custom-modal-content`).animate({
            "width": PopUp.bigModalWidth,
        }, "fast", () => {
            $(`${MODAL_ID} .custom-modal-header h4`).css({
                "display": "inline",
            });
        });
        $(`${MODAL_ID} .custom-modal-content`).animate({
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
        if (arr.length > 2) {
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