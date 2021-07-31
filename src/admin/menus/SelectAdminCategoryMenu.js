const Menu = require('../../menus/Menu');
const Messages = require('../../Messages');

class SelectAdminCategoryMenu extends Menu {

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