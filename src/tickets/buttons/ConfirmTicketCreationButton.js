const version = require('project-version');
const Button = require('../../buttons/Button');
const CloseTicketInteractionHandler = require('./CloseTicketInteractionHandler');
const ChannelConfigurationManager = require('../../database/ChannelConfigurationManager');
const Messages = require('../../Messages');
const {
    MessageButtonStyles,
    MessageEmbed
} = require('discord.js');
const TempActions = require("../TempActions");
const Utils = require('../../Utils');

class ConfirmTicketCreationButton extends Button {
    async handle(interaction) {
        let action = TempActions.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);
        let channelConfiguration = await ChannelConfigurationManager.getChannel(interaction.guildId, interaction.channelId);
        if (action != null && channelConfiguration != null) {
            interaction.deferUpdate();
            TempActions.removeTempAction(action);

            let number = await channelConfiguration.getAndIncrementCounter();
            let title = action.line;
            let thread = await interaction.channel.threads.create({
                name: '[' + number + '] ' + title,
                reason: 'Ticket [' + number + '] created by ' + interaction.user.username + ' using ScreamingBot',
                autoArchiveDuration: 1440
            });
            await thread.members.add(interaction.user.id);

            await action.interaction.editReply({
                content: Messages.TICKET_CREATED.replace("${number}", number),
                components: [
                    Utils.linkSingle(Messages.OPEN_TICKET, "https://discord.com/channels/" + interaction.guild.id + "/" + thread.id)
                ]
            });

            if (channelConfiguration.infoChannelId != null) {
                let infoChannel = interaction.guild.channels.resolve(channelConfiguration.infoChannelId);
                if (infoChannel != null && infoChannel.isText) {
                    infoChannel.send({
                        content: Messages.TICKET_CREATED_LOG
                            .replace("${number}", number)
                            .replace("${tag}", interaction.user.tag)
                            .replace("${title}", title),
                        components: [
                            Utils.linkSingle(Messages.OPEN_TICKET, "https://discord.com/channels/" + interaction.guild.id + "/" + thread.id)
                        ]
                    });
                }
            }


            thread.send({
                embeds: [
                    new MessageEmbed({
                        color: "GREEN",
                        title: title,
                        description: Messages.THREAD_FIRST_MESSAGE.replace("${creator}", "<@" + interaction.user.id + ">"),
                        timestamp: Date.now(),
                        footer: {
                            text: 'Screamer v' + version + ' ' + Utils.generateThreadSecretCode(number, interaction.user.id)
                        }
                    })
                ],
                components: [
                    CloseTicketInteractionHandler.rowSingleButton
                ]
            });
        }
    }

    get interactionName() {
        return "supportv2_start2";
    }

    get color() {
        return MessageButtonStyles.SUCCESS;
    }

    get label() {
        return Messages.CREATE_CONFIRM;
    }
}

module.exports = new ConfirmTicketCreationButton();