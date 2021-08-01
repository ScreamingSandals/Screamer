const version = require('project-version');
const ButtonHandler = require('../../buttons/ButtonHandler');
const CloseTicketButton = require('./CloseTicketButton');
const ChannelConfigurationManager = require('../../database/ChannelConfigurationManager');
const Messages = require('../../Messages');
const {
    MessageEmbed
} = require('discord.js');
const TempActions = require("../TempActions");
const Utils = require('../../Utils');
const ConfirmTicketCreationButton = require('./ConfirmTicketCreationButton');

class ConfirmTicketCreationButtonHandler extends ButtonHandler {
    get button() {
        return ConfirmTicketCreationButton;
    }

    async handle(interaction) {
        let action = TempActions.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);
        let channelConfiguration = await ChannelConfigurationManager.getChannel(interaction.guildId, interaction.channelId);
        if (action != null && channelConfiguration != null) {
            interaction.deferUpdate();
            TempActions.removeTempAction(action);

            let number = await channelConfiguration.getAndIncrementCounter();
            let title = action.line;
            let realTitle = '[' + number + '] ' + title;
            if (realTitle.length > 100) {
                realTitle = realTitle.substring(0, 97) + '...';
            }
            let thread = await interaction.channel.threads.create({
                name: realTitle,
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

            if (title.length > 100) {
                await thread.send({
                    embeds: [
                        new MessageEmbed({
                            color: "GREEN",
                            title: realTitle.substr(realTitle.indexOf("]") + 2),
                            description: Messages.THREAD_FIRST_MESSAGE.replace("${creator}", "<@" + interaction.user.id + ">"),
                            timestamp: Date.now(),
                            footer: {
                                text: 'Screamer v' + version + ' ' + Utils.generateThreadSecretCode(number, interaction.user.id)
                            }
                        })
                    ],
                    components: [
                        CloseTicketButton.rowSingleButton
                    ]
                });
                await thread.send({
                    embeds: [
                        new MessageEmbed({
                            title: Messages.TICKET_DESCRIPTION,
                            description: title,
                            footer: {
                                text: 'Screamer v' + version
                            }
                        })
                    ]
                })
            } else {
                await thread.send({
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
                        CloseTicketButton.rowSingleButton
                    ]
                });
            }

            if (action.attachments.length > 0) {
                await thread.send({
                    files: action.attachments
                });
            }
        }
    }
}

module.exports = new ConfirmTicketCreationButtonHandler();