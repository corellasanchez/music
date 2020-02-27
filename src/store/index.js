import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    musicFiles: {},
    musicQueue: [],
    karaokeFiles: {},
    ads:{},
    messageQueue: [],
    queueSubscription: false,
    searchSubscription: false,
    messageQueueSubscription: false
  },
  mutations: {
    setMusicFiles(state, musicFiles){
      state.musicFiles = musicFiles;
    },
    setKaraokeFiles(state, karaokeFiles){
      state.karaokeFiles = karaokeFiles;
    },
    setAds(state, ads){
      state.ads = ads;
    },
    setMusicQueue(state, musicQueue){
      state.musicQueue = musicQueue;
    },
    setMessageQueue(state, messageQueue){
      state.messageQueue = messageQueue;
    },
    addSongToQueue(state, song){
      const result = state.musicQueue.filter(x => x.fid ==  song.fid);
     if(result.length === 0){
      song.index = state.musicQueue.length + 1;
      state.musicQueue.push(song);
      console.log('song added', song)
     }
    },
    addMessageToQueue(state, message){
      message.index = state.musicQueue.length + 1;
      state.messageQueue.push(message);
      console.log('message added', message)
    },
    subscribeQueue(state){
      state.queueSubscription = true;
    },
    subscribeQueries(state){
      state.searchSubscription = true;
    },
    subscribeMessages(state){
      state.messageQueueSubscription = true;
    }
  },
  actions: {
  },
  modules: {
  }
})
