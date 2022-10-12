import { manageNotifs } from './manageNotifs';
import { activeUsers } from '../constants/constants';
import { usersCondition } from './usersCondition';
import { addMsgToDom } from './addMsgToDom';

export const connectionData = (conn, type) => {
    conn.on('open', () => {
        console.log('Connection for data exchange successfully established', conn.metadata)
        manageNotifs('Succesfully Connected', 'notifSuccess')
        if (type === 'master') {
            activeUsers.push({ ...conn.metadata, conn })
            console.log('[ACTIVE USERS]', activeUsers)
            activeUsers.forEach(user => {
                console.log('[SENDING CONNECTION DATA]')
                user.conn.send({ ...conn.metadata, type: 'connection' })
            })
            document.querySelector('.join').classList.add('hide')
        }
        else {
            document.querySelector('.shareScreen').classList.add('hide')
            document.querySelector('.join .greet').classList.add('hide')
        }
        connection = conn
    })

    conn.on('data', (data) => {
        console.log('RECEIVED DATA', data)
        if (data.type === 'msg') {
            addMsgToDom(data, 'msg')
        } else if (data.type === 'connection') {
            addMsgToDom(data, 'connection')
        } else if (data.type === 'disconnection') {
            addMsgToDom(data, 'disconnection')
        }
        if (usersCondition())
            activeUsers.forEach(user => {
                user.conn.send(data)
            })
    })

    conn.on('close', () => {
        addMsgToDom(conn.metadata, 'disconnection')
        activeUsers.forEach(user => {
            user.conn.send({ ...conn.metadata, type: 'disconnection' })
        })
    })
}