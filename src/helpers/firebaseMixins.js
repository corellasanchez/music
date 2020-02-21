import { db } from "../firebase.js";
import { firebase } from "@firebase/app";
import { mapState } from "vuex";
const fuzz = require('fuzzball');


const key = '4vPmH5s3KomcZH4A90Gm7vPHk7sDTYQl';

var encryptor = require('simple-encryptor')(key);

export const mixinsFb = {
  computed: {
    ...mapState(["musicFiles", "karaokeFiles", "ads"])
  },
  methods: {
    firestore() {
      return {
        customers: db.collection("customers"),
        licences: db.collection("licences"),
        search_queries: db.collection("search_queries"),
      };
    },
    searchSongs(id, data) {
      var results = [];

      var keyword = data;

      this.musicFiles.forEach((element, index) => {
        var ratio = fuzz.partial_ratio(element, keyword);
        if (ratio > 70) {
          results.push({ i: index, n: this.clearSongName(element), r: ratio });
        }
      });

      results.sort((a, b) => { return Number(b.r) - Number(a.r) });

      if (results.length > 100) {
        results.length = 100;
      }

      this.firestore().search_queries.doc(id).set({
        r: results
      }, { merge: true });

    },
    clearSongName(name) {
      var clearedName = name.substring(name.lastIndexOf('/') + 1);
      clearedName = clearedName.substr(0, clearedName.lastIndexOf('.'));
      return clearedName;
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
    getLicenseFs(customer) {
      var licenceRef = this.firestore().licences.doc(customer.licence);
      return licenceRef.get();
    },
    encrypt(word) {
      return encryptor.encrypt(word);
    },
    verifyPassword(unencryptedPassword, encryptedPassword) {
      return unencryptedPassword === encryptor.decrypt(encryptedPassword);
    },
    verifyLicence(customer) {
      if (customer.licenceType === "0") { // Free version
        return true;
      }
    },
    async getSearchQueries(customer) {
      this.firestore().search_queries.where("c", "==", customer.barCode).onSnapshot((querySnapshot) => {

        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            this.searchSongs(change.doc.id, change.doc.data().q);
          }
          if (change.type === "modified") {
            console.log("Q modified: ", change.doc.data());
          }
          if (change.type === "removed") {
            console.log("Q removed: ", change.doc.data());
          }
        });

      });
    },

  }
}