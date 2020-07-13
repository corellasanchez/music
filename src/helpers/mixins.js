const fs = require("fs");
const find = require("find");
const { shell } = require("electron");
const axios = require('axios');
const ipstackKey = '473380cc64a454c9e5d5c6377eeb6bc7';


export const mixins = {
  methods: {
    async indexFolder(folder, type) {
      var files = await this.getDirectoryFiles(folder, type);
      //var fileWrited = await this.writeCacheFile(musicFiles, folder);
      return files;
    },
    getFolderStats(folder) {
      fs.stat(folder, (err, stat) => {
        if (stat) {
          // console.log(stat["mtimeMs"]);
        }
      });
    },
    getDirectoryFiles(folder, type) {
      return new Promise((resolve, reject) => {
        var filesToInclude = '';
        var cleanFiles;

        if (type === 'images') {
          filesToInclude = /^.*\.(jpeg|png|gif|jpg|svg)$/i;
        }
        else {
          filesToInclude = /^.*\.(mp4|mp3|webm|ogg|3gp|mpeg|mkv)$/i;
        }

        find
          .file(new RegExp(filesToInclude), folder, function (files) {
            cleanFiles = files.map(function (x) {
              return x.replace(folder, "");
            });
            cleanFiles = cleanFiles.filter(file => !(file.substring(file.lastIndexOf('\\') + 1)).startsWith('.'));// remove hidden files
            resolve(cleanFiles);
          })
          .error(function (err) {
            if (err) {
              reject(err);
            }
          });
      })
    },
    writeCacheFile(files, folder) {
      return new Promise((resolve, reject) => {
        fs.writeFile(
          folder + "/library.json",
          JSON.stringify(files),
          function (err) {
            if (!err) {
              resolve(true);
            } else {
              reject();
            }
          }
        );
      });
    },
    openLicenceSite() {
      shell.openExternal(
        "http://pongalamusic.com"
      );
    },
    getIpInfo() {
      return axios.get('http://api.ipstack.com/check?access_key=' + ipstackKey);
    }
  }
}