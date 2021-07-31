const {
    SelectMenuInteraction
} = require('discord.js');

/**
 *
 * @type {Menu[]}
 */
const handlers = [
    require('../admin/menus/SelectAdminCategoryMenu')
];

class MenusManager extends null {
    /**
     * @param {SelectMenuInteraction} interaction
     */
    static async handleMenu(interaction) {
        let handler = handlers.find(value => value.interactionName === interaction.customId);
        if (handler !== null) {
            try {
                await handler.handle(interaction);
            } catch (e) {
                console.error(e);
            }
        }
    }
}

module.exports = MenusManager;