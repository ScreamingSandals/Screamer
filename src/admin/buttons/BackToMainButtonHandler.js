const BackToMainButton = require('./BackToMainButton');
const ButtonHandler = require('../../buttons/ButtonHandler')
const InteractionCache = require("../../cache/InteractionCache");
const Messages = require("../../Messages");
const SelectAdminCategoryMenu = require("../menus/SelectAdminCategoryMenu");

class BackToMainButtonHandler extends ButtonHandler {
    get button() {
        return BackToMainButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        interaction.deferUpdate();
        let replyTo = InteractionCache.get(interaction.user.id, interaction.guildId, interaction.channelId, interaction.webhook.id);
        if (replyTo == null) {
            replyTo = interaction;
            interaction.defer({
                ephemeral: true
            });
        }
        replyTo.editReply({
            content: Messages.COMMAND_ADMIN,
            components: [
                SelectAdminCategoryMenu.rowSingleMenu
            ],
            ephemeral: true
        });
    }
}

module.exports = new BackToMainButtonHandler();