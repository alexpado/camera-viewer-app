import AudioDevice from '../components/AudioDevice.js';
import VideoDevice from '../components/VideoDevice.js';
import VideoResolution from '../components/VideoResolution.js';

// noinspection SpellCheckingInspection
const DeviceType = {
    AUDIO: 'audioinput',
    VIDEO: 'videoinput'
}

export default class DeviceManager {

    constructor(application) {

        this.application = application;

        /**
         * @type {{videoDevices: VideoDevice[], videoOptions: VideoResolution[], audioDevices: AudioDevice[]}}
         */
        this.available = {
            audioDevices: [],
            videoDevices: [],
            videoOptions: []
        }

        /**
         * @type {{audioDevice: string, videoDevice: string, videoOption: string}}
         */
        this.activeID = {
            audioDevice: localStorage.getItem('lastAudioDevice'),
            videoDevice: localStorage.getItem('lastVideoDevice'),
            videoOption: localStorage.getItem('lastVideoOption'),
        }
    }

    /**
     * @return {AudioDevice}
     */
    get activeAudioDevice() {
        return this.available.audioDevices.find(device => device.id === this.activeID.audioDevice);
    }

    /**
     * @return {VideoDevice}
     */
    get activeVideoDevice() {
        return this.available.videoDevices.find(device => device.id === this.activeID.videoDevice);
    }

    /**
     * @return {VideoResolution}
     */
    get activeVideoOption() {
        return this.available.videoOptions.find(option => option.id === this.activeID.videoOption);
    }

    /**
     * @param {string} deviceId
     * @return {Promise<void>}
     */
    async setAudioDevice(deviceId) {

        if (this.available.audioDevices.noneMatch(device => device.id === deviceId)) {
            throw new Error(`The audio device '${deviceId}' isn't available.`);
        }

        this.activeID.audioDevice = deviceId;
        localStorage.setItem('lastAudioDevice', deviceId);
        this.updateStates();
        await this.application.openAudioStream();
    }

    /**
     * @param {string} deviceId
     * @return {Promise<void>}
     */
    async setVideoDevice(deviceId) {

        if (this.available.videoDevices.noneMatch(device => device.id === deviceId)) {
            throw new Error(`The video device '${deviceId}' isn't available.`);
        }

        if (this.available.videoOptions.noneMatch(option => option.id === this.activeID.videoOption)) {
            throw new Error(`The video option '${this.activeID.videoOption}' isn't available.`);
        }

        this.activeID.videoDevice = deviceId;
        localStorage.setItem('lastVideoDevice', deviceId);
        this.updateStates();
        await this.application.openVideoStream();
    }

    /**
     * @param {string} resolutionId
     * @return {Promise<void>}
     */
    async setVideoOption(resolutionId) {

        if (this.available.videoDevices.noneMatch(device => device.id === this.activeID.videoDevice)) {
            throw new Error(`The video device '${this.activeID.videoDevice}' isn't available.`);
        }

        if (this.available.videoOptions.noneMatch(option => option.id === resolutionId)) {
            throw new Error(`The video option '${resolutionId}' isn't available.`);
        }

        this.activeID.videoOption = resolutionId;
        localStorage.setItem('lastVideoOption', resolutionId);
        this.updateStates();
        await this.application.openVideoStream();
    }

    /**
     * @return {Promise<void>}
     */
    async scan() {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const audioDevices = devices
            .filter(device => device.kind === DeviceType.AUDIO)
            .filter(device => device.deviceId.length === 64)
            .map(device => new AudioDevice(this, device));

        const videoDevices = devices
            .filter(device => device.kind === DeviceType.VIDEO)
            .filter(device => device.deviceId.length === 64)
            .map(device => new VideoDevice(this, device));

        const videoOptions = [
            new VideoResolution(this, 1920, 1080, 60),
            new VideoResolution(this, 1920, 1080, 30),
            new VideoResolution(this, 1280, 720, 60),
            new VideoResolution(this, 1280, 720, 30)
        ];

        this.available.audioDevices = audioDevices;
        this.available.videoDevices = videoDevices;
        this.available.videoOptions = videoOptions;
    }

    /**
     * @return {Promise<void>}
     */
    async applyDefault() {

        if (this.available.audioDevices.noneMatch(device => device.id === this.activeID.audioDevice)) {
            if (this.available.audioDevices.isEmpty()) {
                throw new Error(`No audio device available.`);
            }

            this.activeID.audioDevice = this.available.audioDevices[0].id;
        }

        if (this.available.videoDevices.noneMatch(device => device.id === this.activeID.videoDevice)) {
            if (this.available.videoDevices.isEmpty()) {
                throw new Error(`No video device available.`);
            }

            this.activeID.videoDevice = this.available.videoDevices[0].id;
        }

        if (this.available.videoOptions.noneMatch(option => option.id === this.activeID.videoOption)) {
            if (this.available.videoOptions.isEmpty()) {
                throw new Error(`No video option available. (Wut ?)`);
            }

            this.activeID.videoOption = this.available.videoOptions[0].id;
        }

        await this.application.openAudioStream();
        await this.application.openVideoStream();
    }

    updateStates() {

        this.available.videoDevices.forEach(device => device.enabled = device.id === this.activeID.videoDevice);
        this.available.audioDevices.forEach(device => device.enabled = device.id === this.activeID.audioDevice);
        this.available.videoOptions.forEach(option => option.enabled = option.id === this.activeID.videoOption);
    }
}
