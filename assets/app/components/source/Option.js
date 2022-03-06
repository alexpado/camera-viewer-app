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

    // noinspection JSUnusedGlobalSymbols • WTF Idea ? Used in DeviceManager#updateStates()
    set enabled(value) {
        if (value) {
            this._component.classList.add('active');
        } else {
            this._component.classList.remove('active');
        }
    }

}
