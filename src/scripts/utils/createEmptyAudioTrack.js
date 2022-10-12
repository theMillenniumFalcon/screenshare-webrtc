export const createEmptyAudioTrack = () => {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()

    const dst = oscillator.connect(audioContext.createMediaStreamDestination())
    oscillator.start()

    const track = dst.stream.getAudioTracks()[0]
    return Object.assign(track, { enabled: false })
}