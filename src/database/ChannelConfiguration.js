class ChannelConfiguration {
    /**
     *
     * @param {Database} db
     * @param {string} guildId
     * @param {string} channelId
     * @param {?string} infoChannelId
     * @param {?string} title
     * @param {?string} description
     * @param {number} count
     */
    constructor(db, guildId, channelId, infoChannelId = null, title = null, description = null, count = 1) {
        /** @private */
        this._db = db;
        /** @private */
        this._guildId = guildId;
        /** @private */
        this._channelId = channelId;
        /** @private */
        this._infoChannelId = infoChannelId;
        /** @private */
        this._title = title;
        /** @private */
        this._description = description;
        /** @private */
        this._count = count;
    }

    /**
     * ID of guild
     *
     * @return {string}
     */
    get guildId() {
        return this._guildId;
    }

    /**
     * ID of this channel
     *
     * @return {string}
     */
    get channelId() {
        return this._channelId;
    }

    /**
     * ID of channel that will be used for announcing new ticket. Must be in the same server.
     *
     * @return {?string}
     */
    get infoChannelId() {
        return this._infoChannelId;
    }

    /**
     * Title of the main message in the ticket channel. If not specified then default one is used.
     *
     * @return {?string}
     */
    get title() {
        return this._title;
    }

    /**
     * Content of the main message in the ticket channel. If not specified then default one is used.
     * Placeholder ${channel} adds the channel mention.
     *
     * @return {?string}
     */
    get description() {
        return this._description;
    }

    /**
     * Current position of ticket counter.
     *
     * @return {number}
     */
    get count() {
        return this._count;
    }

    /**
     *
     * @param {?string} infoChannelId
     */
    set infoChannelId(infoChannelId) {
        this._infoChannelId = infoChannelId;

        // update in db
        this._db.channels.update({
                infoChannelId: this.infoChannelId
            },
            {
                where: {
                    guildPlusChannelId: this.guildId + "/" + this.channelId
                }
            })
            .catch(reason => {
                console.log(reason);
            });
    }

    set title(title) {
        this._title = title;

        // update in db
        this._db.channels.update({
                title: this.title
            },
            {
                where: {
                    guildPlusChannelId: this.guildId + "/" + this.channelId
                }
            })
            .catch(reason => {
                console.log(reason);
            });
    }

    setDescription(description) {
        this._description = description;

        // update in db
        this._db.channels.update({
                description: this.description
            },
            {
                where: {
                    guildPlusChannelId: this.guildId + "/" + this.channelId
                }
            })
            .catch(reason => {
                console.log(reason);
            });
    }

    /**
     *
     * @return {Promise<number>}
     */
    async getAndIncrementCounter() {
        this._count++;

        // update in db
        await this._db.channels.update({
                count: this.count
            },
            {
                where: {
                    guildPlusChannelId: this.guildId + "/" + this.channelId
                }
            })
            .catch(reason => {
                console.log(reason);
            });

        return this._count;
    }

}

module.exports = ChannelConfiguration;