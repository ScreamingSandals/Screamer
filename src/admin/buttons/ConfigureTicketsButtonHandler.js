const ConfigureTicketsButton = require('./ConfigureTicketsButton');
const ButtonHandler = require('../../buttons/ButtonHandler')

class ConfigureTicketsButtonHandler extends ButtonHandler {
    get button() {
        return ConfigureTicketsButton;
    }

    async handle(interaction) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return;
        }

    }
}

module.exports = new ConfigureTicketsButtonHandler();