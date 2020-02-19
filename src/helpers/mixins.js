import { mapState } from "vuex";
const fs = require("fs");
const find = require("find");
const { shell } = require("electron");
const fuzz = require('fuzzball');



export const mixins = {
  computed: {
    ...mapState(["musicFiles", "karaokeFiles", "ads"])
  },
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
            resolve(cleanFiles);
          })
          .error(function (err) {
            if (err) {
              reject(err);
            }
          });
      })
    },
    searchSongs(keyword) {
      console.log(this.musicFiles);
      var results = [];

      this.musicFiles.forEach((element, index) => {
        var ratio = fuzz.partial_ratio(element, keyword);
        if (ratio > 70) {
          results.push({ i: index, e: this.clearSongName(element), r: ratio });
        }
      });

      results.sort((a, b) => { return Number(b.r) - Number(a.r) });

      if (results.length > 100) {
        results.length = 100;
      }

      console.log(results);
    },
    clearSongName(name) {
      var clearedName = name.substring(name.lastIndexOf('/') + 1);
      clearedName = clearedName.substr(0, clearedName.lastIndexOf('.'));
      return clearedName;
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
        "https://www.dropbox.com/business/plans-comparison"
      );
    },
  }
}