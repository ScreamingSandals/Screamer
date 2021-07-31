const ButtonHandler = require('../../buttons/ButtonHandler');
const Messages = require('../../Messages');
const ChannelConfigurationManager = require('../../database/ChannelConfigurationManager');
const Utils = require('../../Utils');
const {
    MessageEmbed
} = require("discord.js");
const MyTicketsButton = require('./MyTicketsButton');

class MyTicketsButtonHandler extends ButtonHandler {
    get button() {
        return MyTicketsButton;
    }

    async handle(interaction) {
        if (!await ChannelConfigurationManager.hasChannel(interaction.guildId, interaction.channelId)) {
            return;
        }

        await interaction.defer({ephemeral: true});

        let myThreads = [];

        let threads = (await interaction.channel.threads.fetch()).threads;
        for (let [, thread] of threads) {
            let messages = (await thread.messages.fetch());
            let msg = messages
                .filter(value3 => value3.author.id === interaction.client.user.id && value3.type === "DEFAULT" && value3.embeds.length > 0 && value3.embeds[0].footer.text.includes('tsc:'))
                .last();
            if (msg != null && msg.embeds.length > 0) {
                let tsc = msg.embeds[0].footer.text.match(/(tsc:\d+:[A-Za-z0-9+/]+)/i);
                if (tsc) {
                    let creatorId = Utils.readThreadSecretCode(tsc[1]).creatorId;
                    if (creatorId === interaction.user.id) {
                        myThreads.push(thread);
                    }
                }
            }
        }

        if (myThreads.length > 0) {
            let lines = "";

            myThreads.forEach(value => {
                lines += "[" + value.name + "](https://discord.com/channels/" + interaction.guild.id + "/" + value.id + ") - Created on " + value.createdAt.toDateString() + "\n";
            })

            interaction.editReply({
                embeds: [
                    new MessageEmbed({
                        color: "GREEN",
                        title: Messages.YOUR_TICKETS,
                        description: lines
                    })
                ]
            });
        } else {
            interaction.editReply({
                content: Messages.NO_TICKETS
            });
        }
    }
}

module.exports = new MyTicketsButtonHandler();