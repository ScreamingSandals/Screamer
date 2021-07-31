const Button = require('../../buttons/Button');
const Messages = require("../../Messages");

class TicketsChangeTitleButton extends Button {

    get interactionName() {
        return "admin_ticket_change_title";
    }

    get label() {
        return Messages.CHANGE_TITLE;
    }
}

module.exports = new TicketsChangeTitleButton();