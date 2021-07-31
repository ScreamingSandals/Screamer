module.exports = {
    WRITE_TOPIC: "Now please write the topic of your new ticket in this chat. The topic should describe your problem in just few words.",
    CANCEL: "Cancel",
    CREATE_NEW_TICKET: "Create new ticket",
    MY_TICKETS: "My tickets",
    CHANGE_TOPIC: "Change topic",
    CLOSE: "Close",
    CREATE_CONFIRM: "Create",
    REOPEN: "Reopen",
    ALREADY_STARTED: "You have already started the ticket creation process.",
    CANCELED: "Canceled. Now you can remove this message using the Dismiss message button.",
    DONT_CHAT: "${author} Please don't chat in this channel! Follow the creation ticket process!",
    TOPIC_CHOSEN: "You have chosen this topic:",
    TICKET_CREATED: "New Ticket [${number}] has been successfully created! Use button to open it",
    OPEN_TICKET: "Open ticket",
    TICKET_CREATED_LOG: "User ${tag} created new ticket: [${number}] ${title}",
    THREAD_FIRST_MESSAGE: "Thank you for using our ticket system. While waiting for support, you can provide us the following information to help us understand your problem:\n" +
        "- Provide the latest.log file\n" +
        "- Provide the configuration files if they are changed\n" +
        "- Provide the plugin list\n" +
        "- If any `.yml` files have been changed, use [validator](https://yamlchecker.com/)" +
        "\n\nThis ticket was created by ${creator}", // magic line
    THREAD_FIRST_MESSAGE_CLOSED: "Ticket closed on ${date}" +
        "\n\nThis ticket was created by ${creator}", // magic line
    CLOSED: "${user} closed this ticket",
    OPENED: "${user} opened this ticket",
    NO_TICKETS: "You haven't created any ticket yet!",
    YOUR_TICKETS: "Your tickets",
    DEFAULT_TICKET_WELCOME_TITLE: "Support 2",
    DEFAULT_TICKET_WELCOME_DESCRIPTION: "Welcome to ${channel} channel",
    COMMAND_ADMIN_DESCRIPTION: "Opens administration ephemeral.",
    YOU_NEED_TO_BE_ADMIN: "You need to be an administrator to perform this command.",
    NOTHING_SELECTED: "Nothing selected",
    ADMIN_CATEGORY_TICKETS: "Tickets",
    ADMIN_CATEGORY_TICKETS_DESCRIPTION: "Ticket settings for this channel.",
    COMMAND_ADMIN: "Welcome to the administration. Now please select the administration category. Some of these categories are bound to the channel.",
    CHANNEL_NOT_CONFIGURED_FOR_TICKETS: "This channel is not configured for the ticket system yet. Do it by clicking Configure button.",
    CONFIGURE: "Configure",
    BACK: "Back"
};