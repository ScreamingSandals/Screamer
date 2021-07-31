const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketsCancelTitleButton = require('./TicketsCancelTitleButton');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");

class TicketsCancelTitleButtonHandler extends ButtonHandler {

    get button() {
        return TicketsCancelTitleButton;
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

module.exports = new TicketsCancelTitleButtonHandler();