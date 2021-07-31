const ButtonHandler = require('../../buttons/ButtonHandler');
const Messages = require('../../Messages');
const {
    MessageActionRow
} = require('discord.js');
const TempActions = require("../TempActions");
const CancelTicketCreationButton = require('./CancelTicketCreationButton');

class CancelTicketCreationButtonHandler extends ButtonHandler {
    get button() {
        return CancelTicketCreationButton;
    }

    async handle(interaction) {
        let action = TempActions.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);
        if (action != null) {
            interaction.deferUpdate();
            TempActions.removeTempAction(action);
            await action.interaction.editReply({
                content: Messages.CANCELED,
                components: [
                    new MessageActionRow({
                        components: [
                            CancelTicketCreationButton.button.setDisabled(true)
                        ]
                    })
                ]
            });
        }
    }
}

module.exports = new CancelTicketCreationButtonHandler();