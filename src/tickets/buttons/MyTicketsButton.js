const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class MyTicketsButton extends Button {
    get interactionName() {
        return "supportv2_my_tickets";
    }

    get label() {
        return Messages.MY_TICKETS;
    }
}

module.exports = new MyTicketsButton();