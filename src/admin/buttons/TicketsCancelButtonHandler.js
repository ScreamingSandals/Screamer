const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketsCancelButton = require('./TicketsCancelButton');
const Messages = require('../../Messages');
const TicketConfigurationProcessCache = require('../../cache/TicketConfigurationProcessCache');
const {
    MessageActionRow
} = require("discord.js");

class TicketsCancelButtonHandler extends ButtonHandler {

    get button() {
        return TicketsCancelButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        let ticketConfigurationProcess = TicketConfigurationProcessCache.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);

        if (ticketConfigurationProcess) {
            interaction.deferUpdate();

            TicketConfigurationProcessCache.removeTempAction(ticketConfigurationProcess);

            ticketConfigurationProcess.interaction.editReply({
                content: Messages.CANCELED,
                components: [
                    new MessageActionRow({
                        components: [
                            TicketsCancelButton.button.setDisabled(true)
                        ]
                    })
                ]
            });
        }
    }
}

module.exports = new TicketsCancelButtonHandler();