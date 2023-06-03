import Game       from '../entities/Game.js';
import Components from '../UI.js';

export default class GameManager {

    /**
     * @param {Application} application
     */
    constructor(application) {

        this.application = application;
        this.gameMenu    = new Game(0, 'Switch Main Menu', 'switch', false);

        this.configurableGames = [];
        this._load();

        this.games = [
            this.gameMenu,
            ...this.configurableGames,
        ];

        cwa.sendGameActivity(this.games[0].asActivity());
        this.doSettingRendering();

        Components.NewGameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const content  = {
                name: '',
                key:  null,
            };

            formData.forEach((value, name) => {
                if (name === 'game-name') {
                    content.name = value;
                } else if (name === 'game-key') {
                    content.key = value;
                }
            });

            this.registerNewGame(content);
            e.target.reset();
        });

        this._rebuild();
    }

    _rebuild() {
        this.games.forEach(game => {
            game.onSelected = () => {
                cwa.sendGameActivity(game.asActivity());
            };
            game.onDelete   = (id) => {
                this.configurableGames = this.configurableGames.filter(game => game.id !== id);
                this._save();
                this.doSettingRendering();
            };

            game.onChange = () => {
                this._save();
            }
        });
    }

    _save() {
        localStorage.setItem('games', JSON.stringify(this.configurableGames.map(game => game.asObject())));
        this._rebuild();
    }

    _load() {
        const storage = localStorage.getItem('games');
        if (storage) {
            JSON.parse(storage).forEach(item => {

                const game = new Game(
                    item.id,
                    item.name,
                    item.imageKey,
                    item.timeTracking,
                );

                this.configurableGames.push(game);
            });
        }
    }

    doSettingRendering() {

        Components.GameSettingList.innerHTML = '';

        this.configurableGames.forEach(game => {
            Components.GameSettingList.appendChild(game.settingElement);
        });

        this.application.interfaceManager.games = this.games;

    }

    registerNewGame({
                        name,
                        key,
                    }) {

        console.log('Name', name, 'Key', key);

        const id   = Date.now();
        const game = new Game(id, name, key, false);
        this.configurableGames.push(game);
        this.games.push(game);
        this._save();
        this.doSettingRendering();
    }

}
