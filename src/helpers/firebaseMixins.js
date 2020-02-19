import { db } from "../firebase.js";
import { firebase } from "@firebase/app";

const key = '4vPmH5s3KomcZH4A90Gm7vPHk7sDTYQl';

var encryptor = require('simple-encryptor')(key);

export const mixinsFb = {
  methods: {
    firestore() {
      return {
        customers: db.collection("customers"),
        licences: db.collection("licences")
      };
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