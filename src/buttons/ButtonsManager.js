const {
    ButtonInteraction
} = require('discord.js');

/**
 *
 * @type {ButtonHandler[]}
 */
const handlers = [
    require('./BruhButtonHandler'),
    require('../tickets/buttons/CancelTicketCreationButtonHandler'),
    require('../tickets/buttons/ChangeTicketTopicButtonHandler'),
    require('../tickets/buttons/CloseTicketButtonHandler'),
    require('../tickets/buttons/ConfirmTicketCreationButtonHandler'),
    require('../tickets/buttons/CreateTicketButtonHandler'),
    require('../tickets/buttons/MyTicketsButtonHandler'),
    require('../tickets/buttons/ReopenTicketButtonHandler'),
    require('../admin/buttons/BackToMainButtonHandler'),
    require('../admin/buttons/ConfigureTicketsButtonHandler')
];

class ButtonsManager extends null {
    /**
     * @param {ButtonInteraction} interaction
     */
    static async handleButton(interaction) {
        let handler = handlers.find(value => value.button.interactionName === interaction.customId);
        if (handler) {
            try {
                await handler.handle(interaction);
            } catch (e) {
                console.error(e);
            }
        }
    }
}

module.exports = ButtonsManager;