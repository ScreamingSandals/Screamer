const {
    CommandInteraction,
    ApplicationCommandData
} = require('discord.js');

/**
 * @abstract
 */
class Command {
    /**
     *
     * @param {CommandInteraction} interaction
     * @abstract
     */
    async handle(interaction) {}

    /**
     * @return {ApplicationCommandData}
     */
    get commandStructure() {
        return {
            name: this.commandName
        }
    }

    /**
     * @return {string}
     * @abstract
     */
    get commandName() {}
}

module.exports = Command;