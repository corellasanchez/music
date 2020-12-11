import { mapState, mapMutations } from "vuex";

const fuzz = require('fuzzball');
var socket = {};
// const key = '4vPmH5s3KomcZH4A90Gm7vPHk7sDTYQl';
// var encryptor = require('simple-encryptor')(key);

const sqlite3 = require('sqlite3');

const database = new sqlite3.Database('./pongala.sqlite3', (err) => {
  if (err) console.error('Database opening error: ', err);
});

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
    ...mapMutations(['addSongToQueue', 'setMusicQueue', 'subscribeMessages', "addOnlineUser", "removeOnlineUser", "updateLastPong"]),
  },
  methods: {
    setSocket(newSocket) {
      socket = newSocket;

    },
    clearSongName(name) {
      var clearedName = name.substring(name.lastIndexOf('\\') + 1);
      clearedName = clearedName.substr(0, clearedName.lastIndexOf('.'));
      return clearedName;
    },
    searchSongs(rinfo, keyword) {
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
    async sendConfiguration(rinfo) {
      this.addCredits();
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

      // Send configuration
      var transaction = {
        "operation": "configuration",
        "data": playerPublicConfig
      };

      var message = new Buffer(JSON.stringify(transaction));
      socket.send(message, 0, message.length, rinfo.port, rinfo.address);

      // Send current song list
      transaction = {
        "operation": "list_updated",
        "data": this.musicQueue
      };

      message = new Buffer(JSON.stringify(transaction));
      socket.send(message, 0, message.length, rinfo.port, rinfo.address);

      // Send now playing
      var nowPlaying = await this.$store.state.nowPlaying;

      transaction = {
        "operation": "now_playing",
        "data": nowPlaying
      };

      message = new Buffer(JSON.stringify(transaction));
      socket.send(message, 0, message.length, rinfo.port, rinfo.address);
    },

    AddSongToQueue(data) {
      // c = customer id
      // s = song index in musicFiles Array
      // sn = song name
      // u = user name
      // v = votes
      var song = data;
      song.sn = this.clearSongName(this.musicFiles[data.s]);
      song.v = 0;
      this.$store.commit('addSongToQueue', song);
      this.songListUpdated();
    },

    removeSongFromQueue(s) {
      // s = song index in musicFiles Array
      var updatedSongs = this.musicQueue.filter(function (song) {
        return song.s !== s;
      });
      this.$store.commit('setMusicQueue', updatedSongs);
      this.songListUpdated();
    },
    async getNowPlaying() {
      var users = await this.$store.state.onlineUsers;
      var nowPlaying = await this.$store.state.nowPlaying;

      const transaction = {
        "operation": "now_playing",
        "data": nowPlaying
      };

      const message = new Buffer(JSON.stringify(transaction));

      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          socket.send(message, 0, message.length, user.p, user.a);
        }
      }
    },
    async songListUpdated() {
      var users = await this.$store.state.onlineUsers;

      const transaction = {
        "operation": "list_updated",
        "data": this.musicQueue
      };
      const message = new Buffer(JSON.stringify(transaction));

      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          socket.send(message, 0, message.length, user.p, user.a);
        }
      }
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
      this.updateOnlineUsers();
    },
    loginAdmin(rinfo, data) {
      var adminUsers = this.$settings.get("adminUsers");
      const i = adminUsers.findIndex(x => (x.name === data.u && x.password === data.p) );
      loginResult =  i > -1;
      const transaction = {
        "operation": "login_result",
        "data": loginResult
      };
      const message = new Buffer(JSON.stringify(transaction));
      socket.send(message, 0, message.length, rinfo.port, rinfo.address);
    },
    async updateOnlineUsers() {
      var users = await this.$store.state.onlineUsers;

      const transaction = {
        "operation": "list_users",
        "data": users
      };
      const message = new Buffer(JSON.stringify(transaction));

      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          socket.send(message, 0, message.length, user.p, user.a);
        }
      }
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
        this.checkDisconectedUsers();
      }
    },
    pong(address) {
      this.$store.commit('updateLastPong', address);
    },
    async checkDisconectedUsers() {
      var now = new Date;
      var difference;
      var users = await this.$store.state.onlineUsers;
      setTimeout(() => {

        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          if (user.lp) {
            difference = Math.round((now - user.lp) / 1000);
            console.log('Difference ', difference);
            if (difference >= 120) {
              this.$store.commit('removeOnlineUser', user);
              this.updateOnlineUsers();
            }
          }
        }
      }, 5000);
    },
    addCredits() {
      var parameters = {
        "uid": "SDFF-SDFASD-WERQWESF-SDFAS-DSFASF",
        "name": "Pato aparato",
        "credits": 10
      }
      database.run(`INSERT INTO credits (uid, name, date, credits)
      VALUES (?,?, datetime('now', 'localtime'), ?)`, [parameters.uid, parameters.name, parameters.credits], (err) => {
        if (err) {
          console.log(err.message);
        }
      });
    }
  }
}