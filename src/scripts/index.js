import { peer } from './constants/constants';
import { peerID, initPacket } from './constants/constants';

peer.on('open', id => {
    let res = 'N'
    while (res === 'N') {
        username = prompt('Please enter your name to continue')
        if (username) {
            res = 'Y'
        }
    }
    peerID = id
    initPacket.peerID = peerID
    initPacket.username = username
    console.log('[INIT PACKET]', initPacket)
})

peer.on('call', async (call) => {
    console.log('[INCOMING CALL RECEIVED]')
    manageNotifs('Incoming call received', 'notifSuccess')
    call.answer(shareStream)
    call.on('error', err => {
        alert('[ERROR BEFORE RECEIVING]' + err)
    })
})

peer.on('connection', conn => {
    console.log('[CONNECTED SUCCESSFULLY]', conn.metadata)
    connectionData(conn, 'master')
    addMsgToDom(conn.metadata, 'connection')
})

peer.on('disconnected', () => peer.reconnect())

peer.on('error', (err) => {
    manageNotifs('Error while making connection', 'notifFail')
})