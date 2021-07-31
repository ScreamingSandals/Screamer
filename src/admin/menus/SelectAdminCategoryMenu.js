const Menu = require('../../menus/Menu');
const Messages = require('../../Messages');

class SelectAdminCategoryMenu extends Menu {

    async handle(interaction) {
        switch (interaction.values[0]) {
            case "admin_tickets_category":
                interaction.reply({
                    content: 'Under construction.',
                    ephemeral: true
                });
                break;
        }
    }

    get interactionName() {
        return "admin_select_category";
    }

    get options() {
        return [
            {
                value: "admin_tickets_category",
                label: Messages.ADMIN_CATEGORY_TICKETS,
                description: Messages.ADMIN_CATEGORY_TICKETS_DESCRIPTION,
                emoji: "\uD83D\uDCE9"
            }
        ];
    }
}

module.exports = new SelectAdminCategoryMenu();