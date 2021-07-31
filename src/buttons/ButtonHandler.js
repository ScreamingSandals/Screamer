const {
    ButtonInteraction
} = require('discord.js');

/**
 * @abstract
 */
class ButtonHandler {
    /**
     * @abstract
     * @type {Button}
     */
    get button() {}

    /**
     * @abstract
     * @param {ButtonInteraction} interaction
     */
    async handle(interaction) {}
}

module.exports = ButtonHandler;