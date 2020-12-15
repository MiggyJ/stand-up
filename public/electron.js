const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron')
const { ipcMain } = require('electron/main')

let mainWindow
let mainTray

const createWindow = () => {
    // Main Window
    mainWindow = new BrowserWindow({
        width:          800,
        height:         600,
        resizable:      false,
        webPreferences: { nodeIntegration: true },
        icon:           nativeImage.createFromPath(__dirname + '/asset/timer.png'),
        frame:          false
    })

    mainWindow.loadURL(__dirname + '/index.html')
    mainWindow.setMenu(null)

    mainWindow.on('close', (e) => {
        e.sender.hide()
        e.preventDefault()
    })

    // Main Tray
    mainTray = new Tray(nativeImage.createFromPath(__dirname + '/asset/timer.png'))
    mainTray.setToolTip('Stand Up!')

    let contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open',
            click: () => mainWindow.show()
        },
        { type: 'separator' },
        { role: 'quit' }
    ])
    mainTray.setContextMenu(contextMenu)
    mainTray.on('click', () => mainWindow.show())
}

app.setLoginItemSettings({
    openAtLogin: true
})

app.on('ready', createWindow)

app.on('before-quit', () => {
    mainWindow.removeAllListeners('close')
    mainWindow    = null
    mainTray      = null
})

// EVENTS
ipcMain.on('QUIT_APP', () => app.quit())

ipcMain.on('HIDE_APP', () => mainWindow.close())

ipcMain.on('TIME_UP', () => mainWindow.show())