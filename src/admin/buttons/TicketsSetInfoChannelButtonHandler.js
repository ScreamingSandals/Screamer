const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketsCancelSetInfoChannelButton = require('./TicketsCancelSetInfoChannelButton');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");
const Messages = require("../../Messages");
const TicketsSetInfoChannelButton = require("./TicketsSetInfoChannelButton");

class TicketsSetInfoChannelButtonHandler extends ButtonHandler {

    get button() {
        return TicketsSetInfoChannelButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        let ticketConfigurationProcess = TicketConfigurationProcessCache.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);

        if (ticketConfigurationProcess) {
            interaction.deferUpdate();

            ticketConfigurationProcess.chatAction = "INFO";

            ticketConfigurationProcess.interaction.editReply({
                content: Messages.CHANGE_INFO_CHANNEL,
                components: [
                    TicketsCancelSetInfoChannelButton.rowSingleButton
                ]
            });
        }
    }
}

module.exports = new TicketsSetInfoChannelButtonHandler();