import Application from './app/Application.js';
import UI from './app/UI.js';
import ActivityManager from './app/ActivityManager.js';
import Notification from "./app/items/Notification.js";


(async () => {
    const application = new Application();
    const ui = new UI();
    const activityManager = new ActivityManager(3000);

    activityManager.activityHook(ui.videoContainer, 'dblclick', () => ui.fullscreen());
    activityManager.activityHook(ui.volumeController, 'wheel', (event) => application.onWheelScrolling(event, ui));
    activityManager.activityHook(ui.videoContainer, 'wheel', (event) => application.onWheelScrolling(event, ui));

    await application.detectAvailableDevices();

    ui.applyAudioDevices(application.availableAudioDevices);
    ui.applyVideoDevices(application.availableVideoDevices);
    ui.applyVideoOptions(application.availableVideoOptions);
    ui.setVolume(application.volume)

    ui.closeButton.addEventListener('click', () => {
        window.close();
    });

    document.body.addEventListener('keydown', (event) => {
        if (event.key === 'F12') {
            const data = application.createScreenshot(ui);
            const date = new Date();

            const dateStr = date.toLocaleDateString().replaceAll('/', '-');
            const timeStr = date.toLocaleTimeString().replaceAll(':', '-');

            const filename = `screenshot-${dateStr}-${timeStr}.png`;

            cwa.send('save-screenshot', [filename, data]);
            const screenshot = new Notification('Screenshot saved', cwa.screenPath(filename));
            screenshot.show(ui.notifications, 6000);
        }
    }, {passive: true})

    await application.openAudioStream();
    await application.openVideoStream();

    window.cwa.application = application;
    window.cwa.ui = ui;
    window.cwa.activityManager = activityManager;
})();
