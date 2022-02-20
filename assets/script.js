import Application from './app/Application.js';
import UI from './app/UI.js';
import ActivityManager from './app/ActivityManager.js';

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
    ui.setVolume(application.volume)

    ui.closeButton.addEventListener('click', () => {
        window.close();
    })

    await application.openAudioStream();
    await application.openVideoStream();

    window.application = application;
    window.ui = ui;
    window.activityManager = activityManager;
})();
