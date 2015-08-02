var PlayMusic = require('playmusic');
var Promise = require("bluebird");
var sleep = require('sleep');
var dict = require('./dict');
var _ = require('lodash');

var pm = new PlayMusic();
var playlistName = 'VK Music';

function GMusicImport(tryConvertToEn, pm) {
  var convToLat = function (str) {
    return [].map.call(str, function (c) {
      return c in dict ? dict[c] : c;
    }).join('');
  };

  var fixName = function (str) {
    return str.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
  };

  var getTrackInfo = function (songQuery) {
    return new Promise(function (resolve, reject) {
      pm.search(songQuery, 1, function (err, data) {
        if (err) return reject(err);
        var res = null;

        if (data.entries) {
          var trackInfoArr = _.filter(data.entries, function (val) {
            return val.type === '1';
          });
          res = trackInfoArr.length === 0 ? null : trackInfoArr[0];
        }

        console.log(['Track: ', songQuery, ' - ', res ? 'Found' : 'Not found'].join(''));
        resolve(res ? res.track : null);
      })
    })
  };

  return {
    importMusic: function (vkMusicArr) {
      var playlistId;

      return new Promise(function (resolve, reject) {
        pm.addPlayList(playlistName, function (err) {
          if (err) return reject(err);
          resolve();
        })
      })
        .then(function () {
          return new Promise(function (resolve, reject) {
            pm.getPlayLists(function (err, body) {
              if (err) return reject(err);
              resolve(body.data.items);
            })
          })
        })
        .then(function (playlistList) {
          return new Promise(function (resolve, reject) {
            var playlists = playlistList.filter(function (playlist) {
              return playlist.name === playlistName;
            });
            if (playlists.length === 0)
              reject(new Error('Error while trying to create a playlist!'));

            playlistId = playlists[0].id;
            resolve(vkMusicArr);
          })
        })
        .map(function (song) {
          var query = fixName([song.artist, song.title].join(' - ').toLowerCase());
          if (tryConvertToEn)
            query = convToLat(query);

          sleep.sleep(1);

          return getTrackInfo(query);
        }, {concurrency: 1})
        .map(function (track) {
          return new Promise(function (resolve, reject) {
            if (!track)
              return resolve();
            console.log(['Add to the playlist:', track.artist, '-', track.title].join(' '));

            pm.addTrackToPlayList(track.nid, playlistId, function (err) {
              if (err) return reject(err);

              resolve();
            });
            sleep.sleep(1);
          })
        }, {concurrency: 1})

    }
  }
}

module.exports = function (email, password, androidId, tryConvertToEn) {
  var obj = {
    email: email,
    password: password
  };
  if (androidId && androidId !== '')
    obj.androidId = androidId;

  return new Promise(function (resolve, reject) {
    pm.login(obj, function (err, obj) {
      if (err) return reject(err);
      resolve(obj);
    })
  })
    .then(function (obj) {
      return new Promise(function (resolve, reject) {
        pm.init(obj, function () {
          resolve(pm);
        })
      })
    })
    .then(GMusicImport.bind(this, tryConvertToEn))
    .catch(console.error)
};
