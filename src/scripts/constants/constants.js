export const peer = new Peer({
    config: {
        'iceServers': [{ url: 'stun:stun.l.google.com:19302' },
        { url: 'turn:numb.viagenie.ca', username: 'nishankpr2002@gmail.com', credential: 'test' }]
    }
})

export let username = ''
export let otherUsername = ''
export let peerID = ''
export let shareStream = ''
export let activeUsers = []
export const initPacket = []
export let connection