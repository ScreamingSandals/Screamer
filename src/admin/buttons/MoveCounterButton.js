const Button = require('../../buttons/Button');
const Messages = require("../../Messages");

class MoveCounterButton extends Button {

    get interactionName() {
        return "admin_ticket_move_counter";
    }

    get label() {
        return Messages.MOVE_COUNTER;
    }
}

module.exports = new MoveCounterButton();