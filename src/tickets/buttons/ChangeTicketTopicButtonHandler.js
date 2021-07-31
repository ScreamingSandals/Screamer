const ButtonHandler = require('../../buttons/ButtonHandler');
const CancelInteractionHandler = require('./CancelTicketCreationButton');
const Messages = require('../../Messages');
const TempActions = require('../TempActions');
const ChangeTicketTopicButton = require('./ChangeTicketTopicButton');

class ChangeTicketTopicButtonHandler extends ButtonHandler {
    get button() {
        return ChangeTicketTopicButton;
    }

    async handle(interaction) {
        let action = TempActions.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);
        if (action != null) {
            interaction.deferUpdate();

            action.line = null;
            await action.interaction.editReply({
                content: Messages.WRITE_TOPIC,
                components: [
                    CancelInteractionHandler.rowSingleButton
                ]
            });
        }
    }
}

module.exports = new ChangeTicketTopicButtonHandler();