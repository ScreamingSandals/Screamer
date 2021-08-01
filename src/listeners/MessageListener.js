const Listener = require('./Listener');
const BruhInteractionHandler = require('../buttons/BruhButton');
const ConfirmTicketCreationInteractionHandler = require('../tickets/buttons/ConfirmTicketCreationButton');
const ChangeInteractionHandler = require('../tickets/buttons/ChangeTicketTopicButton');
const CancelInteractionHandler = require('../tickets/buttons/CancelTicketCreationButton');
const TempActions = require('../tickets/TempActions');
const Messages = require('../Messages');
const {
    MessageActionRow
} = require("discord.js");
const ChannelConfigurationManager = require('../database/ChannelConfigurationManager');
const Constants = require("../Constants");
const CommandsManager = require('../commands/CommandsManager');
const TicketConfigurationProcessCache = require('../cache/TicketConfigurationProcessCache');
const TicketsCancelChannelRemoveButton = require('../admin/buttons/TicketsCancelChannelRemoveButton');
const TicketsChannelRemoveConfirmButton = require('../admin/buttons/TicketsChannelRemoveConfirmButton');

class MessageListener extends Listener {
    register(client) {
        client.on('messageCreate', async (message) => {
            if (message.author.id === client.user.id) {
                if (message.type === "THREAD_CREATED" && await ChannelConfigurationManager.hasChannel(message.guild.id, message.channel.id)) {
                    message.delete();
                }
                return; // ignore
            }

            let c = TicketConfigurationProcessCache.getTempActionOrNull(message.author.id, message.guild.id, message.channel.id);
            if (c) {
                switch (c.chatAction) {
                    case "TITLE":
                        c.title = message.content;
                        c.chatAction = null;
                        c.sendBaseMessage();
                        message.delete();
                        return;
                    case "DESCRIPTION":
                        c.description = message.content;
                        c.chatAction = null;
                        c.sendBaseMessage();
                        message.delete();
                        return;
                    case "COUNTER":
                        if (message.content === 'null') {
                            c.moveCounter = null;
                        } else if (isNaN(message.content.trim())) {
                            c.interaction.editReply({
                                content: Messages.NAN + '\n\n' + Messages.MOVE_COUNTER_
                            });
                            message.delete();
                            return;
                        } else {
                            c.moveCounter = parseInt(message.content);
                        }
                        c.chatAction = null;
                        c.sendBaseMessage();
                        message.delete();
                        return;
                    case "INFO":
                        if (message.content === 'null') {
                            c.infoChannelId = null;
                        } else if (!message.mentions.channels.first()) {
                            c.interaction.editReply({
                                content: Messages.NO_CHANNEL_ERR + '\n\n' + Messages.CHANGE_INFO_CHANNEL
                            });
                            message.delete();
                            return;
                        } else {
                            c.infoChannelId = message.mentions.channels.first().id;
                        }
                        c.chatAction = null;
                        c.sendBaseMessage();
                        message.delete();
                        return;
                    case "REMOVE":
                        c.chatAction = null;
                        if (message.content === Messages.DANGER_MESSAGE) {
                            c.interaction.editReply({
                                content: Messages.REMOVE_TICKET_CHANNEL_WARN,
                                components: [
                                    new MessageActionRow({
                                        components: [
                                            TicketsChannelRemoveConfirmButton.button,
                                            TicketsCancelChannelRemoveButton.button
                                        ]
                                    })
                                ]
                            });
                        } else {
                            c.sendBaseMessage();
                        }
                        message.delete();
                        return;
                }
            }

            if (await ChannelConfigurationManager.hasChannel(message.guild.id, message.channel.id)) {
                let action = TempActions.getTempActionOrNull(message.author.id, message.guild.id, message.channel.id);
                if (action != null) {
                    let attachments = message.attachments.map(val => val);
                    await message.delete();
                    if (message.content.length > 1500) {
                        action.interaction.editReply({
                            content: Messages.REACHED_MAX_1500_CHARS.replace("${count}", message.content.length) + '\n\n' + Messages.WRITE_TOPIC
                        });
                        return;
                    }
                    action.line = message.content;
                    action.attachments = attachments;
                    action.interaction.editReply({
                        content: Messages.TOPIC_CHOSEN + "\n```\n" + action.line + "\n```" + (action.attachments.length > 0 ? ("\n" + Messages.UPLOADED_ATTACHMENTS.replaceAll('${count}', action.attachments.length)) : ''),
                        components: [
                            new MessageActionRow({
                                components: [
                                    ConfirmTicketCreationInteractionHandler.button,
                                    ChangeInteractionHandler.button,
                                    CancelInteractionHandler.button
                                ]
                            })
                        ]
                    })
                } else {
                    await message.delete();
                    let msg = await message.channel.send({
                        content: Messages.DONT_CHAT.replace("${author}", "<@" + message.author.id + ">")
                    });
                    msg.delete({
                        timeout: 3000
                    });
                }
                return;
            }

            if (message.mentions.has(client.user)) {
                if (message.content.toLowerCase().trim().includes('deploy commands in this guild') && message.member.permissions.has("ADMINISTRATOR")) {
                    let result = await CommandsManager.deploy(client, message.guild.id);
                    if (result) {
                        message.reply({
                            content: "Deployed."
                        });
                    } else {
                        message.reply({
                            content: "Deployment failed."
                        });
                    }
                    return;
                }

                if (message.content.toLowerCase().trim().includes('deploy commands globally') && message.author.id === Constants.MISAT) {
                    let result = await CommandsManager.deploy(client);
                    if (result) {
                        message.reply({
                            content: "Deployed."
                        });
                    } else {
                        message.reply({
                            content: "Deployment failed."
                        });
                    }
                    return;
                }
            }

            if (BruhInteractionHandler.bruhGuildId === message.guild.id && message.content.toLowerCase().trim() === "pls be bruh button here") {
                message.channel.send({
                    content: 'Here',
                    components: [
                        BruhInteractionHandler.rowSingleButton
                    ]
                });
            }
        });
    }
}

module.exports = MessageListener;