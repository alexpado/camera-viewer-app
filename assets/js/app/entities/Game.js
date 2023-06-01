import DropdownItem from '../components/source/DropdownItem.js';

export default class Game {

    /**
     * @param {number} id
     * @param {string} name
     * @param {string|null} imageKey
     * @param {boolean} timeTracking
     */
    constructor(id, name, imageKey, timeTracking) {

        this.id           = id;
        this.name         = name;
        this.imageKey     = imageKey;
        this.timeTracking = timeTracking;
        this.onDelete     = () => {
        };
        this.onSelected   = () => {
        };
        this.onChange = () => {
        };

        this.settingElement  = this._createSettingElement();
        this.dropdownElement = new DropdownItem(this.name);

        this.dropdownElement.onClick = () => {
            this.onSelected(id);
        };
    }

    _createSettingElement() {
        const settingElement = document.createElement('div');
        settingElement.classList.add('game');

        const p = document.createElement('p');

        if (this.imageKey) {
            p.innerText = `[${this.imageKey}] ${this.name}`;
        } else {
            p.innerText = this.name;
        }

        const timeTrackingButton = document.createElement('button');
        timeTrackingButton.classList.add('btn', 'btn-time');
        timeTrackingButton.innerText = 'T';

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-del');
        deleteButton.innerText = 'R';

        if (this.timeTracking) {
            timeTrackingButton.classList.add('enabled');
        }

        deleteButton.addEventListener('click', () => {
            this.onDelete(this.id);
        });

        timeTrackingButton.addEventListener('click', () => {
            this.timeTracking = !this.timeTracking;
            if (this.timeTracking) {
                timeTrackingButton.classList.add('enabled');
            } else {
                timeTrackingButton.classList.remove('enabled');
            }

            this.onChange(this.id);
        });


        settingElement.appendChild(p);
        settingElement.appendChild(timeTrackingButton);
        settingElement.appendChild(deleteButton);

        return settingElement;
    }

    asObject() {
        return {
            id:           this.id,
            name:         this.name,
            imageKey:     this.imageKey,
            timeTracking: this.timeTracking,
        };
    }

    /**
     * @return {{largeImageKey: (string|null), details: string, startTimestamp: (Date|null)}}
     */
    asActivity() {
        const activity = {
            details:        this.name,
            largeImageKey:  this.imageKey,
            startTimestamp: null,
        };

        if (this.timeTracking) {
            activity.startTimestamp = new Date();
        }

        return activity;
    }

}
