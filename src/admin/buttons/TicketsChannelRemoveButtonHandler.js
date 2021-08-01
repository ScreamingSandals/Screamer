const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");
const Messages = require("../../Messages");
const TicketsChannelRemoveButton = require("./TicketsChannelRemoveButton");
const TicketsCancelChannelRemoveButton = require('./TicketsCancelChannelRemoveButton')

class TicketsChannelRemoveButtonHandler extends ButtonHandler {

    get button() {
        return TicketsChannelRemoveButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        let ticketConfigurationProcess = TicketConfigurationProcessCache.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);

        if (ticketConfigurationProcess) {
            interaction.deferUpdate();

            ticketConfigurationProcess.chatAction = "REMOVE";

            ticketConfigurationProcess.interaction.editReply({
                content: Messages.CONFIRM_DANGER,
                components: [
                    TicketsCancelChannelRemoveButton.rowSingleButton
                ]
            });
        }
    }
}

module.exports = new TicketsChannelRemoveButtonHandler();