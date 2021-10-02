const {
    Client
} = require('discord.js')

const Settings = require('./config/Settings');
const Database = require('./database/Database');
const InteractionListener = require('./listeners/InteractionListener');
const MessageListener = require('./listeners/MessageListener');
const ReadyListener = require('./listeners/ReadyListener');
const GuildJoinedListener = require('./listeners/GuildJoinedListener');
const MessageDeleteListener = require('./listeners/MessageDeleteListener');
const MessageUpdateListener = require('./listeners/MessageUpdateListener');
const MessageReactionRemoveListener = require('./listeners/MessageReactionRemoveListener');

const settings = new Settings('settings.json');
const db = new Database('database.sqlite');

db.loadChannels().then(value => {
    const client = new Client({
        intents: [
            "GUILD_MESSAGES",
            "GUILD_MEMBERS",
            "GUILDS",
            "GUILD_INTEGRATIONS",
            "GUILD_MESSAGE_REACTIONS"
        ],
        partials: [
            "CHANNEL",
            "USER",
            "REACTION",
            "MESSAGE"
        ]
    });

    new InteractionListener().register(client);
    new MessageListener().register(client);
    new ReadyListener().register(client);
    new GuildJoinedListener().register(client);
    new MessageDeleteListener().register(client);
    new MessageUpdateListener().register(client);
    new MessageReactionRemoveListener().register(client);

    client.login(settings.token);
});