import { activeUsers, connection } from "./constants/constants";
import { addMsgToDom } from "./utils/addMsgToDom";

const main = () => {
    return activeUsers.length > 0
}

const manageNotifs = (notif, type) => {
    addMsgToDom(notif, type, target = document.querySelector('.notifs'));
}

const handleMsg = () => {
    const msg = document.querySelector('#inputMsg').value
    console.log('[SENDING MESSAGE]')
    if (!main())
        connection.send({ msg, by: username, type: 'msg' })
    else {
        activeUsers.forEach(user => {
            user.conn.send({ msg, by: username, type: 'msg' })
        })
        addMsgToDom({ msg, by: username }, 'msg')
    }
    document.querySelector('#inputMsg').value = ''
}