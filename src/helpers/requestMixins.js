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
    ...mapState(["musicFiles", "karaokeFiles", "ads", "musicQueue", "messageQueue", "queueSubscription", "searchSubscription", "messageQueueSubscription", 'onlineUsers', "localTextAds", "adDuration", "goToNextSong"]),
    ...mapMutations(['addSongToQueue', 'setMusicQueue', 'subscribeMessages', "addOnlineUser", "removeOnlineUser", "updateLastPong", "addVote", "addLocalTextAd", "removeLocalTextAd", "setAdDuration", "setGoToNextSong"]),
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
      var results = [];
      var configuration = this.$settings.get("configuration");

      if (configuration.karaokeMode) {
        this.karaokeFiles.forEach((element, index) => {
          var ratio = fuzz.partial_ratio(element, keyword);
          if (ratio > 70) {
            results.push({ i: index, n: this.clearSongName(element), r: ratio });
          }
        });
      } else {
        this.musicFiles.forEach((element, index) => {
          var ratio = fuzz.partial_ratio(element, keyword);
          if (ratio > 70) {
            results.push({ i: index, n: this.clearSongName(element), r: ratio });
          }
        });
      }



      results.sort((a, b) => { return Number(b.r) - Number(a.r) });

      if (results.length > 100) {
        results.length = 100;
      }
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

      var configuration = await this.$settings.get("configuration");

      var playerPublicConfig = {
        address: configuration.address,
        badWordsFilter: configuration.badWordsFilter,
        barCode: configuration.barCode,
        chatActive: configuration.chatActive,
        creditSale: configuration.creditSale,
        email: configuration.email,
        licenceType: configuration.licenceType,
        maxSongs: configuration.maxSongs,
        name: configuration.name,
        phone: configuration.phone,
        songsOrder: configuration.songsOrder,
        karaokeMode: configuration.karaokeMode
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

    async configurationUpdated(configuration) {
      var users = await this.$store.state.onlineUsers;

      var playerPublicConfig = {
        address: configuration.address,
        badWordsFilter: configuration.badWordsFilter,
        barCode: configuration.barCode,
        chatActive: configuration.chatActive,
        creditSale: configuration.creditSale,
        email: configuration.email,
        licenceType: configuration.licenceType,
        maxSongs: configuration.maxSongs,
        name: configuration.name,
        phone: configuration.phone,
        songsOrder: configuration.songsOrder,
        karaokeMode: configuration.karaokeMode
      }

      const transaction = {
        "operation": "configuration_updated",
        "data": playerPublicConfig
      };
      const message = new Buffer(JSON.stringify(transaction));

      if (users.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          socket.send(message, 0, message.length, user.p, user.a);
        }
      }
    },

   async AddSongToQueue(rinfo, data) {
      // c = customer id
      // s = song index in musicFiles Array
      // sn = song name
      // u = user name
      // v = votes
      // voters
      // type
      var song = data;
      var configuration = await this.$settings.get("configuration");
      if(configuration.karaokeMode){
        song.sn = this.clearSongName(this.karaokeFiles[data.s]);
        song.type = 'karaoke';
      }else{
        song.sn = this.clearSongName(this.musicFiles[data.s]); 
        song.type = 'normal';
      }
     
     
      song.v = 0;
      song.voters = [];
      song.songsOrder = this.configuration.songsOrder;
      this.$store.commit('addSongToQueue', song);
      this.songListUpdated();

      if (this.configuration.creditSale) {
        database.run(`UPDATE available_credits set credits = credits - 1 WHERE uid = ?`, [data.c], (err) => {
          if (err) {
            console.log('Error updating', err.message);
          }
          // get current available_credits
          database.get(`SELECT * FROM available_credits WHERE uid = ?`, [data.c], (err, rows) => {
            if (err) {
              console.log(err);
            }
            var result = rows;

            // send confirmation for the user
            var transaction = {
              "operation": "current_credits",
              "data": { "credits": result.credits, "confirm": false }
            };
            var message = new Buffer(JSON.stringify(transaction));
            socket.send(message, 0, message.length, rinfo.port, rinfo.address);
          });
        });
      }
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
      // ia = is admin
      var user = {
        'c': data.c,
        'u': data.u,
        'p': rinfo.port,
        'a': rinfo.address,
        'ia': data.ia
      };
      this.$store.commit('addOnlineUser', user);
      this.updateOnlineUsers();
    },
    loginAdmin(rinfo, data) {
      var adminUsers = this.$settings.get("adminUsers");
      const i = adminUsers.findIndex(x => (x.name === data.u.toLowerCase() && x.password === data.p));
      const loginResult = i > -1;
      const transaction = {
        "operation": "login_result",
        "data": loginResult
      };
      const message = new Buffer(JSON.stringify(transaction));
      socket.send(message, 0, message.length, rinfo.port, rinfo.address);

      if (loginResult) {
        data.ia = true;
        this.loginUser(rinfo, data);
      }

      this.sendTextAds(rinfo, data)

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
            //console.log('Difference ', difference);
            if (difference >= 120) {
              this.$store.commit('removeOnlineUser', user);
              this.updateOnlineUsers();
            }
          }
        }
      }, 5000);
    },
    addCredits(rinfo, data) {
      var result = {};
      var current_credits = 0;

      var parameters = {
        "uid": data.user.c,
        "name": data.user.u,
        "credits": data.credits,
        "seller": data.seller
      }

      // get current available_credits
      database.get(`SELECT * FROM available_credits WHERE uid = ?`, [parameters.uid], (err, rows) => {
        if (err) {
          console.log(err);
        }
        result = rows;

        if (result) {
          // update available_credits
          current_credits = Number(data.credits) + Number(result.credits);
          database.run(`UPDATE available_credits set credits = ? WHERE uid = ?`, [current_credits, parameters.uid], (err) => {
            if (err) {
              console.log('Error updating', err.message);
            }
          });
        } else {
          // add available_credits
          current_credits = parameters.credits;
          database.run(`INSERT INTO available_credits (uid, name, credits) VALUES (?,?,?)`, [parameters.uid, parameters.name, parameters.credits], (err) => {
            if (err) {
              console.log('Error adding', err.message);
            }
          });
        }

        // save credit sale history
        database.run(` INSERT INTO credits_sale_history (uid, name, seller, credits, date) VALUES (?,?,?,?,DATETIME('now','localtime'))`, [parameters.uid, parameters.name, parameters.seller, parameters.credits], (err) => {
          if (err) {
            console.log('Error adding', err.message);
          }
        });

        // send confirmation for the user
        var transaction = {
          "operation": "current_credits",
          "data": { "credits": current_credits, "confirm": true }
        };
        var message = new Buffer(JSON.stringify(transaction));
        socket.send(message, 0, message.length, data.user.p, data.user.a);

        // send confirmation for the seller
        transaction = {
          "operation": "credits_confirmation",
          "data": { user: data.user.u, credits: data.credits }
        };
        message = new Buffer(JSON.stringify(transaction));
        socket.send(message, 0, message.length, rinfo.port, rinfo.address);
      });
    },
    getCreditReport(rinfo, data) {
      var result = {};

      console.log(data);

      // get credit sales between two dates
      database.all(`SELECT * FROM credits_sale_history WHERE credits_sale_history.date BETWEEN ? AND ?`, [data.from_date, data.to_date], (err, rows) => {
        if (err) {
          console.log(err);
        }
        result.details = rows;
      });

      // get total group by seller
      database.all(`SELECT SUM(credits_sale_history.credits) as total,seller FROM credits_sale_history WHERE credits_sale_history.date BETWEEN ? AND ? GROUP BY seller`, [data.from_date, data.to_date], (err, rows) => {
        if (err) {
          console.log(err);
        }
        result.totals = rows;
      });

      // get grand total
      database.get(`SELECT SUM(credits_sale_history.credits) as total FROM credits_sale_history WHERE credits_sale_history.date BETWEEN ? AND ?`, [data.from_date, data.to_date], (err, res) => {
        if (err) {
          console.log(err);
        }
        result.grand_total = res.total;

        var transaction = {
          "operation": "credits_report_result",
          "data": { result: result }
        };
        var message = new Buffer(JSON.stringify(transaction));
        socket.send(message, 0, message.length, rinfo.port, rinfo.address);
      });
    },
    getCredits(rinfo, data) {
      var current_credits = 0;
      // get current available_credits
      database.get(`SELECT * FROM available_credits WHERE uid = ?`, [data], (err, result) => {
        if (result) {
          current_credits = Number(result.credits);
        }
        const transaction = {
          "operation": "current_credits",
          "data": { "credits": current_credits, "confirm": false }
        };
        const message = new Buffer(JSON.stringify(transaction));
        socket.send(message, 0, message.length, rinfo.port, rinfo.address);
      });
    },
    vote(rinfo, data) {
      data.songsOrder = this.configuration.songsOrder;
      this.$store.commit('addVote', data);
      this.songListUpdated();
      if (this.configuration.creditSale) {
        database.run(`UPDATE available_credits set credits = credits - 1 WHERE uid = ?`, [data.c], (err) => {
          if (err) {
            console.log('Error updating', err.message);
          } else {
            this.getCredits(rinfo, data.c);
          }
        });
      }
    },
    sendMessage(rinfo, data) {
      console.log('send message', rinfo, data);
      this.$store.commit("addMessageToQueue", {
        u: data.name,
        m: decodeURIComponent(data.message)
      });
    },
    sendTextAds(rinfo) {
      var ads = [];
      var duration = 15;

      if (this.$settings.has("localTextAds")) {
        ads = this.$settings.get("localTextAds");
        ads.forEach(ad => {
          ad.text = encodeURIComponent(ad.text);
        });
      }

      duration = this.adDuration;
      const transaction = {
        "operation": "text_ads_updated",
        "data": { "ads": ads, "duration": duration }
      };
      const message = new Buffer(JSON.stringify(transaction));
      socket.send(message, 0, message.length, rinfo.port, rinfo.address);
    },
    removeTextAd(rinfo, data) {
      this.$store.commit("removeLocalTextAd", data);
      this.$settings.set("localTextAds", this.localTextAds);
      this.sendTextAds(rinfo);
    },
    addTextAd(rinfo, data) {
      var message = {};
      message.text = decodeURIComponent(data.text);
      message.color = data.color;
      message.index = this.localTextAds ? this.localTextAds.length + 1 : 1;
      this.$store.commit("addLocalTextAd", message);
      this.$settings.set("localTextAds", this.localTextAds);
      this.sendTextAds(rinfo);
    },
    setAdsDuration(rinfo, data) {
      this.$store.commit("setAdDuration", data);
      this.$settings.set("configuration.markeeDuration", data);
      this.sendAdDuration(rinfo, data);
    },
    sendAdDuration(rinfo, data) {
      const transaction = {
        "operation": "ad_duration_updated",
        "data": { "duration": data }
      };
      const message = new Buffer(JSON.stringify(transaction));
      socket.send(message, 0, message.length, rinfo.port, rinfo.address);
    },
    async setKaraokeMode(rinfo, data) {
      var settings = await this.$settings.get("configuration");
      settings.karaokeMode = Boolean(data);
      await this.$settings.set("configuration", settings);
      this.configurationUpdated(settings);
    },
    async setChatActive(rinfo, data) {
      var settings = await this.$settings.get("configuration");
      settings.chatActive = Boolean(data);
      await this.$settings.set("configuration", settings);
      this.configurationUpdated(settings);
    },
    skipSong(rinfo, data) {
      this.$store.commit("setGoToNextSong", data);
    },
  }
}