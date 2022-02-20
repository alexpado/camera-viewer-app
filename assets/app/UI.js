export default class UI {

    constructor() {

        this.videoContainer = this.getTag('container');
        this.videoPlayer = this.getTag('media');
        this.overlay = this.getTag('overlay');
        this.volumeController = this.getTag('audio-output');
        this.volumeFeedback = this.getTag('volume');
        this.audioInput = this.getTag('audio-input');
        this.audioDevices = this.getTag('audio-devices');
        this.videoInput = this.getTag('video-input');
        this.videoDevices = this.getTag('video-devices');
        this.closeButton = this.getTag('close');
    }

    /**
     * @param {string} tag
     * @return {Element}
     */
    getTag(tag) {
        return document.querySelector(`[data-tag="${tag}"]`);
    }

    /**
     * @param {Element} element
     * @param {Device[]} devices
     */
    applyDevices(element, devices) {

        element.innerHTML = '';
        devices.forEach(device => {
            element.appendChild(device.html);
        });
    }

    /**
     * @param {Device[]} devices
     */
    applyAudioDevices(devices) {

        this.applyDevices(this.audioDevices, devices);
    }

    /**
     * @param {Device[]} devices
     */
    applyVideoDevices(devices) {
        this.applyDevices(this.videoDevices, devices);
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

    setVolume(value) {
        this.volumeFeedback.style.height = `${value}%`;
    }
}
