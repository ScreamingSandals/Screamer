const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketsCancelDescriptionButton = require('./TicketsCancelDescriptionButton');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");

class TicketsCancelDescriptionButtonHandler extends ButtonHandler {

    get button() {
        return TicketsCancelDescriptionButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        let ticketConfigurationProcess = TicketConfigurationProcessCache.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);

        if (ticketConfigurationProcess) {
            interaction.deferUpdate();

            ticketConfigurationProcess.chatAction = null;

            ticketConfigurationProcess.sendBaseMessage();
        }
    }
}

module.exports = new TicketsCancelDescriptionButtonHandler();