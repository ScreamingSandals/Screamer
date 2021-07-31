const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class TicketsCancelButton extends Button {

    get interactionName() {
        return "admin_ticket_cancel";
    }

    get label() {
        return Messages.CANCEL;
    }

    get color() {
        return "DANGER";
    }
}

module.exports = new TicketsCancelButton();