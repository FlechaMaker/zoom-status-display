let ws
const audioMuteIcon = $('#audio-mute-icon')
const audioUnmuteIcon = $('#audio-unmute-icon')
const videoMuteIcon = $('#video-mute-icon')
const videoUnmuteIcon = $('#video-unmute-icon')
const statusWrapper = $('#status')
const config = $('#config')
audioMuteIcon.hide()
audioUnmuteIcon.hide()
videoMuteIcon.hide()
videoUnmuteIcon.hide()

const noSleep = new NoSleep()

// Open config modal initially
$('#config-open').modaal({ 
    content_source: '#config'
})
$('#config-open').modaal('open')
$('#info-open').modaal({
    content_source: '#info'
})

$('#connect-btn').click(() => {
    $('#config-open').modaal('close')
    audioMuteIcon.show()
    videoMuteIcon.show()

    let serverIP = $('#server-ip').val()
    console.log(serverIP)
    ws = new WebSocket(`ws:${serverIP}:31497`)

    ws.addEventListener('open', (e) => {
        console.log('ws opened')
    })

    ws.addEventListener('message', (e) => {
        const audioStatus = $('#audio-status')
        const videoStatus = $('#video-status')
        console.log(e.data)
        let status = JSON.parse(e.data)
        if (status["audio"] == "Muted") {
            audioMuteIcon.show()
            audioUnmuteIcon.hide()
            audioStatus.css('background-color', 'lightgray')
        } else if (status["audio"] == "Unmuted") {
            audioMuteIcon.hide()
            audioUnmuteIcon.show()
            audioStatus.css('background-color', 'tomato')
        }
        if (status["video"] == "Muted") {
            videoMuteIcon.show()
            videoUnmuteIcon.hide()
            videoStatus.css('background-color', 'lightgray')
        } else if (status["video"] == "Unmuted") {
            videoMuteIcon.hide()
            videoUnmuteIcon.show()
            videoStatus.css('background-color', 'tomato')
        }
    })

    noSleep.enable();
})

