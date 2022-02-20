export default class Device {

    /**
     * @param {Application} app
     * @param {MediaDeviceInfo} device
     */
    constructor(app, device) {

        this.app = app;
        this.info = device;
        this.id = device.deviceId;
        this.name = device.label;

        // Construct HTML Entity
        this.item = document.createElement('div');
        this.item.classList.add('cwa-device');
        this.item.innerText = this.name;

        this.item.addEventListener('click', () => {
            if (device.kind === 'audioinput') {
                app.switchAudioSource(this.id).then();
            } else {
                app.switchVideoSource(this.id).then();
            }
        })
    }

    get enabled() {
        return this.html.classList.contains('active');
    }

    set enabled(value) {
        if (value) {
            this.html.classList.add('active');
        } else {
            this.html.classList.remove('active');
        }
    }

    get html() {
        return this.item;
    }
}
