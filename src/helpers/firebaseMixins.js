import { mapState, mapMutations } from "vuex";

const fuzz = require('fuzzball');
const key = '4vPmH5s3KomcZH4A90Gm7vPHk7sDTYQl';


var encryptor = require('simple-encryptor')(key);

export const mixinsFb = {
  data: function () {
    return {
        db: this.$firebase.firestore(),
        fb: this.$firebase,
        configuration: null,
        currentVideo: [],
        videoQueue: [],}},
  computed: {
    ...mapState(["musicFiles", "karaokeFiles", "ads", "musicQueue", "messageQueue", "queueSubscription", "searchSubscription", "messageQueueSubscription"]),
    ...mapMutations(['addSongToQueue', 'setMusicQueue', 'subscribeMessages']),
  },
  methods: {
    firestore() {
      return {
        customers: this.db.collection("customers"),
        licences: this.db.collection("licences"),
        search_queries: this.db.collection("search_queries"),
        pending_songs: this.db.collection("pending_songs"),
        now_playing: this.db.collection("now_playing"),
        messages: this.db.collection("messages")
      };
    },
    searchSongs(id, data) {
      // i = index
      // n = song name
      // r = result ratio
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
      var clearedName = name.substring(name.lastIndexOf('\\') + 1);
      clearedName = clearedName.substr(0, clearedName.lastIndexOf('.'));
      return clearedName;
    },
    // FIREBASE OPERATIONS
    timestamp() {
      return this.fb.firestore.Timestamp.now();
    },
    timestampFormat(date) {
      return this.fb.firestore.Timestamp.fromDate(date);
    },
    timestampFromMillis(millis) {
      return this.fb.firestore.Timestamp.fromMillis(millis);
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
    removeMessageFromQueue(fid) {
      var updatedMessages = this.musicQueue.filter(function (message) {
        return message.fid !== fid;
      });
      this.$store.commit('setMessageQueue', updatedMessages);
      //console.log(this.messageQueue);
      return this.firestore().messages.doc(fid).delete();
    },
    removeSongFromQueue(fid) {
      var updatedSongs = this.musicQueue.filter(function (song) {
        return song.fid !== fid;
      });
      this.$store.commit('setMusicQueue', updatedSongs);
      return this.firestore().pending_songs.doc(fid).delete();
    },
    setNowPlaying(customer, song) {
      this.firestore().now_playing.doc(customer.barCode).set(song);
    },
    async getSearchQueries(customer) {
      if (!this.searchSubscription) {
        this.$store.commit('subscribeQueries');
        this.firestore().search_queries.where("c", "==", customer.barCode).onSnapshot((querySnapshot) => {
          // c = customer
          // q = query
          // r = result
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              this.searchSongs(change.doc.id, change.doc.data().q);
            }
            if (change.type === "modified") {
              //console.log("s modified: ", change.doc.data());
            }
            if (change.type === "removed") {
              //console.log("s removed: ", change.doc.data());
            }
          });
        });
      }

    },
    async getSongsQueue(customer) {

      if (!this.queueSubscription) {
        this.$store.commit('subscribeQueue');
        //console.log("songsQueue");

        this.firestore().pending_songs.where("c", "==", customer.barCode).onSnapshot((querySnapshot) => {
          // c = customer
          // s = song index in the array
          // u = user name
          // v = votes
          // n = song name
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              this.queueSong(change.doc.id, change.doc.data());
            }
            if (change.type === "modified") {
              //console.log("Q modified: ", change.doc.data());
            }
            if (change.type === "removed") {
              //console.log("Q removed: ", change.doc.data());
            }
          });
        });
      }
    },
    async getMessageQueue(customer) {

      if (!this.messageQueueSubscription) {
        this.$store.commit('subscribeMessages');
        //console.log("messageQueue");

        this.firestore().messages.where("c", "==", customer.barCode).onSnapshot((querySnapshot) => {
          // c = customer
          // m = message
          // u = user name
          // p = user photo
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              this.queueMessage(change.doc.id, change.doc.data());
            }
            if (change.type === "modified") {
              //console.log("M modified: ", change.doc.data());
            }
            if (change.type === "removed") {
              //console.log("M removed: ", change.doc.data());
            }
          });
        });
      }
    },
    queueSong(id, data) {
      // c = customer
      // s = song index in musicFiles Array
      // sn = song name
      // u = user name
      // v = votes
      var song = data;
      song.fid = id;
      this.$store.commit('addSongToQueue', song);
    },
    queueMessage(id, data) {
      // c = customer
      // m = message
      // u = user name
      // p = user photo
      var message = data;
      message.fid = id;
      this.$store.commit('addMessageToQueue', message);
      this.firestore().messages.doc(message.fid).delete();
    },
  }
}