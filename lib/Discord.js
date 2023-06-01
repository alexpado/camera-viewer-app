const {Client} = require('discord-rpc');

class Discord {
    constructor() {
        this.isReady = false;
        this.client = new Client({transport: 'ipc'});
        this.hold = null;
    }

    async login(clientId) {
        this.client.on('ready', () => {
            this.isReady = true;
            if (this.hold) {
                this.setActivity(this.hold).then();
                this.hold = null;
            }
        });
        console.log(clientId);
        await this.client.login({clientId});
    }

    async setActivity(data) {
        if (this.isReady) {
            if (data === null) {
                console.log('[Discord] Clearing activity')
                await this.client.clearActivity();
            } else {
                console.log('[Discord] Updating activity', data)
                await this.client.setActivity(data);
            }

            return Promise.resolve();
        } else {
            this.hold = data;
        }
    }
}


module.exports = new Discord();
