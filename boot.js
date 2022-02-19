const {app, BrowserWindow} = require('electron')
require('electron-reload')(__dirname)

const ratio = 16 / 9;
const size = 720;

const createWindow = () => {
    const win = new BrowserWindow({
        width: size * ratio,
        height: size,
        frame: false,
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
