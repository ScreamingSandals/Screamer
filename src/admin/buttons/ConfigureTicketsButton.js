const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class ConfigureTicketsButton extends Button {
    get interactionName() {
        return "admin_configure_tickets";
    }

    get label() {
        return Messages.CONFIGURE;
    }

    get color() {
        return "SUCCESS";
    }
}

module.exports = new ConfigureTicketsButton();