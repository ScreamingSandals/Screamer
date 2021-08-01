const {
    Interaction,
    MessageEmbed,
    MessageActionRow
} = require('discord.js');
const Messages = require("../Messages");
const TicketsSaveButton = require("../admin/buttons/TicketsSaveButton");
const TicketsChangeTitleButton = require("../admin/buttons/TicketsChangeTitleButton");
const TicketsChangeDescriptionButton = require("../admin/buttons/TicketsChangeDescriptionButton");
const MoveCounterButton = require("../admin/buttons/MoveCounterButton");
const TicketsCancelButton = require("../admin/buttons/TicketsCancelButton");
const TicketsSetInfoChannelButton = require("../admin/buttons/TicketsSetInfoChannelButton");
const TicketsChannelRemoveButton = require('../admin/buttons/TicketsChannelRemoveButton');

class TicketConfigurationProcess {
    /**
     *
     * @param {Interaction} interaction
     * @param {string} userId;
     * @param {string} guildId
     * @param {string} channelId
     * @param {number} expires
     * @param {boolean} existed
     * @param {?string} title
     * @param {?string} description
     * @param {?string} infoChannelId
     */
    constructor(interaction, userId, guildId, channelId, expires, existed, title = null, description = null, infoChannelId = null) {
        this.interaction = interaction;
        this.userId = userId;
        this.guildId = guildId;
        this.channelId = channelId;
        this.expires = expires;
        this.existed = existed;
        this.infoChannelId = infoChannelId;
        this.title = title;
        this.description = description;
        /**
         *
         * @type {null|"TITLE"|"DESCRIPTION"|"COUNTER"|"INFO"|"REMOVE"}
         */
        this.chatAction = null;
        /**
         *
         * @type {?number}
         */
        this.moveCounter = null;
        /**
         *
         * @type {?number}
         * @package
         */
        this.cancelTimeout = null;
    }

    sendBaseMessage() {
        this.interaction.editReply({
            content: Messages.CONFIGURE_TICKET_CHANNEL
                + (this.moveCounter ? ('\n\n' + Messages.COUNTER_WILL_BE_MOVED.replace("${number}", this.moveCounter)) : '')
                + (this.infoChannelId ? ('\n' + Messages.INFO_CHANNEL_IS.replace("${channel}", '<#' + this.infoChannelId + '>')) : ''),
            embeds: [
                new MessageEmbed({
                    title: this.title || Messages.DEFAULT_TICKET_WELCOME_TITLE,
                    description: (this.description || Messages.DEFAULT_TICKET_WELCOME_DESCRIPTION).replace("${channel}", "<#" + this.channelId + ">"),
                    color: "AQUA",
                    footer: {
                        text: Messages.EXPIRES
                    },
                    timestamp: this.expires
                })
            ],
            components: [
                new MessageActionRow({
                    components: [
                        TicketsSaveButton.button,
                        TicketsCancelButton.button
                    ]
                }),
                new MessageActionRow({
                    components: [
                        TicketsChangeTitleButton.button,
                        TicketsChangeDescriptionButton.button,
                        MoveCounterButton.button,
                        TicketsSetInfoChannelButton.button
                    ]
                }),
                new MessageActionRow({
                    components: [
                        TicketsChannelRemoveButton.button.setDisabled(!this.existed)
                    ]
                })
            ]
        });
    }
}

module.exports = TicketConfigurationProcess;