import { mapState, mapMutations } from "vuex";

const fuzz = require('fuzzball');
// const key = '4vPmH5s3KomcZH4A90Gm7vPHk7sDTYQl';


// var encryptor = require('simple-encryptor')(key);

const MULTICAST_ADDR = "230.185.192.108";
const PORT = "41848";

export const mixinsRequest = {
  data: function () {
    return {
      configuration: null,
      currentVideo: [],
      videoQueue: [],
    }
  },
  computed: {
    ...mapState(["musicFiles", "karaokeFiles", "ads", "musicQueue", "messageQueue", "queueSubscription", "searchSubscription", "messageQueueSubscription", 'onlineUsers']),
    ...mapMutations(['addSongToQueue', 'setMusicQueue', 'subscribeMessages', "addOnlineUser", "removeOnlineUser"]),
  },
  methods: {
    clearSongName(name) {
      var clearedName = name.substring(name.lastIndexOf('\\') + 1);
      clearedName = clearedName.substr(0, clearedName.lastIndexOf('.'));
      return clearedName;
    },
    searchSongs(socket, rinfo, keyword) {
      console.log('seaching for songs');
      var results = [];
      // console.log( this.musicFiles);
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
      console.log(results);
      const transaction = {
        "operation": "search_result",
        "data": results
      };

      if (socket) {
        const message = new Buffer(JSON.stringify(transaction));
        socket.send(message, 0, message.length, rinfo.port, rinfo.address);
      }

    },
    sendConfiguration(socket, rinfo) {

      console.log(this.configuration);
      var playerPublicConfig = {
        address: this.configuration.address,
        badWordsFilter: this.configuration.badWordsFilter,
        chatActive: this.configuration.chatActive,
        creditSale: this.configuration.creditSale,
        email: this.configuration.email,
        licenceType: this.configuration.licenceType,
        maxSongs: this.configuration.maxSongs,
        name: this.configuration.name,
        phone: this.configuration.phone,
        songsOrder: this.configuration.songsOrder
      }

      const transaction = {
        "operation": "configuration",
        "data": playerPublicConfig
      };

      const message = new Buffer(JSON.stringify(transaction));
      socket.send(message, 0, message.length, rinfo.port, rinfo.address);
    },

    AddSongToQueue(socket, data) {
      // c = customer id
      // s = song index in musicFiles Array
      // sn = song name
      // u = user name
      // v = votes
      var song = data;
      song.sn = this.clearSongName(this.musicFiles[data.s]);
      song.v = 0;
      this.$store.commit('addSongToQueue', song);
      this.songListUpdated(socket);
      console.log(song);
    },
    removeSongFromQueue(s) {
      // s = song index in musicFiles Array
      var updatedSongs = this.musicQueue.filter(function (song) {
        return song.s !== s;
      });
      this.$store.commit('setMusicQueue', updatedSongs);
    },
    songListUpdated(socket) {
      const transaction = {
        "operation": "list_updated",
        "data": this.musicQueue
      };
      const message = new Buffer(JSON.stringify(transaction));
      socket.send(message, 0, message.length, PORT, MULTICAST_ADDR);
    },
    loginUser(rinfo, data) {
      // c = customer id
      // u = user name
      // p = port
      // a = address
      var user = {
        'c': data.c,
        'u': data.u,
        'p': rinfo.port,
        'a': rinfo.address
      };
      this.$store.commit('addOnlineUser', user);
    },
    async sendPing(socket) {
      const transaction = {
        "operation": "ping",
        "data": ""
      };
      const message = new Buffer(JSON.stringify(transaction));

      var users = await this.$store.state.onlineUsers;

      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          console.log(user.a, user.p, socket);
          socket.send(message, 0, message.length, user.p, user.a);
        }
      }
    }
    // FIREBASE OPERATIONS
    // timestamp() {
    //   return this.fb.firestore.Timestamp.now();
    // },
    // timestampFormat(date) {
    //   return this.fb.firestore.Timestamp.fromDate(date);
    // },
    // timestampFromMillis(millis) {
    //   return this.fb.firestore.Timestamp.fromMillis(millis);
    // },
    // async saveCustomerFs(customer) {
    //   var customerToSave = Object.assign({}, customer);
    //   customerToSave.password = this.encrypt(customer.password);
    //   this.firestore().customers.doc(customer.barCode).set(customerToSave);
    // },
    // getCustomerFs(customer) {
    //   var customerRef = this.firestore().customers.doc(customer.barCode);
    //   return customerRef.get();
    // },
    // getLicenseFs(customer) {
    //   var licenceRef = this.firestore().licences.doc(customer.licence);
    //   return licenceRef.get();
    // },
    // encrypt(word) {
    //   return encryptor.encrypt(word);
    // },
    // verifyPassword(unencryptedPassword, encryptedPassword) {
    //   return unencryptedPassword === encryptor.decrypt(encryptedPassword);
    // },
    // verifyLicence(customer) {
    //   if (customer.licenceType === "0") { // Free version
    //     return true;
    //   }
    // },
    // removeMessageFromQueue(fid) {
    //   var updatedMessages = this.musicQueue.filter(function (message) {
    //     return message.fid !== fid;
    //   });
    //   this.$store.commit('setMessageQueue', updatedMessages);
    //   //console.log(this.messageQueue);
    //   return this.firestore().messages.doc(fid).delete();
    // },
    // removeSongFromQueue(fid) {
    //   var updatedSongs = this.musicQueue.filter(function (song) {
    //     return song.fid !== fid;
    //   });
    //   this.$store.commit('setMusicQueue', updatedSongs);
    //   return this.firestore().pending_songs.doc(fid).delete();
    // },
    // setNowPlaying(customer, song) {
    //   this.firestore().now_playing.doc(customer.barCode).set(song);
    // },
    // async getSearchQueries(customer) {
    //   if (!this.searchSubscription) {
    //     this.$store.commit('subscribeQueries');
    //     this.firestore().search_queries.where("c", "==", customer.barCode).onSnapshot((querySnapshot) => {
    //       // c = customer
    //       // q = query
    //       // r = result
    //       querySnapshot.docChanges().forEach((change) => {
    //         if (change.type === "added") {
    //           this.searchSongs(change.doc.id, change.doc.data().q);
    //         }
    //         if (change.type === "modified") {
    //           //console.log("s modified: ", change.doc.data());
    //         }
    //         if (change.type === "removed") {
    //           //console.log("s removed: ", change.doc.data());
    //         }
    //       });
    //     });
    //   }

    // },
    // async getSongsQueue(customer) {

    //   if (!this.queueSubscription) {
    //     this.$store.commit('subscribeQueue');
    //     //console.log("songsQueue");

    //     this.firestore().pending_songs.where("c", "==", customer.barCode).onSnapshot((querySnapshot) => {
    //       // c = customer
    //       // s = song index in the array
    //       // u = user name
    //       // v = votes
    //       // n = song name
    //       querySnapshot.docChanges().forEach((change) => {
    //         if (change.type === "added") {
    //           this.queueSong(change.doc.id, change.doc.data());
    //         }
    //         if (change.type === "modified") {
    //           //console.log("Q modified: ", change.doc.data());
    //         }
    //         if (change.type === "removed") {
    //           //console.log("Q removed: ", change.doc.data());
    //         }
    //       });
    //     });
    //   }
    // },
    // async getMessageQueue(customer) {

    //   if (!this.messageQueueSubscription) {
    //     this.$store.commit('subscribeMessages');
    //     //console.log("messageQueue");

    //     this.firestore().messages.where("c", "==", customer.barCode).onSnapshot((querySnapshot) => {
    //       // c = customer
    //       // m = message
    //       // u = user name
    //       // p = user photo
    //       querySnapshot.docChanges().forEach((change) => {
    //         if (change.type === "added") {
    //           this.queueMessage(change.doc.id, change.doc.data());
    //         }
    //         if (change.type === "modified") {
    //           //console.log("M modified: ", change.doc.data());
    //         }
    //         if (change.type === "removed") {
    //           //console.log("M removed: ", change.doc.data());
    //         }
    //       });
    //     });
    //   }
    // },
    // queueSong(id, data) {
    //   // c = customer
    //   // s = song index in musicFiles Array
    //   // sn = song name
    //   // u = user name
    //   // v = votes
    //   var song = data;
    //   song.fid = id;
    //   this.$store.commit('addSongToQueue', song);
    // },
    // queueMessage(id, data) {
    //   // c = customer
    //   // m = message
    //   // u = user name
    //   // p = user photo
    //   var message = data;
    //   message.fid = id;
    //   this.$store.commit('addMessageToQueue', message);
    //   this.firestore().messages.doc(message.fid).delete();
    // },
  }
}