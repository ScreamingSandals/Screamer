const Command = require('../../commands/Command');
const Messages = require('../../Messages');
const SnipeStorage = require('../SnipeStorage');
const {
    MessageEmbed
} = require("discord.js");

class SnipeCommand extends Command {

    get commandStructure() {
        return {
            name: this.commandName,
            description: Messages.SNIPE_DESC,
            options: [
                {
                    type: 7, // text channel
                    name: "channel",
                    description: Messages.CHANNEL_TO_SNIPE,
                },
            ],
            defaultPermission: true
        };
    }

    get commandName() {
        return "snipe";
    }

    async handle(interaction) {
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        const snipe = await SnipeStorage.getSnipe(channel.id);

        await interaction.reply(
            snipe
                ? {
                    embeds: [
                        new MessageEmbed()
                            .setDescription(snipe.content)
                            .setAuthor(snipe.author.tag)
                            .setFooter(`#${channel.name}`)
                            .setTimestamp(snipe.timestamp),
                    ],
                }
                : Messages.NOTHING_TO_SNIPE
        );
    }
}

module.exports = new SnipeCommand();