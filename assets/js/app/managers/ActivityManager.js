export default class ActivityManager {

    constructor(activityTimeout) {

        this.activityTimeout = activityTimeout;
        this.timeoutId = -1;

        document.addEventListener('mousemove', () => this.signalActivity(), {passive: true});
    }

    get isActive() {
        return document.body.classList.contains('active');
    }

    addHook(element, event, callback) {

        element.addEventListener(event, (ev) => {
            this.signalActivity();
            callback(ev);
        }, {
            passive: true
        })
    }

    signalActivity() {
        if (!this.isActive) {
            document.body.classList.add('active');
        }

        if (this.timeoutId !== -1) {
            clearTimeout(this.timeoutId)
        }

        this.timeoutId = setTimeout(() => {
            if (this.isActive) {
                document.body.classList.remove('active');
            }
            this.timeoutId = -1;
        }, this.activityTimeout);
    }
}
