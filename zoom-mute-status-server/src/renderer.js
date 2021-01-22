const { ipcRenderer } = require('electron')
const { execSync } = require('child_process')
const ip = require('ip')

// get appPath from main
let appPath = ipcRenderer.sendSync('getAppPath')

// display server's ip address
document.getElementById("ip-addr").innerText = ip.address()

document.getElementById('quit-btn').addEventListener('click', () => {
    ipcRenderer.send('quit')
})

let audioStatus, videoStatus;

// main.js send status-check periodically
ipcRenderer.on('status-check', () => {
    let ret = execSync(`osascript "${appPath}/src/zoom-mute-status.scpt"`)
    let zoomStatus = JSON.parse(ret.toString())

    if (audioStatus != zoomStatus["audio"] || videoStatus != zoomStatus["video"]) {
        let audioStatusText = document.getElementById("audio-status")
        audioStatusText.innerText = zoomStatus["audio"]
        let videoStatusText = document.getElementById("video-status")
        videoStatusText.innerText = zoomStatus["video"]
        
        audioStatus = zoomStatus["audio"]
        videoStatus = zoomStatus["video"]

        ipcRenderer.send('status-changed', zoomStatus)
    }
})

