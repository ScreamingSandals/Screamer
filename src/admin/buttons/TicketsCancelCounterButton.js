const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class TicketsCancelCounterButton extends Button {

    get interactionName() {
        return "admin_ticket_cancel_counter";
    }

    get label() {
        return Messages.CANCEL;
    }

    get color() {
        return "DANGER";
    }
}

module.exports = new TicketsCancelCounterButton();