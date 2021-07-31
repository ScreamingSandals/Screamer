const ButtonHandler = require('../../buttons/ButtonHandler');
const MoveCounterButton = require('./MoveCounterButton');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");
const Messages = require("../../Messages");
const TicketsCancelCounterButton = require("./TicketsCancelCounterButton");

class MoveCounterButtonHandler extends ButtonHandler {

    get button() {
        return MoveCounterButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        let ticketConfigurationProcess = TicketConfigurationProcessCache.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);

        if (ticketConfigurationProcess) {
            interaction.deferUpdate();

            ticketConfigurationProcess.chatAction = "COUNTER";

            ticketConfigurationProcess.interaction.editReply({
                content: Messages.MOVE_COUNTER_,
                components: [
                    TicketsCancelCounterButton.rowSingleButton
                ]
            });
        }
    }
}

module.exports = new MoveCounterButtonHandler();