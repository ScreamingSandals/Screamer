const MenuHandler = require('../../menus/MenuHandler');
const Messages = require('../../Messages');
const InteractionCache = require('../../cache/InteractionCache');
const ChannelConfigurationManager = require('../../database/ChannelConfigurationManager');
const {
    MessageActionRow
} = require('discord.js');
const BackToMainButton = require('../buttons/BackToMainButton');
const ConfigureTicketsButton = require('../buttons/ConfigureTicketsButton');
const SelectAdminCategoryMenu = require('./SelectAdminCategoryMenu');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");

class SelectAdminCategoryMenuHandler extends MenuHandler {
    get menu() {
        return SelectAdminCategoryMenu;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        switch (interaction.values[0]) {
            case "admin_tickets_category":
                interaction.deferUpdate();
                let replyTo = InteractionCache.get(interaction.user.id, interaction.guildId, interaction.channelId, interaction.webhook.id);
                if (!replyTo) {
                    replyTo = interaction;
                    interaction.defer({
                        ephemeral: true
                    });
                }

                let channelConfig = await ChannelConfigurationManager.getChannel(interaction.guildId, interaction.channelId);
                if (channelConfig != null) {
                    if (replyTo !== interaction) {
                        InteractionCache.remove(replyTo);
                    }

                    let configurationProcess = TicketConfigurationProcessCache.createTempAction(replyTo, replyTo.user.id, replyTo.guildId, replyTo.channelId);

                    let channelConfiguration = await ChannelConfigurationManager.getChannel(replyTo.guildId, replyTo.channelId);
                    if (channelConfiguration) {
                        configurationProcess.title = channelConfiguration.title;
                        configurationProcess.description = channelConfiguration.description;
                    }

                    configurationProcess.sendBaseMessage();
                } else {
                    replyTo.editReply({
                        content: Messages.CHANNEL_NOT_CONFIGURED_FOR_TICKETS,
                        components: [
                            new MessageActionRow({
                                components: [
                                    ConfigureTicketsButton.button,
                                    BackToMainButton.button
                                ]
                            })
                        ]
                    });
                }
                break;
        }
    }
}

module.exports = new SelectAdminCategoryMenuHandler();