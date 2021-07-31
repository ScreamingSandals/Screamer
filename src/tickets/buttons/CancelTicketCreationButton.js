const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class CancelTicketCreationButton extends Button {
    get interactionName() {
        return "supportv2_cancel";
    }

    get label() {
        return Messages.CANCEL;
    }

    get color() {
        return "DANGER";
    }
}

module.exports = new CancelTicketCreationButton();