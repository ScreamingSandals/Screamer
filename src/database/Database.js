const {
    Sequelize,
    STRING,
    TEXT,
    INTEGER
} = require('sequelize');
const ChannelConfiguration = require('./ChannelConfiguration');
const ChannelConfigurationManager = require('./ChannelConfigurationManager');

class Database {
    /**
     *
     * @param {string} file
     */
    constructor(file) {
        /**
         * Connection to SQLLite database
         *
         * @type {Sequelize}
         */
        this.connection = new Sequelize({
            host: 'localhost',
            dialect: 'sqlite',
            logging: false,
            storage: file
        });

        this.channels = this.connection.define('channels', {
            guildPlusChannelId: { // mixed snowflakes, separated by /
                type: STRING,
                unique: true
            },
            infoChannelId: {
                type: STRING,
                allowNull: true
            },
            title: {
                type: STRING,
                allowNull: true
            },
            description: {
                type: TEXT,
                allowNull: true
            },
            count: {
                type: INTEGER,
                defaultValue: 1
            }
        });
    }

    async loadChannels() {
        await this.channels.sync();
        let results = await this.channels.findAll();
        let channels = [];
        results.forEach(value => {
            let [guildId, channelId] = value.get('guildPlusChannelId').split('/');
            let channel = new ChannelConfiguration(
                this,
                guildId,
                channelId,
                value.get('infoChannelId'),
                value.get('title'),
                value.get('description'),
                value.get('count')
            );
            channels.push(channel);
        });
        ChannelConfigurationManager.putLoadedData(this, channels);
    }
}

module.exports = Database;