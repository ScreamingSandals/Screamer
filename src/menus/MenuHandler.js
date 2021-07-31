const {
    SelectMenuInteraction
} = require('discord.js');

/**
 * @abstract
 */
class MenuHandler {
    /**
     * @abstract
     * @return {Menu}
     */
    get menu() {}

    /**
     * @abstract
     * @param {SelectMenuInteraction} interaction
     */
    async handle(interaction) {}
}

module.exports = MenuHandler;