const version = require('project-version');

const Listener = require('./Listener');
const MyTicketsInteractionHandler = require('../tickets/buttons/MyTicketsButton');
const CreateTicketInteractionHandler = require('../tickets/buttons/CreateTicketButton');

const {
    MessageEmbed,
    MessageActionRow
} = require('discord.js');
const Messages = require('../Messages');
const ChannelConfigurationManager = require('../database/ChannelConfigurationManager')

class ReadyListener extends Listener {
    register(client) {
        client.on('ready', async (event) => {
            console.log('Ready!');

            let channels = ChannelConfigurationManager.getAllChannels();

            for (let channelConfiguration of channels) {
                let guild = (await event.guilds.fetch(channelConfiguration.guildId));
                let channel = guild.channels.resolve(channelConfiguration.channelId);
                if (channel.isText) {
                    channel.messages.fetch().then(value => {
                        if (value.find(msg => msg.author.id === client.id && msg.embeds.length > 0 && msg.embeds[0].footer.text.includes("ticketWelcome"))) {
                            channel.send({
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
                        }
                    });
                }
            }
        });
    }
}

module.exports = ReadyListener;