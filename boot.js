const {app, BrowserWindow, ipcMain} = require('electron')
require('electron-reload')(__dirname)

const ratio = 16 / 9;
const size = 720;
const titlebar = 28;

const createWindow = () => {
    const win = new BrowserWindow({
        width: Math.floor(size * ratio),
        height: size + titlebar,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            worldSafeExecuteJavaScript: true
        }
    });

    win.loadFile('index.html').then();
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('close', () => {
    app.exit(0);
})
