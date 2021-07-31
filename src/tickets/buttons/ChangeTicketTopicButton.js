const Button = require('../../buttons/Button');
const CancelInteractionHandler = require('./CancelTicketCreationButton');
const Messages = require('../../Messages');
const TempActions = require('../TempActions');

class ChangeTicketTopicButton extends Button {
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

    get interactionName() {
        return "supportv2_change";
    }

    get label() {
        return Messages.CHANGE_TOPIC;
    }
}

module.exports = new ChangeTicketTopicButton();