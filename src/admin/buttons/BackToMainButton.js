const Button = require('../../buttons/Button');
const Messages = require('../../Messages');

class BackToMainButton extends Button {
    get interactionName() {
        return "admin_back_to_main";
    }

    get label() {
        return Messages.BACK;
    }
}

module.exports = new BackToMainButton();