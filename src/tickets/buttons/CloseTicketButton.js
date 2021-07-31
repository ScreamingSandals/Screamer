const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class CloseTicketButton extends Button {
    get interactionName() {
        return "supportv2_mark_resolved";
    }

    get label() {
        return Messages.CLOSE;
    }
}

module.exports = new CloseTicketButton();