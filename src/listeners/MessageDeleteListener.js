const Listener = require('./Listener');
const SnipeStorage = require('../sniper/SnipeStorage');
const Snipe = require('../sniper/Snipe');

class MessageDeleteListener extends Listener {

    register(client) {
        client.on('messageDelete', async (message) => {
            if (message.partial) return; // content is null

            await SnipeStorage.setSnipe(message.channel.id, new Snipe(
                message.author,
                message.content,
                message.createdTimestamp
            ))
        });
    }
}

module.exports = MessageDeleteListener;