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
const initPacket = {}
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

const createEmptyVideoTrack = ({ width, height }) => {
    const canvas = Object.assign(document.createElement('canvas'), { width, height })
    canvas.getContext('2d').fillRect(0, 0, width, height)

    const stream = canvas.captureStream()
    const track = stream.getVideoTracks()[0]

    return Object.assign(track, { enabled: false })
}

const callData = call => {
    call.on('stream', stream => {
        console.log('[SUBMITTING DATA]', stream)
        document.querySelector('#v1').srcObject = stream
    })
    call.on('error', err => {
        alert('[ERROR WHILE RECEIVING]' + err)
    })
}

const connectionData = (conn, type) => {
    conn.on('open', () => {
        console.log('Connection for data exchange successfully established', conn.metadata)
        manageNotifs('Succesfully Connected', 'notifSuccess')
        if (type === 'master') {
            activeUser.push({ ...conn.metadata, conn, color: colors[activeUser.length] })
            console.log('[ACTIVE USERS]', activeUser)
            activeUser.forEach(user => {
                console.log('[SENDING CONNECTION DATA]')
                user.conn.send({ ...conn.metadata, type: 'connection' })
            })
            document.querySelector('.join').classList.add('hide')
            document.querySelector('.share').classList.add('hide')
            document.getElementById('v1').classList.add('hide')
            document.querySelector('.activeUser').classList.remove('hide')
        }
        else {
            document.querySelector('.shareScreen').classList.add('hide')
            document.querySelector('.join .greet').classList.add('hide')
        }
        connection = conn
    })
    conn.on('data', data => {
        console.log('RECEIVED DATA', data)
        if (data.type === 'msg')
            addMsgtoDOM(data, 'msg')
        else if (data.type === 'connection')
            addMsgtoDOM(data, 'connection')
        else if (data.type === 'disconnection')
            addMsgtoDOM(data, 'disconnection')
        if (isMaster())
            activeUser.forEach(user => {
                user.conn.send(data)
            })
    })
    conn.on('close', () => {
        addMsgtoDOM(conn.metadata, 'disconnection')
        activeUser.forEach(user => {
            user.conn.send({ ...conn.metadata, type: 'disconnection' })
        })
    })
}

const callInit = async () => {
    try {
        const audioStream = createEmptyAudioTrack()
        //const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const videoStream = createEmptyVideoTrack({ width: 400, height: 400 })
        const mediaStream = new MediaStream([audioStream, videoStream])
        otherUsername = document.querySelector('#call').value
        // Connect with the pear for data exchange
        const conn = peer.connect(otherUsername, { metadata: initPacket })
        connectionData(conn, 'slave')

        // Call the pear for audio and video exchange
        const call = peer.call(otherUsername, mediaStream)
        console.log('[CALL INITIALISED]')
        callData(call)
    } catch (error) {
        alert(error)
    }
}

const share = async () => {
    try {
        const onError = () => {
            // alert('Incompatible browser detected');
            manageNotifs('Incompatible browser detected', 'notifFail')
        }

        if (navigator.mediaDevices.getDisplayMedia) {
            const videosStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                const mediaStream = new MediaStream([...videosStream.getVideoTracks(), ...audioStream.getAudioTracks()])
                shareStream = mediaStream
            } catch (error) {
                manageNotifs('Audio source not found or denied', 'notifFail')
                const audioTrack = createEmptyAudioTrack()
                const mediaStream = new MediaStream([...videosStream.getVideoTracks(), audioTrack])
                shareStream = mediaStream
            }
            document.querySelector('#id').innerHTML = 'Share this ID: ' + peerId
        } else {
            onError()
        }
    } catch (error) {
        alert('[ERROR FROM TRY]' + error)
    }
}

const search = event => {
    console.log(event.target.value)
    addMsgToDom('', 'clear', document.querySelector('.list'))
    const str = event.target.value
    if (str) {
        const result = activeUser.filter(el => {
            return el.username.startsWith(str)
        })
        console.log(result)
        result.forEach(el => {
            addMsgtoDOM(el, 'remove', document.querySelector('.list'))
        })
    }
}

const disconnect = user => {
    console.log(user)
    activeUser.forEach(el => {
        if (el.username === user) {
            el.conn.close()
            vidUser.forEach(vid => {
                if (vid.peerID === el.peerID)
                    vid.call.close()
            })
        }
    })
}

const listenEnter = event => {
    if (event.keyCode === 13)
        handleMsg()
}