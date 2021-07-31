const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketsChangeDescriptionButton = require('./TicketsChangeDescriptionButton');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");
const Messages = require("../../Messages");
const TicketsCancelDescriptionButton = require("./TicketsCancelDescriptionButton");

class TicketsChangeDescriptionButtonHandler extends ButtonHandler {

    get button() {
        return TicketsChangeDescriptionButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        let ticketConfigurationProcess = TicketConfigurationProcessCache.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);

        if (ticketConfigurationProcess) {
            interaction.deferUpdate();

            ticketConfigurationProcess.chatAction = "DESCRIPTION";

            ticketConfigurationProcess.interaction.editReply({
                content: Messages.CHANGE_DESCRIPTION_NEW.replace("${channelHere}", '<#' + ticketConfigurationProcess.channelId + '>'),
                components: [
                    TicketsCancelDescriptionButton.rowSingleButton
                ]
            });
        }
    }
}

module.exports = new TicketsChangeDescriptionButtonHandler();