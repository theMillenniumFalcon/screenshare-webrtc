import { addMsgToDom } from "./addMsgToDom";

export const manageNotifs = (notif, type) => {
    addMsgToDom(notif, type, target = document.querySelector('.notifs'));
}