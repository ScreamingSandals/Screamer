const version = require('project-version');
const Button = require('../../buttons/Button');
const CloseTicketInteractionHandler = require('./CloseTicketInteractionHandler');
const Messages = require('../../Messages');
const {
    MessageEmbed
} = require("discord.js");
const Utils = require("../../Utils");

class ReopenTicketButton extends Button {
    async handle(interaction) {
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
                                text: 'Screamer v' + version + ' ' + tsc
                            }
                        })
                    ],
                    components: [
                        CloseTicketInteractionHandler.rowSingleButton
                    ]
                });
            });
        }
    }

    get interactionName() {
        return "supportv2_reopen";
    }

    get label() {
        return Messages.REOPEN;
    }
}

module.exports = new ReopenTicketButton();