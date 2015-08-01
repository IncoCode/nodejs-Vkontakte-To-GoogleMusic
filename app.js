var VK = require('./vk');
var stdin = process.openStdin();
var url = require('url');

//
console.log();
console.log(VK.getLinkForAuth());
console.log('Open the link above in browser, authorize and paste here a link on which you were redirected: ');


stdin.addListener("data", function (d) {
    var link = d.toString().substring(0, d.length - 1);
    var hashArr = url.parse(link).hash.split('&');
    var accessToken = getUrlParamVal(hashArr[0]);
    var userId = parseInt(getUrlParamVal(hashArr.slice(-1)[0]));

    var vk = VK.create(accessToken, userId);
    vk.getUserMusic()
        .then(function (data) {
            console.log(data);
        })
        .catch(function (err) {
            console.log('Error: ' +err);
        })
});


// functions

function getLastElem(separator, arr) {
    return arr.split(separator).slice(-1)[0];
}
var getUrlParamVal = getLastElem.bind(this, '=');