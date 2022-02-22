const {contextBridge, ipcRenderer} = require('electron');
const path = require("path");

contextBridge.exposeInMainWorld('cwa', {
    send: (channel, ...data) => {
        ipcRenderer.send(channel, ...data);
    },
    screenPath: (filename) => {
        const homedir = require('os').homedir();
        return path.join(homedir, 'cwa', 'screenshots', filename);
    }
})
