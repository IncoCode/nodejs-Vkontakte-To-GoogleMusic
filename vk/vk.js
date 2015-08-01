var request = require('request');
var Promise = require('bluebird');

module.exports = function VK(accessToken, appId, userId) {
    return {
        getUserMusic: function (count) {
            if (!count)
                count = 6000;
            return new Promise(function (resolve, reject) {
                var url = ['https://api.vk.com/method/audio.get?user_id=', userId,
                    '&v=5.35&access_token=', accessToken, '&count=', count, '&lang=en']
                    .join('');
                request(url, function (err, response, body) {
                    if (!err && response.statusCode == 200) {
                        var obj = JSON.parse(body);
                        return resolve(obj.response.items);
                    }
                    reject(err);
                })
            })
        }
    }
};