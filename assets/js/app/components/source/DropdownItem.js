export default class DropdownItem {

    constructor(name) {

        this.name = name;
        this._component = html({name});

        this._component.addEventListener('click', () => this.onClick(), {passive: true});
    }

    get component() {
        return this._component;
    }

    onClick() {
        console.warn('DropdownItem: Default onClick() method not overridden.');
    }

}

const html = (data) => {
    const parsed = document.createElement('div');
    parsed.innerHTML = template(data);
    return parsed.querySelector('*');
}

const template = (data) => `
<div class="cwa-item">
    ${data.name}
</div>
`
