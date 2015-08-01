var GMusicImport = require('./gmusic_import');

module.exports = {
    authorization: function (config) {
        return GMusicImport(config.email, config.password,
            config.androidId ? config.androidId : null,
            config.tryConvertToEn ? config.tryConvertToEn : null);
    }
};