var appId = 5016390;
var VK = require('./vk');

module.exports = {
    getLinkForAuth: function () {
        return ['https://oauth.vk.com/authorize?client_id=', appId,
            '&display=page&scope=audio&response_type=token&v=5.35'].join('');
    },

    create: function (accessToken, userId) {
        return VK(accessToken, appId, userId);
    }
};