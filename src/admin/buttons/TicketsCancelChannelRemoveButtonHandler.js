const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketsCancelChannelRemoveButton = require('./TicketsCancelChannelRemoveButton');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");

class TicketsCancelChannelRemoveButtonHandler extends ButtonHandler {

    get button() {
        return TicketsCancelChannelRemoveButton;
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

module.exports = new TicketsCancelChannelRemoveButtonHandler();