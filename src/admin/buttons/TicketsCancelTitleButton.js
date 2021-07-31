const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class TicketsCancelTitleButton extends Button {

    get interactionName() {
        return "admin_ticket_cancel_title";
    }

    get label() {
        return Messages.CANCEL;
    }

    get color() {
        return "DANGER";
    }
}

module.exports = new TicketsCancelTitleButton();