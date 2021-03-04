import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    musicFiles: {},
    musicQueue: [],
    karaokeFiles: {},
    banners: {},
    videoAds: {},
    nowPlaying: {},
    messageQueue: [],
    localTextAds: [],
    onlineUsers: [],
    adminUsers: [],
    queueSubscription: false,
    searchSubscription: false,
    messageQueueSubscription: false,
    socketInit: false,
    songIndex: 0,
    adDuration: 0,
    goToNextSong: false
  },
  mutations: {
    setNowPlaying(state, nowPlaying) {
      state.nowPlaying = nowPlaying;
    },
    setMusicFiles(state, musicFiles) {
      state.musicFiles = musicFiles;
    },
    setKaraokeFiles(state, karaokeFiles) {
      state.karaokeFiles = karaokeFiles;
    },
    setBanners(state, banners) {
      state.banners = banners;
    },
    setVideoAds(state, videoAds) {
      state.videoAds = videoAds;
    },
    setMusicQueue(state, musicQueue) {
      state.musicQueue = musicQueue;
    },
    setMessageQueue(state, messageQueue) {
      state.messageQueue = messageQueue;
    },
    setOnlineUsers(state, onlineUsers) {
      state.onlineUsers = onlineUsers;
    },
    setAdminUsers(state, adminUsers) {
      state.adminUsers = adminUsers;
    },
    setAdDuration(state, duration){
      state.adDuration = duration;
    },
    setGoToNextSong(state, goToNextSong){
      state.goToNextSong = goToNextSong;
    },
    addOnlineUser(state, user) {
      if (!state.onlineUsers) {
        state.onlineUsers = [];
      }

      const i = state.onlineUsers.findIndex(_item => _item.a === user.a);
      if (i > -1) {
        state.onlineUsers[i] = user;
      }
      else {
        state.onlineUsers.push(user);
      }
      state.onlineUsers = state.onlineUsers.sort((a, b) => a.u.localeCompare(b.u));

      console.log("User added", JSON.stringify(state.onlineUsers));
    },
    addAdminUser(state, user) {
      if (!state.adminUsers) {
        state.adminUsers = [];
      }

      const i = state.adminUsers.findIndex(_item => (_item.name === user.name && _item.password === user.password));
      if (i > -1) {
        state.adminUsers[i] = user;
      }
      else {
        state.adminUsers.push(user);
      }
    },
    updateLastPong(state, address) {

      if (!state.onlineUsers) {
        state.onlineUsers = [];
      }

      var now = new Date();

      const i = state.onlineUsers.findIndex(_item => _item.a === address);

      if (i > -1) {
        state.onlineUsers[i].lp = now;
      }

    },
    removeOnlineUser(state, user) {
      const result = state.onlineUsers.filter(x => x.a != user.a);
      state.onlineUsers = result.sort((a, b) => a.u.localeCompare(b.u));
    },
    removeAdminUser(state, user) {
      const i = state.adminUsers.findIndex(x => x.name === user.name);
      if (i > -1) {
        state.adminUsers.splice(i, 1);
      }
    },
    setLocalTextAds(state, localTextAds) {
      state.localTextAds = localTextAds;
    },
    setSocketInit(state, socketInit) {
      state.socketInit = socketInit;
    },
    addLocalTextAd(state, localTextAd) {
      if (!state.localTextAds) {
        state.localTextAds = [];
      }
      state.localTextAds.push(localTextAd);
    },
    removeLocalTextAd(state, localTextAd) {
      const result = state.localTextAds.filter(x => x.index != localTextAd.index);
      state.localTextAds = result;
    },
    addSongToQueue(state, song) {
      const result = state.musicQueue.filter(x => x.s == song.s);
      state.songIndex++;
      if (result.length === 0) {
        song.index = state.songIndex;
        state.musicQueue.push(song);
      }
      if (song.songsOrder == "2") { // Order by votes
        state.musicQueue = state.musicQueue.sort((a, b) => b.v - a.v);
      }
    },
    addVote(state, data) {
      const i = state.musicQueue.findIndex(x => x.s == data.s);
      if (i > -1) {
        state.musicQueue[i].v++;
        if (state.musicQueue.length && state.musicQueue[i].voters.indexOf(data.c) === -1) {
          state.musicQueue[i].voters.push(data.c);
        }
      }
      if (data.songsOrder == "2") { // Order by votes
        state.musicQueue = state.musicQueue.sort((a, b) => b.v - a.v);
      }
    },
    addMessageToQueue(state, message) {
      message.index = state.musicQueue.length + 1;
      state.messageQueue.push(message);
    },
    subscribeQueue(state) {
      state.queueSubscription = true;
    },
    subscribeQueries(state) {
      state.searchSubscription = true;
    },
    subscribeMessages(state) {
      state.messageQueueSubscription = true;
    }
  },
  getters: {
    messageQueue: state => state.messageQueue,
    goToNextSong: state => state.goToNextSong
  },
  actions: {
  },
  modules: {
  }
})
