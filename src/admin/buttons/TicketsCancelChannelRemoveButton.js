const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class TicketsCancelChannelRemoveButton extends Button {

    get interactionName() {
        return "admin_ticket_cancel_remove";
    }

    get label() {
        return Messages.CANCEL;
    }
}

module.exports = new TicketsCancelChannelRemoveButton();