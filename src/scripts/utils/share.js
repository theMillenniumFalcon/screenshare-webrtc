import { manageNotifs } from './manageNotifs';

export const share = async () => {
    try {
        const onError = () => {
            manageNotifs('Incomaptible browser detected', 'notifFail')
        }

        if (navigator.mediaDevices.getDisplayMedia) {
            const videosStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
            const mediaStream = new MediaStream([...videosStream.getVideoTracks(), ...audioStream.getAudioTracks()])
            shareStream = mediaStream
            document.querySelector('#id').innerHTML = 'Share this ID: ' + peerID
        } else {
            onError()
        }
    } catch (error) {
        alert('[ERROR FROM TRY]' + error)
    }
}