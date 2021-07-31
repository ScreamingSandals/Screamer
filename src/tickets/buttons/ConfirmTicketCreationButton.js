const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class ConfirmTicketCreationButton extends Button {
    get interactionName() {
        return "supportv2_start2";
    }

    get color() {
        return "SUCCESS";
    }

    get label() {
        return Messages.CREATE_CONFIRM;
    }
}

module.exports = new ConfirmTicketCreationButton();