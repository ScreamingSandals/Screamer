const TempAction = require('./TempAction');

/**
 *
 * @type {TempAction[]}
 */
let actions = [];

class TempActions extends null {
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
     * @return {?TempAction}
     */
    static getTempActionOrNull(user, guild, channel) {
        return actions.find(value => value.userId === user && value.guildId === guild && value.channelId === channel);
    }

    /**
     *
     * @param {string} user
     * @param {string} guild
     * @param {string} channel
     * @return {TempAction}
     */
    static getOrCreateTempAction(user, guild, channel) {
        let a = actions.find(value => value.userId === user && value.guildId === guild && value.channelId === channel);
        if (a != null) {
            return a;
        } else {
            let na = new TempAction(user, guild, channel);
            actions.push(na);
            return na;
        }
    }

    /**
     *
     * @param {TempAction} action
     */
    static removeTempAction(action) {
        let index = actions.indexOf(action);
        if (index > -1) {
            actions.splice(index, 1);
        }
    }

    /**
     *
     * @param {string} guild
     * @param {string} channel
     * @returns {TempAction[]}
     */
    static getAllInChannel(guild, channel) {
        return actions.filter(value => value.guildId === guild && value.channelId === channel);
    }
}

module.exports = TempActions;