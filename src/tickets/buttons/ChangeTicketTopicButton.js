const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class ChangeTicketTopicButton extends Button {
    get interactionName() {
        return "supportv2_change";
    }

    get label() {
        return Messages.CHANGE_TOPIC;
    }
}

module.exports = new ChangeTicketTopicButton();