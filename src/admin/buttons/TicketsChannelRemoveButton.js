const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class TicketsChannelRemoveButton extends Button {

    get interactionName() {
        return "admin_ticket_remove";
    }

    get label() {
        return Messages.REMOVE_TICKET_CHANNEL;
    }

    get color() {
        return "DANGER";
    }
}

module.exports = new TicketsChannelRemoveButton();