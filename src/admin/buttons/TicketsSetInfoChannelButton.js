const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class TicketsSetInfoChannelButton extends Button {

    get interactionName() {
        return "admin_ticket_set_info";
    }

    get label() {
        return Messages.SET_INFO_CHANNEL;
    }
}

module.exports = new TicketsSetInfoChannelButton();