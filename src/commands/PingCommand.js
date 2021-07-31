const Command = require('./Command');
const Messages = require('../Messages');

class PingCommand extends Command {

    get commandStructure() {
        return {
            name: this.commandName,
            description: Messages.PONG,
            defaultPermission: true
        };
    }

    get commandName() {
        return "ping";
    }

    async handle(interaction) {
        interaction.reply({
            content: Messages.PONG
        })
    }
}

module.exports = new PingCommand();