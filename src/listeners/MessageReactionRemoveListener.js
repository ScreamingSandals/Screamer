const Listener = require('./Listener');
const SnipeStorage = require('../sniper/SnipeStorage');
const ReactionSnipe = require('../sniper/ReactionSnipe');


class MessageReactionRemoveListener extends Listener {

    register(client) {
        client.on('messageReactionRemove', async (reaction, user) => {
            if (reaction.partial) reaction = await reaction.fetch();
            await SnipeStorage.setReactionSnipe(reaction.message.channel.id, new ReactionSnipe(
                user,
                reaction.emoji,
                reaction.message.url,
                Date.now()
            ));
        });
    }
}

module.exports = MessageReactionRemoveListener;