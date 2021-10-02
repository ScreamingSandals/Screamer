/**
 *
 * @type {{string: Snipe}}
 */
const snipes = {};
/**
 *
 * @type {{string: Snipe}}
 */
const editSnipes = {};
/**
 *
 * @type {{string: ReactionSnipe}}
 */
const reactionSnipes = {};

class SnipeStorage extends null {
    /**
     *
     * @param {string} channelId
     * @returns {Promise<Snipe|null>}
     */
    static async getSnipe(channelId) {
        return snipes.hasOwnProperty(channelId) ? snipes[channelId] : null;
    }

    /**
     *
     * @param {string} channelId
     * @param {Snipe} snipe
     */
    static async setSnipe(channelId, snipe) {
        snipes[channelId] = snipe;
    }

    /**
     *
     * @param {string} channelId
     * @returns {Promise<Snipe|null>}
     */
    static async getEditSnipe(channelId) {
        return editSnipes.hasOwnProperty(channelId) ? editSnipes[channelId] : null;
    }

    /**
     *
     * @param {string} channelId
     * @param {Snipe} snipe
     */
    static async setEditSnipe(channelId, snipe) {
        editSnipes[channelId] = snipe;
    }

    /**
     *
     * @param {string} channelId
     * @returns {Promise<ReactionSnipe|null>}
     */
    static async getReactionSnipe(channelId) {
        return reactionSnipes.hasOwnProperty(channelId) ? reactionSnipes[channelId] : null;
    }

    /**
     *
     * @param {string} channelId
     * @param {ReactionSnipe} snipe
     */
    static async setReactionSnipe(channelId, snipe) {
        reactionSnipes[channelId] = snipe;
    }
}

module.exports = SnipeStorage;