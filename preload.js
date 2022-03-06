const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('cwa', {
    saveScreenshot: (data) => {
        ipcRenderer.send('save:screenshot', data);
    },
    saveRecording: (data) => {
        ipcRenderer.send('save:recording', data);
    },
    send: (channel, ...data) => {
        ipcRenderer.send(channel, ...data);
    },
    onScreenshotSaved: (func) => {
        ipcRenderer.on('saved:screenshot', (event, filename) => {
            func(filename);
        })
    },
    onRecordingSaved: (func) => {
        ipcRenderer.on('saved:recording', (event, filename) => {
            func(filename);
        })
    }
})
