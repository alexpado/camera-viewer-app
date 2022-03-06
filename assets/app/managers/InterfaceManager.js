import Components from '../UI.js';
import Notification from '../components/Notification.js';

export default class InterfaceManager {

    /**
     * @param {Application} application
     */
    constructor(application) {
        this.application = application;
    }

    /**
     * @param {AudioDevice[]}devices
     */
    set audioDevices(devices) {
        Components.AudioDevicesContainer.innerHTML = '';
        devices.forEach(device => Components.AudioDevicesContainer.appendChild(device.component));
    }

    /**
     * @param {VideoDevice[]} devices
     */
    set videoDevices(devices) {
        Components.VideoDevicesContainer.innerHTML = '';
        devices.forEach(device => Components.VideoDevicesContainer.appendChild(device.component));
    }

    /**
     * @param {VideoResolution[]} options
     */
    set videoOptions(options) {
        Components.VideoOptionsContainer.innerHTML = '';
        options.forEach(option => Components.VideoOptionsContainer.appendChild(option.component));
    }

    /**
     * @param {number} value
     */
    set volume(value) {
        Components.VolumeFeedback.style.height = `${this.application.volume}%`;
    }

    init() {
        this.registerHooks();
        this.registerListeners();
    }

    registerHooks() {
        this.application.activity.addHook(Components.VideoContainer, 'dblclick', () => this.fullscreen());
        this.application.activity.addHook(Components.VideoContainer, 'wheel', (ev) => this.onWheelScrolling(ev));
        this.application.activity.addHook(Components.VolumeController, 'wheel', (ev) => this.onWheelScrolling(ev));
    }

    registerListeners() {

        Components.CloseButton.addEventListener('click', () => window.close());
        document.body.addEventListener('keydown', (ev) => {
            if (ev.key === 'F12') {
                this.takeScreenshot(ev).then()
            }
        }, {passive: true})
    }

    /**
     * @param {WheelEvent} event
     */
    onWheelScrolling(event) {
        const delta = event.deltaY / -20;
        this.application.volume = this.application.volume + delta;
        this.volume = this.application.volume;
    }

    fullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then();
            document.body.classList.add('fullscreen');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then();
                document.body.classList.remove('fullscreen');
            }
        }
    }

    createFilename() {
        const date = new Date();

        const dateStr = date.toLocaleDateString().replaceAll('/', '-');
        const timeStr = date.toLocaleTimeString().replaceAll(':', '-');

        return `screenshot-${dateStr}-${timeStr}.png`;
    }

    /**
     * @param {KeyboardEvent} event
     */
    async takeScreenshot(event) {
        const data = this.createScreenshot();
        const filename = this.createFilename();
        cwa.send('save-screenshot', [filename, data]);
        const screenshot = new Notification('Screenshot saved', cwa.screenPath(filename));
        await screenshot.show(Components.NotificationContainer, 6000);
    }

    createScreenshot() {
        const videoOption = this.application.deviceManager.activeVideoOption;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = videoOption.width;
        canvas.height = videoOption.height;

        context.drawImage(Components.VideoPlayer, 0, 0, videoOption.width, videoOption.height);
        return canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, "");
    }

}
