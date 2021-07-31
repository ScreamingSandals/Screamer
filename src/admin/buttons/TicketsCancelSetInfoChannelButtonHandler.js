const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketsCancelSetInfoChannelButton = require('./TicketsCancelSetInfoChannelButton');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");

class TicketsCancelSetInfoChannelButtonHandler extends ButtonHandler {

    get button() {
        return TicketsCancelSetInfoChannelButton;
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

module.exports = new TicketsCancelSetInfoChannelButtonHandler();