const version = require("project-version");
const ButtonHandler = require('../../buttons/ButtonHandler');
const TicketsSaveButton = require('./TicketsSaveButton');
const TicketConfigurationProcessCache = require("../../cache/TicketConfigurationProcessCache");
const ChannelConfigurationManager = require("../../database/ChannelConfigurationManager");
const {
    MessageEmbed,
    MessageActionRow
} = require("discord.js");
const Messages = require("../../Messages");
const CreateTicketInteractionHandler = require("../../tickets/buttons/CreateTicketButton");
const MyTicketsInteractionHandler = require("../../tickets/buttons/MyTicketsButton");
const TicketsCancelButton = require('./TicketsCancelButton');

class TicketsSaveButtonHandler extends ButtonHandler {

    get button() {
        return TicketsSaveButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

        let ticketConfigurationProcess = TicketConfigurationProcessCache.getTempActionOrNull(interaction.user.id, interaction.guildId, interaction.channelId);

        if (ticketConfigurationProcess) {
            interaction.deferUpdate();

            TicketConfigurationProcessCache.removeTempAction(ticketConfigurationProcess);

            let channelConfiguration = await ChannelConfigurationManager.getChannel(ticketConfigurationProcess.guildId, ticketConfigurationProcess.channelId);
            if (channelConfiguration) {
                channelConfiguration.title = ticketConfigurationProcess.title;
                channelConfiguration.description = ticketConfigurationProcess.description;
                if (ticketConfigurationProcess.moveCounter) {
                    channelConfiguration.count = ticketConfigurationProcess.moveCounter;
                }

                interaction.channel.messages.fetch().then(value => {
                    let msg = value.find(msg => msg.author.id === interaction.client.user.id && msg.embeds.length > 0 && msg.embeds[0].footer.text.includes("ticketWelcome"));
                    if (!msg) {
                        interaction.channel.send({
                            embeds: [
                                new MessageEmbed({
                                    color: "AQUA",
                                    title: channelConfiguration.title || Messages.DEFAULT_TICKET_WELCOME_TITLE,
                                    description: (channelConfiguration.description || Messages.DEFAULT_TICKET_WELCOME_DESCRIPTION).replace('${channel}', '<#' + channelConfiguration.channelId + '>'),
                                    footer: {
                                        text: 'Screamer v' + version + ' ticketWelcome'
                                    }
                                })
                            ],
                            components: [
                                new MessageActionRow({
                                    components: [
                                        CreateTicketInteractionHandler.button,
                                        MyTicketsInteractionHandler.button
                                    ]
                                })
                            ]
                        });
                    } else {
                        msg.edit({
                            embeds: [
                                new MessageEmbed({
                                    color: "AQUA",
                                    title: channelConfiguration.title || Messages.DEFAULT_TICKET_WELCOME_TITLE,
                                    description: (channelConfiguration.description || Messages.DEFAULT_TICKET_WELCOME_DESCRIPTION).replace('${channel}', '<#' + channelConfiguration.channelId + '>'),
                                    footer: {
                                        text: 'Screamer v' + version + ' ticketWelcome'
                                    }
                                })
                            ]
                        })
                    }
                });

                ticketConfigurationProcess.interaction.editReply({
                    content: Messages.TICKET_CHANNEL_UPDATED,
                    components: [
                        new MessageActionRow({
                            components: [
                                TicketsCancelButton.button.setDisabled(true)
                            ]
                        })
                    ]
                });
            } else {
                channelConfiguration = await ChannelConfigurationManager.createChannel(ticketConfigurationProcess.guildId, ticketConfigurationProcess.channelId);
                channelConfiguration.title = ticketConfigurationProcess.title;
                channelConfiguration.description = ticketConfigurationProcess.description;
                if (ticketConfigurationProcess.moveCounter) {
                    channelConfiguration.count = ticketConfigurationProcess.moveCounter;
                }

                interaction.channel.send({
                    embeds: [
                        new MessageEmbed({
                            color: "AQUA",
                            title: channelConfiguration.title || Messages.DEFAULT_TICKET_WELCOME_TITLE,
                            description: (channelConfiguration.description || Messages.DEFAULT_TICKET_WELCOME_DESCRIPTION).replace('${channel}', '<#' + channelConfiguration.channelId + '>'),
                            footer: {
                                text: 'Screamer v' + version + ' ticketWelcome'
                            }
                        })
                    ],
                    components: [
                        new MessageActionRow({
                            components: [
                                CreateTicketInteractionHandler.button,
                                MyTicketsInteractionHandler.button
                            ]
                        })
                    ]
                });

                ticketConfigurationProcess.interaction.editReply({
                    content: Messages.TICKET_CHANNEL_CREATED,
                    components: [
                        new MessageActionRow({
                            components: [
                                TicketsCancelButton.button.setDisabled(true)
                            ]
                        })
                    ]
                });
            }
        }
    }
}

module.exports = new TicketsSaveButtonHandler();