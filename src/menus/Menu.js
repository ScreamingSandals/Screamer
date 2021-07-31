const {
    SelectMenuInteraction,
    MessageSelectMenu,
    MessageActionRow,
    MessageSelectOption
} = require('discord.js');
const Messages = require('../Messages');

/**
 * @abstract
 */
class Menu {
    /**
     * @abstract
     * @return {string}
     */
    get interactionName() {}


    /**
     * @abstract
     * @param {SelectMenuInteraction} interaction
     */
    async handle(interaction) {}

    /**
     *
     * @return {MessageSelectMenu}
     */
    get selectMenu() {
        return new MessageSelectMenu({
            customId: this.interactionName,
            placeholder: this.placeholder,
            options: this.options
        });
    }

    /**
     *
     * @return {string}
     */
    get placeholder() {
        return Messages.NOTHING_SELECTED;
    }

    /**
     * @return {MessageSelectOption[]}
     * @abstract
     */
    get options() {}

    /**
     *
     * @return {MessageActionRow}
     */
    get rowSingleMenu() {
        return new MessageActionRow({
            components: [
                this.selectMenu
            ]
        });
    }
}

module.exports = Menu;