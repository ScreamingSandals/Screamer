const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketsCancelCounterButton = require('./TicketsCancelCounterButton');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");

class TicketsCancelCounterButtonHandler extends ButtonHandler {

    get button() {
        return TicketsCancelCounterButton;
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

module.exports = new TicketsCancelCounterButtonHandler();