module.exports = {
    WRITE_TOPIC: "Now please write the topic of your new ticket in this chat. The topic should describe your problem in just a few words.",
    CANCEL: "Cancel",
    CREATE_NEW_TICKET: "Create new ticket",
    MY_TICKETS: "My tickets",
    CHANGE_TOPIC: "Change topic",
    CLOSE: "Close",
    CREATE_CONFIRM: "Create",
    REOPEN: "Reopen",
    ALREADY_STARTED: "You have already started the ticket creation process.",
    CANCELED: "Cancelled. Now you can remove this message using the 'dismiss' message button.",
    DONT_CHAT: "${author} Please don't chat in this channel! Follow the creation ticket process!",
    TOPIC_CHOSEN: "You have chosen this topic:",
    TICKET_CREATED: "New ticket [${number}] has been successfully created! Use the button to open it.",
    OPEN_TICKET: "Open ticket",
    TICKET_CREATED_LOG: "User ${tag} created a new ticket: [${number}] ${title}",
    THREAD_FIRST_MESSAGE: "Thank you for using our ticket system. While waiting for support, you can provide us the following information to help us understand your problem:\n" +
        "- Provide the latest.log file\n" +
        "- Provide the configuration files if they have been changed\n" +
        "- Provide the plugin list\n" +
        "- If any `.yml` files have been changed, use [a YAML syntax checker](https://yamlchecker.com/)" +
        "\n\nThis ticket was created by ${creator}.", // magic line
    THREAD_FIRST_MESSAGE_CLOSED: "Ticket closed on ${date}" +
        "\n\nThis ticket was created by ${creator}.", // magic line
    CLOSED: "${user} closed this ticket.",
    OPENED: "${user} opened this ticket.",
    NO_TICKETS: "You haven't created any tickets yet!",
    YOUR_TICKETS: "Your tickets",
    DEFAULT_TICKET_WELCOME_TITLE: "Support 2",
    DEFAULT_TICKET_WELCOME_DESCRIPTION: "Welcome to ${channel} channel",
    COMMAND_ADMIN_DESCRIPTION: "Opens the administration ephemeral.",
    YOU_NEED_TO_BE_ADMIN: "You need to be an administrator to perform this command.",
    NOTHING_SELECTED: "Nothing selected",
    ADMIN_CATEGORY_TICKETS: "Tickets",
    ADMIN_CATEGORY_TICKETS_DESCRIPTION: "Ticket settings for this channel.",
    COMMAND_ADMIN: "Welcome to the administration. Now please select the administration category. Some of these categories are bound to a channel.",
    CHANNEL_NOT_CONFIGURED_FOR_TICKETS: "This channel is not configured for the ticket system yet. Do it by clicking Configure button.",
    CONFIGURE: "Configure",
    BACK: "Back",
    CHANGE_DESCRIPTION: "Change description",
    CHANGE_TITLE: "Change title",
    SAVE: "Save",
    MOVE_COUNTER: "Move counter",
    CONFIGURE_TICKET_CHANNEL: "Now configure this ticket channel and then press Save.",
    CHANGE_TITLE_NEW: "Now please write the new `title` of the welcome embed.",
    CHANGE_DESCRIPTION_NEW: "Now please write the new `description` of the welcome embed. `${channel}` will be replaced by ${channelHere}.",
    CHANGE_INFO_CHANNEL: "Now please mention the channel, where you want to receive new ticket announcements or `null` if you want to disable that feature.",
    EXPIRES: "This action expires at",
    MOVE_COUNTER_: "Now write the number of the next ticket or `null` if you want to cancel counter movement.",
    NAN: "**This is not a number!**",
    COUNTER_WILL_BE_MOVED: "Counter will be moved to `${number}`.",
    TICKET_CHANNEL_UPDATED: "Ticket channel updated.  Now you can remove this message using the Dismiss message button.",
    TICKET_CHANNEL_CREATED: "Ticket channel successfully created.  Now you can remove this message using the Dismiss message button.",
    PONG: "Pong!",
    SET_INFO_CHANNEL: "Set info channel",
    NO_CHANNEL_ERR: "**Okay. Try it again and this time actually mention some channel.**",
    INFO_CHANNEL_IS: "Info channel for this ticket channel is ${channel}."
};
