const version = require('project-version');
const ButtonHandler = require('../../buttons/ButtonHandler');
const CloseTicketButton = require('./CloseTicketButton');
const Messages = require('../../Messages');
const {
    MessageEmbed
} = require("discord.js");
const Utils = require("../../Utils");
const ReopenTicketButton = require('./ReopenTicketButton');

class ReopenTicketButtonHandler extends ButtonHandler {
    get button() {
        return ReopenTicketButton;
    }

    async handle(interaction) {
        if (interaction.channel == null) {
            // I have no idea how to obtain the thread object
            return;
        }

        if (interaction.channel.isThread) {
            let msg = interaction.message;
            let creatorId;
            let tsc
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

            await interaction.channel.setArchived(false, "Reopened").then(value => {
                interaction.channel.send({
                    content: Messages.OPENED.replace("${user}", "<@" + interaction.user.id + ">")
                });
                interaction.message.edit({
                    embeds: [
                        new MessageEmbed({
                            color: "GREEN",
                            title: interaction.channel.name.substr(interaction.channel.name.indexOf("]") + 2),
                            description: Messages.THREAD_FIRST_MESSAGE.replace("${creator}", "<@" + creatorId + ">"),
                            timestamp: msg.embeds[0].timestamp,
                            footer: {
                                text: 'Screamer v' + version + ' ' + tsc[1]
                            }
                        })
                    ],
                    components: [
                        CloseTicketButton.rowSingleButton
                    ]
                });
            });
        }
    }
}

module.exports = new ReopenTicketButtonHandler();