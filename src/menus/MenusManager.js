const {
    SelectMenuInteraction
} = require('discord.js');

/**
 *
 * @type {MenuHandler[]}
 */
const handlers = [
    require('../admin/menus/SelectAdminCategoryMenuHandler')
];

class MenusManager extends null {
    /**
     * @param {SelectMenuInteraction} interaction
     */
    static async handleMenu(interaction) {
        let handler = handlers.find(value => value.menu.interactionName === interaction.customId);
        if (handler) {
            try {
                await handler.handle(interaction);
            } catch (e) {
                console.error(e);
            }
        }
    }
}

module.exports = MenusManager;