const Listener = require('./Listener');

class GuildJoinedListener extends Listener {
    register(client) {
        client.on('guildCreate', async (guild) => {

        });
    }
}

module.exports = GuildJoinedListener;