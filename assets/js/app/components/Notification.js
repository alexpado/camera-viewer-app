export default class Notification {

    constructor(title, subtitle) {

        this._component = html({title, subtitle});
    }

    get component() {

        return this._component;
    }

    /**
     *
     * @param {Element} inComponent
     * @param time
     * @return {Promise<void>}
     */
    async show(inComponent, time) {
        inComponent.appendChild(this.component);
        await waitFor(200);
        this._component.classList.add('show');
        await waitFor(time);
        this._component.classList.remove('show');
        await waitFor(200);
        this._component.remove();
    }

}

const waitFor = (time) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

const html = (data) => {
    const parsed = document.createElement('div');
    parsed.innerHTML = template(data);
    return parsed.querySelector('*');
}

const template = (data) => `
<div class="notification">
    <h3>${data.title}</h3>
    <span>${data.subtitle}</span>
</div>
`
