<template>
  <Media
    :kind="'video'"
    :isMuted="(true)"
    :src="currentVideo"
    :poster="'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217'"
    :autoplay="true"
    :controls="false"
    :loop="false"
    :ref="'player'"
    @pause="pause()"
    @ended="ended()"
    @waiting="waiting()"
    @stalled="stalled()"
    id="player"
  ></Media>
</template>

<script>
import Media from "@dongido/vue-viaudio";
const settings = require("electron-settings");

export default {
  name: "app",
  components: {
    Media
  },
  data: function() {
    return {
      currentVideo: [],
      videoQueue: []
    };
  },
  mounted() {
    this.videoQueue = [
      "https://www.w3schools.com/html/mov_bbb.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    ];
    this.currentVideo = this.nextVideo();

    settings.set("configuration", {
      folder: "/Users/roy.corella/projects/lease-core",
      licence: "K212EKJJKKKJW12"
    });

    //console.log(settings.get("configuration.folder"));
    // => "Cosmo"

    //console.log(settings.has("configuration.licence"));
    // => false
  },

  methods: {
    pause() {
     // console.log("Video paused!");

      // setTimeout( () => {
      //   this.$refs.player.play()
      // }, 2000)
    },
    ended() {
     console.log("Video ended!", this.$refs.player);

      this.currentVideo = this.nextVideo();
    },
    waiting() {
      console.log("Video waiting!");
    },
    stalled() {
      console.log("Video stalled!");
    },
    nextVideo() {
      return this.videoQueue[
        Math.floor(Math.random() * this.videoQueue.length)
      ];
    }
  }
};
</script>

<style>
#app {
  width: 100%;
  text-align: center;
  background-color: black;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black;
}

#player {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  min-width: 100%;
  min-height: 60%;
  width: auto;
  height: auto;
  z-index: 1;
  overflow: hidden;
}

#player:focus {
  outline: none !important;
}
</style>