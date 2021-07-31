const ButtonHandler = require('../../buttons/ButtonHandler');
const CancelInteractionHandler = require('./CancelTicketCreationButton');
const Messages = require('../../Messages');
const TempActions = require('../TempActions')
const CreateTicketButton = require('./CreateTicketButton');

class CreateTicketButtonHandler extends ButtonHandler {
    get button() {
        return CreateTicketButton;
    }

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
}

module.exports = new CreateTicketButtonHandler();