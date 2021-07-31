const Command = require('../../commands/Command');
const Messages = require('../../Messages');
const SelectAdminCategoryMenu = require('../menus/SelectAdminCategoryMenu');

class AdminCommand extends Command {

    get commandStructure() {
        return {
            name: this.commandName,
            description: Messages.COMMAND_ADMIN_DESCRIPTION,
            defaultPermission: true
        };
    }

    get commandName() {
        return "admin";
    }

    async handle(interaction) {
        if (interaction.member.permissions.has("ADMINISTRATOR")) {
            interaction.reply({
                content: Messages.COMMAND_ADMIN,
                components: [
                    SelectAdminCategoryMenu.rowSingleMenu
                ],
                ephemeral: true
            })
        } else {
            interaction.reply({
                ephemeral: true,
                content: Messages.YOU_NEED_TO_BE_ADMIN
            });
        }
    }
}

module.exports = new AdminCommand();