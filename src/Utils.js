const {
    MessageButton,
    MessageActionRow,
    Util
} = require('discord.js');

class Utils extends null {
    /**
     *
     * @param {string} label
     * @param {string} url
     * @return {MessageButton}
     */
    static link(label, url) {
        return new MessageButton({
            style: "LINK",
            label: label,
            url: url
        })
    }

    /**
     *
     * @param {string} label
     * @param {string} url
     * @return {MessageActionRow}
     */
    static linkSingle(label, url) {
        return new MessageActionRow({
            components: [
                Utils.link(label, url)
            ]
        });
    }

    /**
     *
     * @param {number} ticketNumber
     * @param {string} creatorId
     * @return {string}
     */
    static generateThreadSecretCode(ticketNumber, creatorId) {
        return "tsc:" + ticketNumber + ":" + Utils.minifySnowflake(creatorId)
    }

    /**
     *
     * @param {string} tsc
     * @return {{ticketNumber: number, creatorId: string}}
     */
    static readThreadSecretCode(tsc) {
        let split = tsc.split(':')
        return {
            ticketNumber: parseInt(split[1]),
            creatorId: Utils.unminifySnowflake(split[2])
        }
    }

    /**
     *
     * @param {string} snowflake
     * @return {string}
     */
    static minifySnowflake(snowflake) {
        let bin = Util.idToBinary(snowflake).toString(2).padStart(64, '0');
        let nums = bin.match(/.{16}/g).map(val => parseInt(val, 2));
        let buf = Buffer.alloc(8);
        for (let i = 0; i < 4; i++) {
            buf.writeUInt16BE(nums[i], i*2);
        }
        return buf.toString('base64').replaceAll('=', '');
    }

    /**
     *
     * @param {string} minified
     * @return {string}
     */
    static unminifySnowflake(minified) {
        let buf = Buffer.from(minified, 'base64');
        /**
         *
         * @type {number[]}
         */
        let nums = [];
        for (let i = 0; i < 8; i+= 2) {
            nums.push(buf.readUInt16BE(i));
        }
        return Util.binaryToId(nums.map(val => val.toString(2).padStart(16, '0')).join(''));
    }
}

module.exports = Utils;