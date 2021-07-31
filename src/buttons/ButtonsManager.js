const {
    ButtonInteraction
} = require('discord.js');

/**
 *
 * @type {Button[]}
 */
const handlers = [
    require('./BruhButton'),
    require('../tickets/buttons/CancelTicketCreationButton'),
    require('../tickets/buttons/ChangeTicketTopicButton'),
    require('../tickets/buttons/CloseTicketInteractionHandler'),
    require('../tickets/buttons/ConfirmTicketCreationButton'),
    require('../tickets/buttons/CreateTicketButton'),
    require('../tickets/buttons/MyTicketsButton'),
    require('../tickets/buttons/ReopenTicketButton')
];

class ButtonsManager extends null {
    /**
     * @param {ButtonInteraction} interaction
     */
    static async handleButton(interaction) {
        let handler = handlers.find(value => value.interactionName === interaction.id);
        if (handler !== null) {
            try {
                await handler.handle(interaction);
            } catch (e) {
                console.error(e);
            }
        }
    }
}

module.exports = ButtonsManager;