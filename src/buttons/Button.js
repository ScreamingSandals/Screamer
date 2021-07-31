const {
    MessageButton,
    MessageActionRow
} = require('discord.js');

/**
 * @abstract
 */
class Button {
    /**
     * @abstract
     * @return {string}
     */
    get interactionName() {}

    /**
     * @return {string}
     */
    get label() {
        return this.interactionName;
    }

    /**
     * @return {"PRIMARY" | "SECONDARY" | "SUCCESS" | "DANGER" | "LINK"}
     */
    get color() {
        return "SECONDARY";
    }

    /**
     *
     * @return {MessageButton}
     */
    get button() {
        return new MessageButton({
            style: this.color,
            customId: this.interactionName,
            label: this.label
        });
    }

    /**
     *
     * @return {MessageActionRow}
     */
    get rowSingleButton() {
        return new MessageActionRow({
            components: [
                this.button
            ]
        });
    }
}

module.exports = Button;