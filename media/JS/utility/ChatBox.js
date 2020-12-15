import AssignedVar from "./AssignedVar.js";
import User from "../gameplay/User.js";
import Firebase from "./Firebase.js";

let $_txtInput;
let _unSubcribeTimeOut_owner;
let _unSubcribeTimeOut_opponent;

export default class ChatBox {
    static get OWNER_CHATBOX_ID() {
        return `#user-block`;
    }

    static get OPPONENT_CHATBOX_ID() {
        return `#enemy-block`;
    }

    static setup() {
        ChatBox.listenChatBoxInput();
        ChatBox.onclickChatBoxSendBtn();
    }

    static onclickChatBoxSendBtn() {
        let $sendBtn = $(`#function-col .box button`)[0];
        $sendBtn.onclick = () => {
            ChatBox.send();
            $_txtInput.value = "";
        };
    }

    static listenChatBoxInput() {
        $_txtInput = $(`#function-col .box input`)[0];
        $_txtInput.onkeydown = (event) => {
            if (event.keyCode == 13) {
                ChatBox.send();
                $_txtInput.value = "";
            }
        }
    }
    static send() {
        if (User.isTableOwner()) {
            ChatBox.show(ChatBox.OWNER_CHATBOX_ID, $_txtInput.value);
            Firebase.updateChatsProperty(Firebase.currentChatsId, { "ownerChat": $_txtInput.value }, () => {
                console.log(`owner sent success!`);
            });
        } else {
            ChatBox.show(ChatBox.OPPONENT_CHATBOX_ID, $_txtInput.value);
            Firebase.updateChatsProperty(Firebase.currentChatsId, { "opponentChat": $_txtInput.value }, () => {
                console.log(`opponent sent success!`);
            });
        }
    }
    static show(BLOCK_ID = `#user-block`, content) {
        $(`${BLOCK_ID} .chatbox`).html(content);
        $(`${BLOCK_ID} .chatbox`).animate({
            "opacity": "1"
        }, `slow`, () => {
            if (BLOCK_ID == ChatBox.OWNER_CHATBOX_ID) {
                clearTimeout(_unSubcribeTimeOut_owner);
                _unSubcribeTimeOut_owner = setTimeout(() => {
                    ChatBox.hide(ChatBox.OWNER_CHATBOX_ID);
                }, AssignedVar.FAKE_LOADING_TIME * 1.25);
            }
            if (BLOCK_ID == ChatBox.OPPONENT_CHATBOX_ID) {
                clearTimeout(_unSubcribeTimeOut_opponent);
                _unSubcribeTimeOut_opponent = setTimeout(() => {
                    ChatBox.hide(ChatBox.OPPONENT_CHATBOX_ID);
                }, AssignedVar.FAKE_LOADING_TIME * 1.25);
            }
        });
    }

    static hide(BLOCK_ID = `#user-block`) {
        $(`${BLOCK_ID} .chatbox`).animate({
            "opacity": "0"
        }, `slow`);
    }
}