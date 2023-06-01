require('electron-reload')(__dirname);

const {ipcMain, app} = require('electron');
const Store     = require('electron-store');
const Window    = require('./lib/Window');
const Discord   = require('./lib/Discord');
const Disk      = require('./lib/Disk');

const store = new Store();

if (!store.has('discord.clientId') || store.get('discord.clientId', null) == null) {
    store.set('discord.enabled', false);
    store.set('discord.clientId', null)
}

console.log(' === Welcome to CWA !');
console.log("Application Folder: ", app.getPath('userData'));
console.log(" ===");
console.log();


(async () => {
    console.log(' > Starting app...');
    await Window.start();

    if (store.get('discord.enabled', true) && store.get('discord.clientId')) {
        console.log(' > Login in to Discord...');
        await Discord.login(store.get('discord.clientId'));
    }

    console.log(' > Registering IPC Events...');

    ipcMain.on('save:screenshot', (event, data) => {
        console.log('[IPC] save:screenshot');
        Disk.saveScreenshot(data)
            .then((r) => event.sender.send('saved:screenshot', r))
            .catch(() => event.sender.send('failed:screenshot'));
    });

    ipcMain.on('save:recording', (event, data) => {
        console.log('[IPC] save:recording');
        Disk.saveRecording(data)
            .then((r) => event.sender.send('saved:recording', r))
            .catch(() => event.sender.send('failed:recording'));
    });

    ipcMain.on('activity:change', (event, data) => {
        console.log('[IPC] activity:change');
        Discord.setActivity(data).then(() => event.sender.send('activity:changed', data));
    });

    console.log(' > Opening window...');
    await Window.createWindow();
    console.log('The application is now ready.');
    console.log();
})();
