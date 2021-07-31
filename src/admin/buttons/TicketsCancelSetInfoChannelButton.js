const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class TicketsCancelSetInfoChannelButton extends Button {

    get interactionName() {
        return "admin_ticket_cancel_set_info_channel";
    }

    get label() {
        return Messages.CANCEL;
    }

    get color() {
        return "DANGER";
    }
}

module.exports = new TicketsCancelSetInfoChannelButton();