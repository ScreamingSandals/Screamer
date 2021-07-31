const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketsChangeTitleButton = require('./TicketsChangeTitleButton');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");
const Messages = require("../../Messages");
const TicketsCancelTitleButton = require("./TicketsCancelTitleButton");

class TicketsChangeTitleButtonHandler extends ButtonHandler {

    get button() {
        return TicketsChangeTitleButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        let ticketConfigurationProcess = TicketConfigurationProcessCache.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);

        if (ticketConfigurationProcess) {
            interaction.deferUpdate();

            ticketConfigurationProcess.chatAction = "TITLE";

            ticketConfigurationProcess.interaction.editReply({
                content: Messages.CHANGE_TITLE_NEW,
                components: [
                    TicketsCancelTitleButton.rowSingleButton
                ]
            });
        }
    }
}

module.exports = new TicketsChangeTitleButtonHandler();