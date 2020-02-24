import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    musicFiles: {},
    musicQueue: [],
    karaokeFiles: {},
    ads:{},
    queueSubscription: false,
    searchSubscription: false
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
    addSongToQueue(state, song){
      const result = state.musicQueue.filter(x => x.fid ==  song.fid);
     if(result.length === 0){
      song.index = state.musicQueue.length + 1;
      state.musicQueue.push(song);
      console.log('song added', song)
     }
    },
    subscribeQueue(state){
      state.queueSubscription = true;
    },
    subscribeQueries(state){
      state.searchSubscription = true;
    }
  },
  actions: {
  },
  modules: {
  }
})
