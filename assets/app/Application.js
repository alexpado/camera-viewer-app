import Device from './Device.js';

export default class Application {

    constructor() {

        this.videoOptions = {
            width: 1920,
            height: 1080,
            frameRate: 60,
            latency: 0.02
        }

        this.audioOptions = {
            noiseSuppression: false,
            echoCancellation: false,
            autoGainControl: false
        }

        this.activeAudioDevice = null;
        this.activeVideoDevice = null;

        this.availableAudioDevices = [];
        this.availableVideoDevices = [];

        this.videoStream = null;
        this.audioStream = null;

        this.audioContext = {
            context: null,
            gainControl: null,
            volume: 100
        }

        this.videoElement = document.querySelector('[data-tag="media"]')
    }

    get volume() {
        return this.audioContext.volume;
    }

    set volume(value) {

        if (value > 100) {
            value = 100;
        } else if (value < 0) {
            value = 0;
        }

        if (this.audioContext.gainControl) {
            this.audioContext.gainControl.gain.value = value / 100;
            this.audioContext.volume = value;
        }
    }

    async detectAvailableDevices() {

        const devices = await navigator.mediaDevices.enumerateDevices();

        const audioDevices = devices
            .filter(device => device.kind === 'audioinput')
            .filter(device => device.deviceId.length === 64)
            .map(device => new Device(this, device));

        const videoDevices = devices
            .filter(device => device.kind === 'videoinput')
            .filter(device => device.deviceId.length === 64)
            .map(device => new Device(this, device));

        this.availableAudioDevices = audioDevices;
        this.availableVideoDevices = videoDevices;

        if (this.activeAudioDevice == null) {
            this.activeAudioDevice = this.availableAudioDevices[0].id;
        }

        if (this.activeVideoDevice == null) {
            this.activeVideoDevice = this.availableVideoDevices[0].id;
        }

        this.refreshDeviceStatus();
    }

    refreshDeviceStatus() {

        this.availableVideoDevices.forEach(device => {
            device.enabled = device.id === this.activeVideoDevice;
        });

        this.availableAudioDevices.forEach(device => {
            device.enabled = device.id === this.activeAudioDevice;
        });
    }

    async switchAudioSource(deviceId) {
        this.activeAudioDevice = deviceId;
        this.refreshDeviceStatus();
        await this.openAudioStream()
    }

    async switchVideoSource(deviceId) {
        this.activeVideoDevice = deviceId;
        this.refreshDeviceStatus();
        await this.openVideoStream();
    }

    stopAudioStream() {
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => {
                track.stop();
            });
        }
        this.audioStream = null;
    }

    stopVideoStream() {
        if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => {
                track.stop();
            });
        }
        this.videoStream = null;
    }

    async openVideoStream() {
        this.stopVideoStream();

        if (this.activeVideoDevice) {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: this.activeVideoDevice,
                    ...this.videoOptions
                }
            });

            this.videoStream = stream;
            this.videoElement.srcObject = stream;
            this.videoElement.autoplay = true;
        }
    }

    async openAudioStream() {
        this.stopAudioStream();

        if (this.activeAudioDevice) {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: this.activeAudioDevice,
                    ...this.audioOptions
                }
            });

            this.audioContext.context = new AudioContext();
            this.audioContext.gainControl = this.audioContext.context.createGain();
            const source = this.audioContext.context.createMediaStreamSource(stream);
            source.connect(this.audioContext.gainControl);
            this.audioContext.gainControl.connect(this.audioContext.context.destination);
            this.volume = 0;
        }
    }

    /**
     * @param event
     * @param {UI} ui
     */
    onWheelScrolling(event, ui) {
        const delta = event.deltaY / -20;
        this.volume = this.volume + delta;
        ui.setVolume(this.volume);
    }
}
