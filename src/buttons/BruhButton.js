const Button = require('./Button');
const Constants = require('../Constants');

class BruhButton extends Button {
    async handle(interaction) {
        if (interaction.guildId === this.bruhGuildId) {
            const role = interaction.guild.roles.resolve("869500524611903508");
            await interaction.member.roles.add(role);
            await interaction.deferUpdate();
        }
    }

    get interactionName() {
        return "bruh_button";
    }

    get bruhGuildId() {
        return Constants.SCREAMING_SANDALS_GUILD;
    }

    get color() {
        return "SUCCESS";
    }

    get label() {
        return "bruh";
    }
}

module.exports = new BruhButton();