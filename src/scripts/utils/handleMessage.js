import { activeUsers, connection } from '../constants/constants';
import { usersCondition } from './usersCondition';
import { addMessageToDom } from './addMessageToDom';

export const handleMessage = () => {
    const message = document.querySelector('#inputMsg').value
    console.log('[SENDING MESSAGE]')

    if (!usersCondition()) {
        connection.send({ message, by: username, type: 'msg' })
    }
    else {
        activeUsers.forEach(user => {
            user.conn.send({ message, by: username, type: 'msg' })
        })
        addMessageToDom({ message, by: username }, 'message')
    }
    document.querySelector('#inputMsg').value = ''
}