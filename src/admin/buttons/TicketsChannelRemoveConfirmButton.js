const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class TicketsChannelRemoveConfirmButton extends Button {

    get interactionName() {
        return "admin_ticket_confirm_remove";
    }

    get label() {
        return Messages.REMOVE_TICKET_CHANNEL;
    }

    get color() {
        return "DANGER";
    }
}

module.exports = new TicketsChannelRemoveConfirmButton();