import DropdownItem from './DropdownItem.js';

export default class Option extends DropdownItem {

    /**
     * @param {DeviceManager} deviceManager
     * @param {string} id
     * @param {string} label
     */
    constructor(deviceManager, id, label) {
        super(label);

        this.deviceManager = deviceManager;
        this.id = id;
    }

    get enabled() {
        this._component.classList.contains('active');
    }

    set enabled(value) {
        if (value) {
            this._component.classList.add('active');
        } else {
            this._component.classList.remove('active');
        }
    }

}
