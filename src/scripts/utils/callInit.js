import { createEmptyVideoTrack } from './createEmptyVideoTrack';
import { otherUsername } from '../constants/constants';
import { callData } from './callData';
import { connectionData } from './connectionData';

export const callInit = async () => {
    try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        const videoStream = createEmptyVideoTrack({ width: 400, height: 400 })
        const mediaStream = new MediaStream([...audioStream.getAudioTracks(), videoStream])

        otherUsername = document.querySelector('#call').value

        // Call the peer for audio and video exchange
        const call = peer.call(otherUsername, mediaStream)
        console.log('[CALL INITIALISED]')
        callData(call)

        // Connect with the pear for data exchange
        const conn = peer.connect(otherUsername, { metadata: initPacket })
        connectionData(conn, 'slave')
    } catch (error) {
        alert(error)
    }
}