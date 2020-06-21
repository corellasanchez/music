const fs = require("fs");
const find = require("find");
const { shell } = require("electron");
const axios = require('axios');
const ipstackKey = '473380cc64a454c9e5d5c6377eeb6bc7';


export const mixins = {
  methods: {
    async indexFolder(folder) {
      var files = await this.getDirectoryFiles(folder);
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
    getDirectoryFiles(folder, includeImages) {
      return new Promise((resolve, reject) => {
        // console.log("Buscando archivos");
        var filesToInclude = '';
        var cleanFiles;

        if (includeImages) {
          filesToInclude = /^.*\.(mp4|mp3|webm|ogg|3gp|mpeg|jpeg|png|gif|jpg|svg)$/i;
        }
        else {
          filesToInclude = /^.*\.(mp4|mp3|webm|ogg|3gp|mpeg|mkv)$/i;
        }

        find
          .file(new RegExp(filesToInclude), folder, function (files) {
            cleanFiles = files.map(function (x) {
              return x.replace(folder, "");
            });
            cleanFiles = cleanFiles.filter(file => !file.startsWith("\\.")); // remove hidden files
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