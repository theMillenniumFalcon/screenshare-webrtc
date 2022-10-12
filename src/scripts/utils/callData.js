export const callData = (call) => {
    call.on('stream', stream => {
        console.log('[SUBMITTING DATA]', stream)
        document.querySelector('#v1').srcObject = stream
    })
    call.on('error', err => {
        alert('[ERROR WHILE RECEIVING]' + err)
    })
}