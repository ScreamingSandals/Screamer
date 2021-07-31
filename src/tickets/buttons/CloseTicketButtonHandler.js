const version = require('project-version');
const ButtonHandler = require('../../buttons/ButtonHandler');
const ReopenTicketInteractionHandler = require('./ReopenTicketButton');
const Messages = require('../../Messages');
const {
    MessageEmbed
} = require("discord.js");
const Utils = require('../../Utils');
const CloseTicketButton = require('./CloseTicketButton');

class CloseTicketButtonHandler extends ButtonHandler {
    get button() {
        return CloseTicketButton;
    }

    async handle(interaction) {
        if (interaction.channel.isThread) {
            let msg = interaction.message;
            let creatorId;
            let tsc;
            if (msg != null && msg.embeds.length > 0) {
                tsc = msg.embeds[0].footer.text.match(/(tsc:\d+:[A-Za-z0-9+/]+)/i);
                if (tsc) {
                    creatorId = Utils.readThreadSecretCode(tsc[1]).creatorId;
                }
            }

            if (!creatorId) {
                return;
            }

            if (interaction.user.id !== creatorId && !interaction.member.permissionsIn(interaction.channel).has("MANAGE_THREADS")) {
                return;
            }

            interaction.deferUpdate();

            await interaction.channel.send({
                content: Messages.CLOSED.replace("${user}", "<@" + interaction.user.id + ">")
            });
            await interaction.message.edit({
                embeds: [
                    new MessageEmbed({
                        color: "RED",
                        title: interaction.channel.name.substr(interaction.channel.name.indexOf("]") + 2),
                        description: Messages.THREAD_FIRST_MESSAGE_CLOSED
                            .replace("${creator}", "<@" + creatorId + ">")
                            .replace("${date}", new Date().toDateString()),
                        timestamp: msg.embeds[0].timestamp,
                        footer: {
                            text: 'Screamer v' + version + ' ' + tsc
                        }
                    })
                ],
                components: [
                    ReopenTicketInteractionHandler.rowSingleButton
                ]
            });

            await interaction.channel.setArchived(true, "Closed");
        }
    }
}

module.exports = new CloseTicketButtonHandler();