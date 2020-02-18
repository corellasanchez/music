//const settings = require("electron-settings");
import { db } from "../firebase.js";
import { firebase } from "@firebase/app";

const fs = require("fs");
const find = require("find");
//const { dialog } = require("electron").remote;
const key = '4vPmH5s3KomcZH4A90Gm7vPHk7sDTYQl';

var encryptor = require('simple-encryptor')(key);


export const mixins = {
  methods: {
    firestore() {
      return {
        customers: db.collection("customers"),
        licences: db.collection("licences")
      };
    },
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
    // FIREBASE OPERATIONS
    timestamp() {
      return firebase.firestore.Timestamp.now();
    },
    timestampFormat(date) {
      return firebase.firestore.Timestamp.fromDate(date);
    },
    timestampFromMillis(millis) {
      return firebase.firestore.Timestamp.fromMillis(millis);
    },
    async saveCustomerFs(customer) {
      var customerToSave = Object.assign({}, customer);
      customerToSave.password = this.encrypt(customer.password);
      this.firestore().customers.doc(customer.barCode).set(customerToSave);
    },
    getCustomerFs(customer) {
      var customerRef = this.firestore().customers.doc(customer.barCode);
      return customerRef.get();
    },
    getLicenseFs(customer){
      var licenceRef = this.firestore().licences.doc(customer.licence);
      return licenceRef.get();
    },

    encrypt(word){
     return encryptor.encrypt(word);
    },
    verifyPassword(unencryptedPassword, encryptedPassword ){
      return unencryptedPassword === encryptor.decrypt(encryptedPassword);
    },
    verifyLicence(customer){
      if(customer.licenceType === "0"){ // Free version
        return true;
      }
    }
  }
}