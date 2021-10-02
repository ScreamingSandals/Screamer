const Command = require('../../commands/Command');
const Messages = require('../../Messages');
const SnipeStorage = require('../SnipeStorage');
const {
    MessageEmbed
} = require("discord.js");

const formatEmoji = (emoji) => {
    return !emoji.id || emoji.available
        ? emoji.toString() // bot has access or unicode emoji
        : `[:${emoji.name}:](${emoji.url})`; // bot cannot use the emoji
};

class ReactionSnipeCommand extends Command {

    get commandStructure() {
        return {
            name: this.commandName,
            description: Messages.REACTION_SNIPE_DESC,
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
        return "reactionsnipe";
    }

    async handle(interaction) {
        const channel = interaction.options.getChannel("channel") || interaction.channel;

        const snipe = await SnipeStorage.getReactionSnipe(channel.id);

        await interaction.reply(
            snipe
                ? {
                    embeds: [
                        new MessageEmbed()
                            .setDescription(Messages.REACTED_WITH.replace("${emoji}", formatEmoji(snipe.emoji)).replace("${message}", snipe.messageUrl))
                            .setAuthor(snipe.author.tag)
                            .setFooter(`#${channel.name}`)
                            .setTimestamp(snipe.timestamp),
                    ],
                }
                : Messages.NOTHING_TO_SNIPE
        );
    }
}

module.exports = new ReactionSnipeCommand();