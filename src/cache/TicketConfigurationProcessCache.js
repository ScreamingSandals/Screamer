const TicketConfigurationProcess = require('./TicketConfigurationProcess');
const {
    Interaction
} = require('discord.js');

/**
 *
 * @type {TicketConfigurationProcess[]}
 */
let actions = [];

class TicketConfigurationProcessCache extends null {
    /**
     *
     * @param {string} user
     * @param {string} guild
     * @param {string} channel
     * @return {boolean}
     */
    static hasTempAction(user, guild, channel) {
        return actions.find(value => value.userId === user && value.guildId === guild && value.channelId === channel) != null;
    }

    /**
     *
     * @param {string} user
     * @param {string} guild
     * @param {string} channel
     * @return {?TicketConfigurationProcess}
     */
    static getTempActionOrNull(user, guild, channel) {
        return actions.find(value => value.userId === user && value.guildId === guild && value.channelId === channel);
    }

    /**
     *
     * @param {Interaction} interaction
     * @param {string} user
     * @param {string} guild
     * @param {string} channel
     * @return {TicketConfigurationProcess}
     */
    static createTempAction(interaction, user, guild, channel) {
        let a = actions.find(value => value.userId === user && value.guildId === guild && value.channelId === channel);
        if (a != null) {
            return a;
        } else {
            let na = new TicketConfigurationProcess(interaction, user, guild, channel, Date.now() + 900000);
            actions.push(na);
            na.cancelTimeout = setTimeout(() => {
                if (actions.indexOf(na) > -1) {
                    actions.splice(actions.indexOf(na), 1);
                }
            }, 900000);
            return na;
        }
    }

    /**
     *
     * @param {TicketConfigurationProcess} action
     */
    static removeTempAction(action) {
        let index = actions.indexOf(action);
        if (index > -1) {
            actions.splice(index, 1);
            clearTimeout(action.cancelTimeout);
        }
    }
}

module.exports = TicketConfigurationProcessCache;