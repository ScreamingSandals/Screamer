const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");
const Messages = require("../../Messages");
const TicketsChannelRemoveConfirmButton = require("./TicketsChannelRemoveConfirmButton");
const TempActions = require('../../tickets/TempActions');
const ChannelConfigurationManager = require('../../database/ChannelConfigurationManager');
const TicketsCancelChannelRemoveButton = require('./TicketsCancelChannelRemoveButton');
const {
    MessageActionRow
} = require("discord.js");

class TicketsChannelRemoveConfirmButtonHandler extends ButtonHandler {

    get button() {
        return TicketsChannelRemoveConfirmButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        let ticketConfigurationProcess = TicketConfigurationProcessCache.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);

        if (ticketConfigurationProcess) {
            let channelConfiguration = await ChannelConfigurationManager.getChannel(interaction.guildId, interaction.channelId);
            if (!channelConfiguration) {
                return;
            }

            interaction.deferUpdate();

            TicketConfigurationProcessCache.removeTempAction(ticketConfigurationProcess);
            TempActions.getAllInChannel(interaction.guildId, interaction.channelId).forEach(value =>
                TempActions.removeTempAction(value)
            );
            await ChannelConfigurationManager.dropChannel(channelConfiguration);

            interaction.channel.messages.fetch().then(value => {
                let msg = value.find(msg => msg.author.id === interaction.client.user.id && msg.embeds.length > 0 && msg.embeds[0].footer.text.includes("ticketWelcome"));
                if (msg) {
                    msg.delete();
                }
            });

            ticketConfigurationProcess.interaction.editReply({
                content: Messages.TICKET_CHANNEL_REMOVED,
                components: [
                    new MessageActionRow({
                        components: [
                            TicketsCancelChannelRemoveButton.button.setDisabled(true)
                        ]
                    })
                ]
            });
        }
    }
}

module.exports = new TicketsChannelRemoveConfirmButtonHandler();