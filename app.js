var VK = require('./vk');
var GMusicImport = require('./gmusic_import');
var stdin = process.openStdin();
var url = require('url');
var gMusicConfig = require('./config.js');

console.log();
console.log(VK.getLinkForAuth());
console.log();
console.log('Open the link above in browser, authorize and paste here a link on which you were redirected: ');


stdin.addListener("data", function (d) {
  var link = d.toString().substring(0, d.length - 1);
  var hashArr = url.parse(link).hash.split('&');
  var accessToken = getUrlParamVal(hashArr[0]);
  var userId = parseInt(getUrlParamVal(hashArr.slice(-1)[0]));
  var gImport;

  var vk = VK.create(accessToken, userId);
  GMusicImport.authorization(gMusicConfig)
    .then(function (obj) {
      gImport = obj;
      return vk.getUserMusic();
    })
    .then(function (musicArr) {
      return gImport.importMusic(musicArr);
    })
    .then(function () {
      console.log('Done!');
    })
    .catch(console.error)
    .finally(function () {
      process.exit(0);
    })
});


function getLastElem(separator, arr) {
  return arr.split(separator).slice(-1)[0];
}
var getUrlParamVal = getLastElem.bind(this, '=');
