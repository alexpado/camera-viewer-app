import DeviceManager    from './managers/DeviceManager.js';
import ActivityManager  from './managers/ActivityManager.js';
import InterfaceManager from './managers/InterfaceManager.js';
import UI               from './UI.js';
import GameManager      from './managers/GameManager.js';

export default class Application {

    constructor() {

        this.deviceManager    = new DeviceManager(this);
        this.interfaceManager = new InterfaceManager(this);
        this.gameManager      = new GameManager(this);
        this.activity         = new ActivityManager(3000);

        this.audioOptions = {
            noiseSuppression: false,
            echoCancellation: false,
            autoGainControl:  false,
        };

        this.videoStream = null;
        this.audioStream = null;

        this.audioContext = {
            context:     null,
            gainControl: null,
            volume:      parseInt(localStorage.getItem('volume') ?? 100),
        };

    }

    /**
     * @return {number}
     */
    get volume() {
        return this.audioContext.volume;
    }

    /**
     * @param {number} value
     */
    set volume(value) {

        const clampedVolume = Math.max(0, Math.min(100, value));
        const volumeStr     = `${clampedVolume}`;

        if (this.audioContext.gainControl) {
            this.audioContext.gainControl.gain.value = value / 100;
            this.audioContext.volume                 = value;
            localStorage.setItem('volume', volumeStr);
        }
    }

    /**
     * @return {Promise<void>}
     */
    async init() {
        this.interfaceManager.init();
        this.interfaceManager.volume = this.volume;

        await this.deviceManager.scan();
        await this.deviceManager.applyDefault();
        await this.deviceManager.updateStates();

        this.interfaceManager.videoDevices = this.deviceManager.available.videoDevices;
        this.interfaceManager.audioDevices = this.deviceManager.available.audioDevices;
        this.interfaceManager.videoOptions = this.deviceManager.available.videoOptions;
        this.interfaceManager.games        = this.gameManager.games;
    }

    stopAudioStream() {
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => {
                track.stop();
            });
        }
        this.audioStream = null;

        if (this.audioContext.context) {
            this.audioContext.context.close();
            this.audioContext.context = null;
        }
    }

    stopVideoStream() {
        if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => {
                track.stop();
            });
        }
        this.videoStream = null;
    }

    /**
     * @return {Promise<void>}
     */
    async openVideoStream() {
        this.stopVideoStream();

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId:  this.deviceManager.activeVideoDevice.id,
                latency:   0.02,
                width:     this.deviceManager.activeVideoOption.width,
                height:    this.deviceManager.activeVideoOption.height,
                frameRate: this.deviceManager.activeVideoOption.fps,
            },
        });

        this.videoStream         = stream;
        UI.VideoPlayer.srcObject = stream;
        UI.VideoPlayer.autoplay  = true;
    }

    /**
     * @return {Promise<void>}
     */
    async openAudioStream() {
        this.stopAudioStream();

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: this.deviceManager.activeAudioDevice.id,
                ...this.audioOptions,
            },
        });

        this.audioStream              = stream;
        this.audioContext.context     = new AudioContext();
        this.audioContext.gainControl = this.audioContext.context.createGain();
        const source                  = this.audioContext.context.createMediaStreamSource(stream);
        source.connect(this.audioContext.gainControl);
        this.audioContext.gainControl.connect(this.audioContext.context.destination);
        this.volume = parseInt(localStorage.getItem('volume') ?? 100);
    }
}
