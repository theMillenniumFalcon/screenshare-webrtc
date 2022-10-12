export const createEmptyVideoTrack = ({ width, height }) => {
    const canvas = Object.assign(document.createElement('canvas'), { width, height })
    canvas.getContext('2d').fillRect(0, 0, width, height)

    const stream = canvas.captureStream()
    const track = stream.getVideoTracks()[0]

    return Object.assign(track, { enabled: false })
}