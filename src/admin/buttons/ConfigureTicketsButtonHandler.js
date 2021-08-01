const ConfigureTicketsButton = require('./ConfigureTicketsButton');
const ButtonHandler = require('../../buttons/ButtonHandler')
const InteractionCache = require("../../cache/InteractionCache");
const TicketConfigurationProcessCache = require('../../cache/TicketConfigurationProcessCache');
const ChannelConfigurationManager = require('../../database/ChannelConfigurationManager');

class ConfigureTicketsButtonHandler extends ButtonHandler {
    get button() {
        return ConfigureTicketsButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        let replyTo = InteractionCache.get(interaction.user.id, interaction.guildId, interaction.channelId, interaction.webhook.id);
        if (!replyTo) {
            replyTo = interaction;
            interaction.defer({
                ephemeral: true
            });
        } else {
            interaction.deferUpdate();
            InteractionCache.remove(replyTo);
        }

        let configurationProcess = TicketConfigurationProcessCache.createTempAction(replyTo, replyTo.user.id, replyTo.guildId, replyTo.channelId);

        let channelConfiguration = await ChannelConfigurationManager.getChannel(replyTo.guildId, replyTo.channelId);
        if (channelConfiguration) {
            configurationProcess.title = channelConfiguration.title;
            configurationProcess.description = channelConfiguration.description;
            configurationProcess.infoChannelId = channelConfiguration.infoChannelId;
            configurationProcess.existed = true;
        }

        configurationProcess.sendBaseMessage();
    }
}

module.exports = new ConfigureTicketsButtonHandler();