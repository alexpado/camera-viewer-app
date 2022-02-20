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
            volume: parseInt(localStorage.getItem('volume') ?? 100)
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
            localStorage.setItem('volume', value);
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

        const lastAudioDevice = localStorage.getItem('lastAudioDevice');
        const lastVideoDevice = localStorage.getItem('lastVideoDevice');

        // Check if our device is still here
        const audioDeviceStillPresent = audioDevices.filter(device => device.id === this.activeAudioDevice).length === 1;
        const videoDeviceStillPresent = videoDevices.filter(device => device.id === this.activeVideoDevice).length === 1;

        const lastAudioDeviceAvailable = audioDevices.filter(device => device.id === lastAudioDevice).length === 1;
        const lastVideoDeviceAvailable = videoDevices.filter(device => device.id === lastVideoDevice).length === 1;


        if (!audioDeviceStillPresent) {
            if (lastAudioDeviceAvailable) {
                console.log(`Application: Using last known audio device (ID: ${lastAudioDevice})`);
                this.activeAudioDevice = lastAudioDevice;
            } else if (audioDevices.length > 0) {
                console.log(`Application: Using default audio device (ID: ${audioDevices[0].id})`);
                this.activeAudioDevice = audioDevices[0].id;
            } else {
                alert('No audio device available.');
            }
        }

        if (!videoDeviceStillPresent) {
            if (lastVideoDeviceAvailable) {
                console.log(`Application: Using last known video device (ID: ${lastVideoDevice})`);
                this.activeVideoDevice = lastVideoDevice;
            } else if (videoDevices.length > 0) {
                console.log(`Application: Using default video device (ID: ${videoDevices[0].id})`);
                this.activeVideoDevice = videoDevices[0].id;
            } else {
                alert('No video device available.');
            }
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
        localStorage.setItem('lastAudioDevice', deviceId);
        this.refreshDeviceStatus();
        await this.openAudioStream()
    }

    async switchVideoSource(deviceId) {
        this.activeVideoDevice = deviceId;
        localStorage.setItem('lastVideoDevice', deviceId);
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
            this.volume = parseInt(localStorage.getItem('volume') ?? 100);
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
