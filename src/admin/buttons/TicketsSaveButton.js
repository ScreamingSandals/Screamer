const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class TicketsSaveButton extends Button {

    get interactionName() {
        return "admin_ticket_save";
    }

    get label() {
        return Messages.SAVE;
    }

    get color() {
        return "SUCCESS";
    }
}

module.exports = new TicketsSaveButton();