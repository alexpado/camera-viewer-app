export default class UI {

    constructor() {

        this.videoContainer = this.getTag('container');
        this.videoPlayer = this.getTag('media');
        this.overlay = this.getTag('overlay');
        this.volumeController = this.getTag('audio-output');
        this.volumeFeedback = this.getTag('volume');
        this.audioDevices = this.getTag('audio-devices');
        this.videoDevices = this.getTag('video-devices');
        this.videoOptions = this.getTag('video-options')
        this.closeButton = this.getTag('close');
        this.notifications = this.getTag('notifications')
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
    applyItems(element, devices) {

        element.innerHTML = '';
        devices.forEach(device => {
            element.appendChild(device.html);
        });
    }

    /**
     * @param {Device[]} devices
     */
    applyAudioDevices(devices) {

        this.applyItems(this.audioDevices, devices);
    }

    /**
     * @param {Device[]} devices
     */
    applyVideoDevices(devices) {
        this.applyItems(this.videoDevices, devices);
    }

    /**
     * @param {Resolution[]} options
     */
    applyVideoOptions(options) {
        this.applyItems(this.videoOptions, options);
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
