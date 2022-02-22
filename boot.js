const {app, BrowserWindow, ipcMain} = require('electron')
const path = require("path");
const fs = require('fs');
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
            worldSafeExecuteJavaScript: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html').then();
}

ipcMain.on('save-screenshot', (event, [filename, data]) => {

    const homedir = require('os').homedir();
    const screenshot = path.join(homedir, 'cwa', 'screenshots');

    console.log(`[SCREENSHOT] Saving new screenshot into ${screenshot}...`)

    if (!fs.existsSync(screenshot)) {
        console.log('[SCREENSHOT] Creating directory...')
        fs.mkdirSync(screenshot, {recursive: true})
    }
    const file = path.join(screenshot, filename);
    console.log('[SCREENSHOT] Saving ' + file);

    fs.writeFile(file, data, 'base64', function (err) {
        console.error(err);
    });
})

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
