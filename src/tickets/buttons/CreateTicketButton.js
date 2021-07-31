const Button = require('../../buttons/Button');
const CancelInteractionHandler = require('./CancelTicketCreationButton');
const Messages = require('../../Messages');
const {
    MessageButtonStyles
} = require('discord.js');
const TempActions = require('../TempActions')

class CreateTicketButton extends Button {
    async handle(interaction) {
        if (TempActions.hasTempAction(interaction.user.id, interaction.guildId, interaction.channelId)) {
            await interaction.reply({
                content: Messages.ALREADY_STARTED,
                ephemeral: true
            });
            return;
        }

        let newAction = TempActions.getOrCreateTempAction(interaction.user.id, interaction.guildId, interaction.channelId);

        newAction.interaction = interaction;
        await interaction.reply({
            content: Messages.WRITE_TOPIC,
            components: [
                CancelInteractionHandler.rowSingleButton
            ],
            ephemeral: true
        });
    }

    get interactionName() {
        return "supportv2_start";
    }

    get color() {
        return MessageButtonStyles.PRIMARY;
    }

    get label() {
        return Messages.CREATE_NEW_TICKET;
    }
}

module.exports = new CreateTicketButton();