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
    queueSubscription: false,
    searchSubscription: false,
    messageQueueSubscription: false,
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

      console.log("User added", JSON.stringify(state.onlineUsers));
    },
    updateLastPong(state, address) {

      if (!state.onlineUsers) {
        state.onlineUsers = [];
      }

      var now =  new Date();
     
      const i = state.onlineUsers.findIndex(_item => _item.a === address);
     
      if (i > -1) {
        state.onlineUsers[i].lp = now;
      }
    
      console.log("State last pong ", JSON.stringify(state.onlineUsers));
    },
    removeOnlineUser(state, user) {
      const result = state.onlineUsers.filter(x => x.a != user.a);
      state.onlineUsers = result;
      console.log("User Remvoed ",  JSON.stringify(user), JSON.stringify(state.onlineUsers));
    },
    setLocalTextAds(state, localTextAds) {
      state.localTextAds = localTextAds;
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
      console.log(result.length);
      if (result.length === 0) {
        song.index = state.musicQueue.length + 1;
        state.musicQueue.push(song);
        //console.log('song added', song)
      }
    },
    addMessageToQueue(state, message) {
      message.index = state.musicQueue.length + 1;
      state.messageQueue.push(message);
      // //console.log('message added', message)
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
  },
  actions: {
  },
  modules: {
  }
})
