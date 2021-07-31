const {
    Client
} = require('discord.js');

class Listener {
    /**
     * @abstract
     * @param {Client} client
     */
    register(client) {}
}


module.exports = Listener;