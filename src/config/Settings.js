const fs = require('fs');

class Settings {
    /**
     *
     * @param {fs.PathLike} path
     */
    constructor(path) {
        if (!fs.existsSync(path)) {
            console.log(path + " is not created yet. Creating new one! Please open it and fill in the token");
            fs.writeFileSync(path, JSON.stringify({
                token: "PLEASE_FILL_TOKEN_HERE"
            }))
            process.exit(0);
        }
        let data = JSON.parse(fs.readFileSync(path));
        /** @private */
        this._token = data.token;
    }

    /**
     * Token used to access discord api
     *
     * @return {string}
     */
    get token() {
        return this._token;
    }
}

module.exports = Settings;