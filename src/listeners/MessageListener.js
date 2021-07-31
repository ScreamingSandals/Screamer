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
                }
            }

            if (await ChannelConfigurationManager.hasChannel(message.guild.id, message.channel.id)) {
                let action = TempActions.getTempActionOrNull(message.author.id, message.guild.id, message.channel.id);
                if (action != null) {
                    action.line = message.content;
                    await message.delete();
                    action.interaction.editReply({
                        content: Messages.TOPIC_CHOSEN + "\n```\n" + action.line + "\n```",
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