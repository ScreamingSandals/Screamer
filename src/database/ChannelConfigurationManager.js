const ChannelConfiguration = require('./ChannelConfiguration');

/**
 *
 * @type {?Database}
 * @private
 */
let _db = null;
/**
 *
 * @type {ChannelConfiguration[]}
 * @private
 */
let _channels = [];

class ChannelConfigurationManager extends null {

    /**
     *
     * @param {Database} db
     * @param {ChannelConfiguration[]} channels
     * @package
     */
    static putLoadedData(db, channels) {
        _db = db;
        _channels = channels;
    }

    /**
     *
     * @return {ChannelConfiguration[]}
     */
    static getAllChannels() {
        return [..._channels];
    }

    /**
     *
     * @param {string} guildId
     * @param {string} channelId
     * @return {Promise<boolean>}
     */
    static async hasChannel(guildId, channelId) {
        return (await ChannelConfigurationManager.getChannel(guildId, channelId)) != null;
    }

    /**
     *
     * @param {string} guildId
     * @param {string} channelId
     * @return {Promise<?ChannelConfiguration>}
     */
    static async getChannel(guildId, channelId) {
        return _channels.find(value => value.guildId === guildId && value.channelId === channelId);
    }

    /**
     *
     * @param {string} guildId
     * @param {string} channelId
     * @return {Promise<ChannelConfiguration>}
     */
    static async createChannel(guildId, channelId) {
        if ((await ChannelConfigurationManager.getChannel(guildId, channelId)) != null) {
            throw "Channel " + channelId + " (in guild " + guildId + ") is already registered!";
        }
        let channel = new ChannelConfiguration(
            _db,
            guildId,
            channelId
        );
        await _db.channels.create({
            guildPlusChannelId: channel.guildId + "/" + channel.channelId,
        });
        _channels.push(channel);
        return channel;
    }

    /**
     *
     * @param {ChannelConfiguration} channelConfiguration
     */
    static async dropChannel(channelConfiguration) {
        let index = _channels.indexOf(channelConfiguration);
        if (index > -1) {
            _channels.splice(index, 1);
            await _db.channels.destroy({
                where: {
                    guildPlusChannelId: channelConfiguration.guildId + "/" + channelConfiguration.channelId
                }
            });
        }
    }
}

module.exports = ChannelConfigurationManager;