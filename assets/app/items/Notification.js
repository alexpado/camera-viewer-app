export default class Notification {

    constructor(title, text) {

        this.title = title;
        this.text = text;

        this.item = document.createElement('div');
        this.item.classList.add('notification')

        const titleItem = document.createElement('h3');
        const textItem = document.createElement('span');

        titleItem.innerText = this.title;
        textItem.innerText = this.text;

        this.item.appendChild(titleItem);
        this.item.appendChild(textItem);
    }

    show(element, time) {
        element.appendChild(this.item);
        setTimeout(() => {
            this.item.classList.add('show');
            setTimeout(() => {
                this.item.classList.remove('show');
                setTimeout(() => {
                    this.item.remove();
                }, 500);
            }, time)
        }, 200);
    }

}

const usage = new Notification(
    'Capture',
    'Screenshot saved in /home/user/cwa/captures/001.png'
)
