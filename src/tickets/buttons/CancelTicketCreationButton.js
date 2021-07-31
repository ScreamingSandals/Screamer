const Button = require('../../buttons/Button');
const Messages = require('../../Messages');
const {
    MessageButtonStyles,
    MessageActionRow
} = require('discord.js');
const TempActions = require("../TempActions");

class CancelTicketCreationButton extends Button {
    async handle(interaction) {
        let action = TempActions.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);
        if (action != null) {
            interaction.deferUpdate();
            TempActions.removeTempAction(action);
            await action.interaction.editReply({
                content: Messages.CANCELED,
                components: [
                    new MessageActionRow({
                        components: [
                            this.button.setDisabled(true)
                        ]
                    })
                ]
            });
        }
    }

    get interactionName() {
        return "supportv2_cancel";
    }

    get label() {
        return Messages.CANCEL;
    }

    get color() {
        return MessageButtonStyles.DANGER;
    }
}

module.exports = new CancelTicketCreationButton();