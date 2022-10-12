export const addMessageToDom = (data, type, target = document.querySelector('.msgBox')) => {
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
            target.innerHTML = `<div class='notifSuccess'>${data}</div>`
            setTimeout(() => {
                target.innerHTML = ''
            }, 30000)
            break
        default:
            break
    }
}