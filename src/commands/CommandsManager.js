const {
    CommandInteraction,
    Client
} = require('discord.js');
const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');

/**
 *
 * @type {Command[]}
 */
const handlers = [
    require('../admin/commands/AdminCommand')
];

class CommandsManager extends null {
    /**
     * @param {CommandInteraction} interaction
     */
    static async handleCommand(interaction) {
        let handler = handlers.find(value => value.commandName === interaction.commandName);
        if (handler !== null) {
            try {
                await handler.handle(interaction);
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     *
     * @param {Client} client
     * @param {?string} guildId
     * @return {Promise<boolean>}
     */
    static async deploy(client, guildId = null) {
        const rest = new REST({version: '9'}).setToken(client.token);

        try {
            console.log('Started refreshing application (/) commands');

            let route;
            if (guildId != null) {
                route = Routes.applicationGuildCommands(client.application.id, guildId);
            } else {
                route = Routes.applicationCommands(client.application.id);
            }

            await rest.put(route, {
                body: handlers.map(value => value.commandStructure)
            });

            console.log('Sucessfully reloaded application (/) commands.');
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

module.exports = CommandsManager;