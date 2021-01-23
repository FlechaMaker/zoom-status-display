const { app, ipcMain } = require('electron')
const { menubar } = require('menubar')
const { execSync } = require('child_process')
const WebSocket = require('ws')

const appPath = app.getAppPath()
ipcMain.on('getAppPath', (event) => {
  event.returnValue = appPath
})

const mb = new menubar({
  index: `file://${appPath}/src/index.html`,
  preloadWindow: true,
  icon: `${appPath}/src/IconTemplate.png`,
  browserWindow: {
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: true
    }
  }
})

mb.on('ready', () => {
  app.setAccessibilitySupportEnabled(true)
  execSync(`osascript "${appPath}/src/zoom-mute-status.scpt"`)
})

mb.on('after-hide', () => { 
  mb.app.hide()
  app.dock.hide()
})

ipcMain.on('quit', (event, arg) => {
  clearInterval(intervalID)
  console.log('app will quit')
  app.quit()
})

const wss = new WebSocket.Server({ port: 31497 });
let ws;
let wsConnected = false;

wss.on('connection', (ws_) => {
  ws = ws_
  ws.on('message', (message) => {
    console.log(`received: ${message}`)
  })
  wsConnected = true;
  mb.window.webContents.send('status-check', true)
})

ipcMain.on('status-changed', (event, zoomStatus) => {
  if (wsConnected) {
    ws.send(JSON.stringify(zoomStatus))
  }
})

let intervalID = setInterval(() => {
  mb.window.webContents.send('status-check', false)
}, 500)

// serve client web page
const nodeStatic = require('node-static')
const { request } = require('http')
const clientFile = new nodeStatic.Server(`${appPath}/src/client`)

require('http').createServer((request, response) => {
  request.addListener('end', () => {
    switch(request.method) {
      case 'GET':
        clientFile.serve(request, response)
        break
    }
  }).resume()
}).listen(31496, "0.0.0.0")