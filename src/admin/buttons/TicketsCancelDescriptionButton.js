const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class TicketsCancelDescriptionButton extends Button {

    get interactionName() {
        return "admin_ticket_cancel_description";
    }

    get label() {
        return Messages.CANCEL;
    }

    get color() {
        return "DANGER";
    }
}

module.exports = new TicketsCancelDescriptionButton();