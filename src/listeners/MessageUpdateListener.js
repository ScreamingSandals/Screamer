const Listener = require('./Listener');
const SnipeStorage = require('../sniper/SnipeStorage');
const Snipe = require('../sniper/Snipe');


class MessageUpdateListener extends Listener {

    register(client) {
        client.on('messageUpdate', async (message) => {
            if (message.partial) return; // content is null

            await SnipeStorage.setEditSnipe(message.channel.id, new Snipe(
                message.author,
                message.content,
                message.editedTimestamp
            ))
        });
    }
}

module.exports = MessageUpdateListener;