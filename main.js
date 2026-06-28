const { app, BrowserWindow } = require('electron')
const path = require('path')

try {
  require('electron-reload')(__dirname, {
    electron: require('electron'),
    forceHardReset: true,
    hardResetMethod: 'exit',
  })
} catch(e) {}

function createWindow() {
  const win = new BrowserWindow({
    width: 340,
    height: 200,
    resizable: false,
    frame: false,
    transparent: true,
    hasShadow: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  app.quit()
})
