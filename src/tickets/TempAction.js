const {
    MessageComponentInteraction
} = require('discord.js');

class TempAction {
    /**
     *
     * @param {string} userId
     * @param {string} guildId
     * @param {string} channelId
     */
    constructor(userId, guildId, channelId) {
        /** @private */
        this._userId = userId;
        /** @private */
        this._guildId = guildId;
        /** @private */
        this._channelId = channelId;

        /**
         *
         * @type {?string}
         */
        this.line = null;
        /**
         *
         * @type {?MessageComponentInteraction}
         */
        this.interaction = null;
    }

    /**
     *
     * @return {string}
     */
    get userId() {
        return this._userId;
    }

    /**
     *
     * @return {string}
     */
    get guildId() {
        return this._guildId;
    }

    /**
     *
     * @return {string}
     */
    get channelId() {
        return this._channelId;
    }
}

module.exports = TempAction;