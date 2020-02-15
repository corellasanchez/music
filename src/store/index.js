import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    musicFiles: {},
    karaokeFiles: {},
    ads:{}
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
    }
  },
  actions: {
  },
  modules: {
  }
})
