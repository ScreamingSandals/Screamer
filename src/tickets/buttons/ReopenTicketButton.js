const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class ReopenTicketButton extends Button {
    get interactionName() {
        return "supportv2_reopen";
    }

    get label() {
        return Messages.REOPEN;
    }
}

module.exports = new ReopenTicketButton();