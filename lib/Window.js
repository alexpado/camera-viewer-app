const {
          app,
          BrowserWindow,
      }    = require('electron');
const path = require('path');

module.exports = {
    /**
     * @return {Promise<Electron.CrossProcessExports.BrowserWindow>}
     */
    createWindow: async () => {
        const window = new BrowserWindow({
            width:          1280,
            height:         748,
            frame:          false,
            webPreferences: {
                nodeIntegration:  false,
                contextIsolation: true,
                preload:          path.join(__dirname, '../preload.js'),
            },
        });

        await window.loadFile('index.html');
        return window;
    },

    start: async () => {

        await app.whenReady();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        })
    },
};
