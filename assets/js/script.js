import prototypes  from './prototypes.js';
import Application from './app/Application.js';

prototypes();

(async () => {
    const application = new Application();
    await application.init();

    window.app = application;
})();
