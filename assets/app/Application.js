import Device from './items/Device.js';
import Resolution from "./items/Resolution.js";

export default class Application {

    constructor() {

        this.audioOptions = {
            noiseSuppression: false,
            echoCancellation: false,
            autoGainControl: false
        }

        this.activeAudioDevice = null;
        this.activeVideoDevice = null;
        this.activeVideoOption = null;

        this.availableAudioDevices = [];
        this.availableVideoDevices = [];
        this.availableVideoOptions = [];

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

        const videoOptions = [
            new Resolution(this, 1920, 1080, 60),
            new Resolution(this, 1920, 1080, 30),
            new Resolution(this, 1280, 720, 60),
            new Resolution(this, 1280, 720, 30)
        ]

        this.availableAudioDevices = audioDevices;
        this.availableVideoDevices = videoDevices;
        this.availableVideoOptions = videoOptions;

        const lastAudioDevice = localStorage.getItem('lastAudioDevice');
        const lastVideoDevice = localStorage.getItem('lastVideoDevice');
        const lastVideoOption = localStorage.getItem('lastVideoOption');

        // Check if our device is still here
        const audioDeviceStillPresent = audioDevices.filter(device => device.id === this.activeAudioDevice).length === 1;
        const videoDeviceStillPresent = videoDevices.filter(device => device.id === this.activeVideoDevice).length === 1;
        const videoOptionStillPresent = videoOptions.filter(option => option.id === this.activeVideoOption).length === 1;

        const lastAudioDeviceAvailable = audioDevices.filter(device => device.id === lastAudioDevice).length === 1;
        const lastVideoDeviceAvailable = videoDevices.filter(device => device.id === lastVideoDevice).length === 1;
        const lastVideoOptionAvailable = videoOptions.filter(option => option.id === lastVideoOption).length === 1;


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

        if (!videoOptionStillPresent) {
            if (lastVideoOptionAvailable) {
                console.log(`Application: Using last known video option (ID: ${lastVideoOption})`);
                this.activeVideoOption = lastVideoOption;
            } else if (videoOptions.length > 0) {
                console.log(`Application: Using default video option (ID: ${videoOptions[0].id})`);
                this.activeVideoOption = videoOptions[0].id;
            } else {
                alert('No video option available.');
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

        this.availableVideoOptions.forEach(res => {
            res.enabled = res.id === this.activeVideoOption
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

    async switchVideoResolution(resolution) {
        this.activeVideoOption = resolution;
        localStorage.setItem('lastVideoOption', resolution);
        this.refreshDeviceStatus()
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
            const videoOption = this.availableVideoOptions.filter(option => option.id === this.activeVideoOption)[0];

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: this.activeVideoDevice,
                    latency: 0.02,
                    width: videoOption.width,
                    height: videoOption.height,
                    frameRate: videoOption.fps
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

    /**
     * @param {UI} ui
     */
    createScreenshot(ui) {
        const videoOption = this.availableVideoOptions.filter(option => option.id === this.activeVideoOption)[0];
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = videoOption.width;
        canvas.height = videoOption.height;

        context.drawImage(ui.videoPlayer, 0, 0, videoOption.width, videoOption.height);
        return canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, "");
    }
}
