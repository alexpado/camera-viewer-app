const {app, BrowserWindow, ipcMain} = require('electron')
const path = require("path");
const fs = require('fs');
require('electron-reload')(__dirname)

const CWA = {
    AppDir: {
        SCREENSHOTS: 'screenshots',
        RECORDINGS: 'recordings'
    },
    Size: {
        RATIO: 16 / 9,
        HEIGHT: 720,
        TITLE_BAR: 28
    }
}

// <editor-fold desc="Electron Specific">

const createWindow = () => {
    const win = new BrowserWindow({
        width: Math.floor(CWA.Size.HEIGHT * CWA.Size.RATIO),
        height: CWA.Size.HEIGHT + CWA.Size.TITLE_BAR,
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

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

// </editor-fold>

// <editor-fold desc="App Specific">

const createFilename = (type, ext) => {
    const date = new Date();

    const dateStr = date.toLocaleDateString().replaceAll('/', '-');
    const timeStr = date.toLocaleTimeString().replaceAll(':', '-');

    return `${type}-${dateStr}-${timeStr}.${ext}`;
}

const getApplicationDirectory = (dir) => {
    const homedir = require('os').homedir();
    return path.join(homedir, 'cwa', dir);
}

ipcMain.on('save:screenshot', (event, data) => {

    const directory = getApplicationDirectory(CWA.AppDir.SCREENSHOTS);
    const filename = createFilename('screenshot', 'png');

    console.log(`[SCREENSHOT] Saving new screenshot into ${directory}...`)

    if (!fs.existsSync(directory)) {
        console.log('[SCREENSHOT] Creating directory...')
        fs.mkdirSync(directory, {recursive: true})
    }

    const file = path.join(directory, filename);
    console.log('[SCREENSHOT] Saving ' + file);

    fs.writeFile(file, data, 'base64', function (err) {
        if (err) {
            console.error('An error occurred when saving screenshot:', err);
            event.sender.send('failed:screenshot')
        }
        event.sender.send('saved:screenshot', file);
    });
});

ipcMain.on('save:recording', (event, data) => {

    const directory = getApplicationDirectory(CWA.AppDir.RECORDINGS);
    const filename = createFilename('recording', 'webm');

    console.log(`[RECORDING] Saving new recording into ${directory}...`)

    if (!fs.existsSync(directory)) {
        console.log('[RECORDING] Creating directory...')
        fs.mkdirSync(directory, {recursive: true})
    }
    const file = path.join(directory, filename);
    console.log('[RECORDING] Saving ' + file);

    const buffer = Buffer.from(data);
    fs.writeFile(file, buffer, function (err) {
        if (err) {
            console.error('An error occurred when saving recording:', err);
            event.sender.send('failed:recording')
        }
        event.sender.send('saved:recording', file);
    });
})
// </editor-fold>
