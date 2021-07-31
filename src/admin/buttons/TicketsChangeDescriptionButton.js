const Button = require('../../buttons/Button');
const Messages = require("../../Messages");

class TicketsChangeDescriptionButton extends Button {

    get interactionName() {
        return "admin_ticket_change_description";
    }

    get label() {
        return Messages.CHANGE_DESCRIPTION;
    }
}

module.exports = new TicketsChangeDescriptionButton();