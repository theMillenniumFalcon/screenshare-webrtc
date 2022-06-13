const peer = new peer({
    config: {
        'iceServers': [{ url: 'stun:stun.l.google.com:19302' },
        { url: 'turn:numb.viagenie.ca', username: 'nishankpr2002@gmail.com', credential: 'test' }]
    }
})

let username = ''
let peerId = ''
let shareStream = ''
const activeUser = []
const vidUser = []
const colors = ['purple', 'blue', 'brown', 'magenta', 'yellow', 'gray', 'crimson']
const initpacket = {}
let connection

const isMaster = () => {
    return activeUser.length > 0
}

const addMsgtoDOM = (data, type, target = document.querySelector('.msgBox')) => {
    switch (type) {
        case 'msg':
            target.innerHTML += `<div class='msg'>${data.by}: ${data.msg}</div>`
            break

        case 'connection':
            target.innerHTML += `<div class='newConn'>${data.username} joined the session</div>`
            break

        case 'disconnection':
            target.innerHTML += `<div class='disConn'>${data.username} left the session</div>`
            break

        case 'notifSuccess':
            target.innerHTML = `<div class='notifSuccess'>${data}</div>`
            setTimeout(() => {
                target.innerHTML = ''
            }, 30000)
            break

        case 'notifFail':
            target.innerHTML = `<div class='notifFail'>${data}</div>`
            setTimeout(() => {
                target.innerHTML = ''
            }, 30000)
            break

        case 'remove':
            target.innerHTML += `<div class='listItems' onclick="disconnect('${data.username}')">${data.username}</div>`
            break

        case 'clear':
            target.innerHTML = data
            break

        default:
            break
    }
}

const manageNotifs = (notifs, type) => {
    addMsgtoDOM(notifs, type, target = document.querySelector('.notifs'))
}

const handleMsg = () => {
    const msg = document.querySelector('#inputMsg').value
    console.log('[SENDING MESSAGE]')
    if (!isMaster()) {
        connection.send({ msg, by: username, type: 'msg' })
    } else {
        activeUser.forEach((user) => {
            user.conn.send({ msg, by: username, type: 'msg' })
        })
        addMsgtoDOM({ msg, by: username }, 'msg')
    }
    document.querySelector('#inputMsg').value = ''
}

const createEmptyAudioTrack = () => {
    const ctx = new AudioContext()
    const oscillator = ctx.createOscillator()
    const dst = oscillator.connect(ctx.createMediaStreamDestination())
    oscillator.start()
    const track = dst.stream.getAudioTracks()[0]
    return Object.assign(track, { enabled: false })
}