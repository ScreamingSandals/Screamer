const {
    Interaction
} = require('discord.js');

/**
 *
 * @type {Interaction[]}
 */
let interactions = [];

class InteractionCache extends null {
    /**
     *
     * @param {Interaction} interaction
     */
    static put(interaction) {
        if (!interactions.find(val => val === interaction)) {
            interactions.push(interaction);
            setTimeout(() => {
                interactions.splice(interactions.indexOf(interaction), 1);
            }, 900000);
        }
    }

    /**
     *
     * @param {string} userId
     * @param {string} guildId
     * @param {string} channelId
     * @param {string} webhookId
     * @returns {Interaction}
     */
    static get(userId, guildId, channelId, webhookId) {
        return interactions.find(value => value.user.id === userId && value.guildId === guildId && value.channelId === channelId && value.webhook.id === webhookId);
    }
}

module.exports = InteractionCache;