const Command = require('../../commands/Command');
const Messages = require('../../Messages');
const SnipeStorage = require('../SnipeStorage');
const {
    MessageEmbed
} = require("discord.js");

class EditSnipeCommand extends Command {

    get commandStructure() {
        return {
            name: this.commandName,
            description: Messages.EDIT_SNIPE_DESC,
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
        return "editsnipe";
    }

    async handle(interaction) {
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        const snipe = await SnipeStorage.getEditSnipe(channel.id);

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

module.exports = new EditSnipeCommand();