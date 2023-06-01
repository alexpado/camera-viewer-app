import Option from './source/Option.js';

export default class VideoDevice extends Option {

    /**
     * @param {DeviceManager} deviceManager
     * @param {MediaDeviceInfo} device
     */
    constructor(deviceManager, device) {
        super(deviceManager, device.deviceId, device.label);
    }

    onClick() {
        this.deviceManager.setVideoDevice(this.id).then();
    }
}
