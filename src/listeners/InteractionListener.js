const Listener = require('./Listener');
const ButtonsManager = require('../buttons/ButtonsManager');
const CommandsManager = require('../commands/CommandsManager');
const MenusManager = require('../menus/MenusManager');

class InteractionListener extends Listener {
    register(client) {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.inGuild()) {
                return; // we are not looking for direct message interactions
            }

            if (interaction.isButton()) {
                await ButtonsManager.handleButton(interaction);
            } else if (interaction.isCommand()) {
                await CommandsManager.handleCommand(interaction);
            } else if (interaction.isSelectMenu()) {
                await MenusManager.handleMenu(interaction);
            }
        });
    }
}

module.exports = InteractionListener;