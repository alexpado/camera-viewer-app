export default class Resolution {

    constructor(app, width, height, fps) {

        this.app = app;
        this.width = width;
        this.height = height;
        this.fps = fps;
        this.id = `${width}x${height}@${fps}`;
        this.label = `${width}x${height} ${fps}fps (${height}p)`

        this.item = document.createElement('div');
        this.item.classList.add('cwa-item');
        this.item.innerHTML = this.label;

        this.item.addEventListener('click', () => {
            app.switchVideoResolution(this.id).then()
        });
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
