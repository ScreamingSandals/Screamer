const {
    Interaction
} = require('discord.js');

/**
 *
 * @type {Interaction[]}
 */
let interactions = [];

// doesn't work well because discord api can't return the snowflake id of the message if it's ephemeral
class InteractionCache extends null {
    /**
     *
     * @param {Interaction} interaction
     */
    static put(interaction) {
        if (!interactions.find(val => val === interaction)) {
            interactions.push(interaction);
            setTimeout(() => {
                if (interactions.indexOf(interaction) > -1) {
                    interactions.splice(interactions.indexOf(interaction), 1);
                }
            }, 60000);
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

    /**
     *
     * @param {Interaction} interaction
     */
    static remove(interaction) {
        if (interactions.indexOf(interaction) > -1) {
            interactions.splice(interactions.indexOf(interaction), 1);
        }
    }
}

module.exports = InteractionCache;