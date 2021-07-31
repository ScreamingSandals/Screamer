const ButtonHandler = require('./ButtonHandler');
const BruhButton = require('./BruhButton');
const Constants = require('../Constants');

class BruhButtonHandler extends ButtonHandler {
    get button() {
        return BruhButton;
    }

    async handle(interaction) {
        if (interaction.guildId === Constants.SCREAMING_SANDALS_GUILD) {
            const role = interaction.guild.roles.resolve("869500524611903508");
            await interaction.member.roles.add(role);
            await interaction.deferUpdate();
        }
    }
}

module.exports = new BruhButtonHandler();