<template>
    <Media
    id="player" 
    :kind="'video'"
    :isMuted="(true)"
    :src="currentVideo"
    :autoplay="true"
    :controls="true"
    :loop="false"
    :ref="'player'"
    @pause="pause()"
    @ended="ended()"
    @waiting="waiting()"
    @emptied="empitied()"
    @stalled="stalled()"
    @suspend="suspend()"
    @playing="playing()"	>
    </Media>
</template>

<script>
import Media from "@dongido/vue-viaudio";
import { mapState } from "vuex";

const settings = require("electron-settings");

export default {
    name: "app",
    components: {
        Media
    },
    data: function() {
        return {
            fileProtocol: "file:///",
            configuration: null,
            currentVideo: [],
            videoQueue: []
        };
    },
    mounted() {
        this.configuration = this.configuration = settings.get("configuration");
      
        this.videoQueue = [
            // "https://www.w3schools.com/html/mov_bbb.mp4",
            // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
            // // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            // "file:///Users/roy.corella/Downloads/Bombshell.2019.720P.DVDScr.X264.AC3.HQ.Hive-CM8/Bombshell.2019.720P.DVDScr.X264.AC3.HQ.Hive-CM8.mkv"
        ];
        this.currentVideo = this.nextVideo();
    },
    computed: {
        ...mapState(["musicFiles", "karaokeFiles", "ads"])
    },

    methods: {
        pause() {
             console.log("Video paused!");
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
        empitied() {
           console.log("Video empitied!");
        },
        suspend(){
          console.log("Video suspend!"); 
        },
         playing(){
          console.log("Video suspend!"); 
        },
        nextVideo() {
           
            var randomVideo = this.musicFiles[Math.floor(Math.random() * this.musicFiles.length)];
          //  var randomVideo = "/The Cribs - I'm a Realist.mp4";
            console.log(this.fileProtocol + this.configuration.musicFolder +  randomVideo);
            return this.fileProtocol + this.configuration.musicFolder + randomVideo;
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