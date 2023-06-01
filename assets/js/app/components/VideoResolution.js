import Option from './source/Option.js';

export default class VideoResolution extends Option {

    /**
     * @param {DeviceManager} deviceManager
     * @param {number} width
     * @param {number} height
     * @param {number} fps
     */
    constructor(deviceManager, width, height, fps) {
        super(deviceManager, `${width}x${height}@${fps}`, `${width}x${height} ${fps}fps`);
        this._width = width;
        this._height = height;
        this._fps = fps;
    }

    /**
     * @return {number}
     */
    get width() {
        return this._width;
    }

    /**
     * @return {number}
     */
    get height() {
        return this._height;
    }

    /**
     * @return {number}
     */
    get fps() {
        return this._fps;
    }

    onClick() {
        this.deviceManager.setVideoOption(this.id).then();
    }
}
