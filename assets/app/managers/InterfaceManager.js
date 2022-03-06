import Components from '../UI.js';
import Notification from '../components/Notification.js';

export default class InterfaceManager {

    /**
     * @param {Application} application
     */
    constructor(application) {
        this.application = application;
        this.recorder = null;
        this.videoChunks = [];
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
        // noinspection JSUnresolvedVariable • Heh ? Idea u good ? This is an HTML Element...
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
            } else if (ev.key === 'F10') {
                if (this.isRecording()) {
                    this.stopRecording().then();
                } else {
                    this.startRecording().then();
                }
            }
        }, {passive: true});

        cwa.onScreenshotSaved(filename => {
            const screenshot = new Notification('Screenshot saved', filename);
            screenshot.show(Components.NotificationContainer, 6000).then();
        });

        cwa.onRecordingSaved(filename => {
            const screenshot = new Notification('Recording saved', filename);
            screenshot.show(Components.NotificationContainer, 6000).then();

            this.recorder = null;
            this.videoChunks = [];
        });
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

    /**
     * @param {KeyboardEvent} event
     */
    async takeScreenshot(event) {
        const data = this.createScreenshot();
        cwa.saveScreenshot(data);
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

    async startRecording() {
        const audioTrack = this.application.audioStream.getTracks()[0];
        const videoTrack = this.application.videoStream.getTracks()[0];
        const stream = new MediaStream([audioTrack, videoTrack]);
        this.recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});

        this.recorder.ondataavailable = (e) => {
            this.videoChunks.push(e.data);
        }

        this.recorder.onstop = () => {
            this.saveRecording().then();
        }

        this.recorder.start();
        const screenshot = new Notification('Started recording...', 'Press F10 again to stop.');
        await screenshot.show(Components.NotificationContainer, 6000);
    }

    async stopRecording() {
        this.recorder.stop();
        const screenshot = new Notification('Saving recording...', 'This might take a while.');
        await screenshot.show(Components.NotificationContainer, 6000);
    }

    async saveRecording() {
        const blob = new Blob(this.videoChunks, {type: 'video/webm'});
        const data = await blob.arrayBuffer()
        cwa.saveRecording(data);
    }

    isRecording() {
        return this.recorder != null;
    }

}
