<template>
    <div class="container">
        <div class="super">
            <!-- <h1  v-if="currentUserName && showSuper" v-animate-css="superTransition">
                <md-icon>face</md-icon>
                {{currentUserName}}
            </h1> -->
            <h1 class="song-name" v-if="currentSongName && showSuper" v-animate-css="superTransition">
               <strong class="user-name" v-show="currentUserName">
                {{currentUserName}}: <br> 
              </strong>
              {{currentSongName}}
              </h1>
       
        </div>
    
        <div class="super-left-logo" v-if="configuration && (superAppInfo || superAppInfo2 || superAppInfo3)">
            <div class="left-logo">
                <img src="../assets/images/logo.svg" />
            </div>
            <div class="left-text">
                <h1 class="left-logo-text" v-show="superAppInfo">{{configuration.name}}</h1>
                <h1 class="left-logo-text" v-show="superAppInfo2">
                    Descarga Gratis
                    <span class="accent">Pongala Music</span>
                    <img src="../assets/images/google-play-store.svg" />
                    <img src="../assets/images/apple-logo.svg" />
                </h1>
                <h1 class="left-logo-text" v-show="superAppInfo3">
                    Ingrese el Código:
                    <span class="accent">{{configuration.barCode}}</span>
                </h1>
            </div>
        </div>
    <!-- :controls="true" -->
        <Media id="player" :kind="'video'" :isMuted="true" :src="currentVideo" :autoplay="true"  :loop="false" :ref="'player'" @pause="pause()" @ended="ended()" @waiting="waiting()" @emptied="empitied()" @stalled="stalled()" @suspend="suspend()"
            @playing="playing()"></Media>
    
        <notifications group="user-messages" position="bottom left" :duration="Number(15000)" :max="Number(9)" />
    
        <text-ads-component :duration="Number(duration)" :showDemo="false"></text-ads-component>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Media from "@dongido/vue-viaudio";
import { mixins } from "../helpers/mixins";
import { mixinsFb } from "../helpers/firebaseMixins";
import { TextAdsComponent } from "../components";

const settings = require("electron-settings");

export default {
    name: "app",
    components: {
        Media,
        TextAdsComponent
    },
    mixins: [mixins, mixinsFb],
    data: function() {
        return {
            fileProtocol: "file:///",
            configuration: null,
            currentVideo: [],
            videoQueue: [],
            showSuper: false,
            superAppInfo: true,
            superAppInfo2: false,
            superAppInfo3: false,
            currentUserName: "",
            currentSongName: "",
            currentMessageName: "",
            currentMessage: "",
            superTransition: "slideInLeft",
            duration: 15,
            messageTest: 0
        };
    },
    created() {
        this.$store.watch(
            (state, getters) => getters.messageQueue,
            () => {
                this.getNextMessage();
            }
        );
    },
    mounted() {
        this.configuration = settings.get("configuration");
        if (settings.has("configuration.markeeDuration")) {
            this.duration = settings.get("configuration.markeeDuration");
        } else {
            this.duration = 15;
        }
        this.getSearchQueries(this.configuration);
        this.getSongsQueue(this.configuration);
        this.getMessageQueue(this.configuration);
        setTimeout(() => {
            this.currentVideo = this.nextVideo();
        }, 1000);
    },
    computed: {
        ...mapState([
            "musicFiles",
            "karaokeFiles",
            "ads",
            "musicQueue",
            "messageQueue",
            "localTextAds"
        ]),
        ...mapMutations(["addLocalTextAd", "addMessageToQueue"])
    },
    methods: {
        pause() {
            // console.log("Video paused!");
            // setTimeout( () => {
            //   this.$refs.player.play()
            // }, 2000)
        },
        ended() {
            // console.log("Video ended!", this.$refs.player);

            this.currentVideo = this.nextVideo();
        },
        waiting() {
            // console.log("Video waiting!");
        },
        stalled() {
            // console.log("Video stalled!");
        },
        empitied() {
            // console.log("Video empitied!");
        },
        suspend() {
            // console.log("Video suspend!");
        },
        playing() {
            // console.log("Video suspend!");
        },
        nextVideo() {
            var nextVideoFile = "";
            var nextSong = {};

            if (this.musicQueue.length > 0) {
                if (this.configuration.songsOrder == 1) {
                    nextSong = this.getLowerIndexSong();
                    nextVideoFile = this.musicFiles[nextSong.s];
                    console.log("index ", nextVideoFile);
                } else {
                    nextSong = this.getSongByVotes();
                    nextVideoFile = this.musicFiles[nextSong.s];
                    console.log("votes ", nextVideoFile);
                }
                this.moveToNext(nextSong);
            } else {
                nextVideoFile = this.musicFiles[
                    Math.floor(Math.random() * this.musicFiles.length)
                ];

                this.currentUserName = "Pongala Music";
                this.currentSongName = this.clearSongName(nextVideoFile);
                this.showSongInfo();
                console.log("random", nextVideoFile);
            }
            return this.fileProtocol + this.configuration.musicFolder + nextVideoFile;
        },
        moveToNext(nextSong) {
            //fid = firbaseId
            // s = song index on musicFiles
            // u = user name
            // v = votes
            // index = order index

            var songName = this.clearSongName(this.musicFiles[nextSong.s]);
            var userName = nextSong.u;

            this.currentUserName = userName;
            this.currentSongName = songName;

            this.removeSongFromQueue(nextSong.fid)
                .then(() => {
                    console.log("Document successfully deleted!");
                    this.setNowPlaying(this.configuration, { n: songName, u: userName });
                    this.showSongInfo();
                })
                .catch(function(error) {
                    console.error("Error removing document: ", error);
                });
        },
        appInfoTransition() {
            if (this.superAppInfo) {
                this.superAppInfo = false;
                this.superAppInfo2 = true;
                this.superAppInfo3 = false;
                return;
            }
            if (this.superAppInfo2) {
                this.superAppInfo = false;
                this.superAppInfo2 = false;
                this.superAppInfo3 = true;
                return;
            }
            if (this.superAppInfo3) {
                this.superAppInfo = true;
                this.superAppInfo2 = false;
                this.superAppInfo3 = false;
                return;
            }
        },
        showSongInfo() {
            this.showSuper = true;
            setTimeout(() => {
                this.showSuper = false;
            }, 20000);
        },
        getLowerIndexSong() {
            this.musicQueue.sort((a, b) => {
                return Number(a.index) - Number(b.index);
            });
            return this.musicQueue[0];
        },
        getNextMessage() {
            if (this.messageQueue.length > 0) {
                this.messageQueue.sort((a, b) => {
                    return Number(a.index) - Number(b.index);
                });
                console.log(this.messageQueue[0]);

                this.$notify({
                    group: "user-messages",
                    text: "<strong>" +
                        this.messageQueue[0].u +
                        ": </strong> " +
                        this.messageQueue[0].m,
                    position: "bottom left"
                });
                this.messageQueue.shift();
            }
        },
        getSongByVotes() {
            this.musicQueue.sort((a, b) => {
                return Number(b.v) - Number(a.v);
            });
            return this.musicQueue[0];
        },
        sendTestMessages() {
            var names = ["Hellen Brooks",
                "Rachel Varquero",
                "Edwards Ramirez",
                "Christopher Sanchez",
                "Jorge Perez",
                "Michael Thomas",
                "Hanz Baker",
                "Sara Connor",
                "Henri Moore",
                "Chris Angels",
                "Bailey de la Cruz",
                "Roger Smith",
                "Ellen Johnson",
                "Marilyn Manson",
                "Marcos Thompson",
                "Anthony Hopkings",
                "Evans Fruits",
                "Julie Roberts",
                "Hall Bomber",
                "Paula Abdul",
                "Jhon Phillips",
                "Annie Natacha",
                "Enrique Hernandez",
                "Dorothy Palacios",
                "Murphy Loras",
                "Alice Anderson",
                "Howard Smith"
            ];
            var messages = [
                "What’s happening?! 😄😄☠✊ ",
                "Acabo de ponerme la tercera y final dosis de la vacuna contra el virus de papiloma humano. Logro logrado.😃",
                "YA ME LLAMÓ EL MEP 🤡",
                "Quiero mas chelas 🍻🍻🍻🍻",
                "Que nadie te diga que no podés 🌈",
                "Pueden poner el corrido del Chapo 💰💰💰💰",
                "Madison Square Garden is my 💣",
                "GAAAAAAAAAAAAAALLLLLL!!!!!!!! Vamoooooooooo Carajooooo 💪💪💪",
                "Mucha vergüenza el arbitraje en Tucumán de Losteau 🤮🤮🤮",
                "No paramos de reír con esto. 👏👏",
                "Solo les puedo decir que la raza  estábamos ahí gozamos el show 😈😈",
                "FELIZ DOMINGO PARA TODOS 🎊🎊🎊",
                "Hoy es juernes!! ❤❤❤",
                "A días de firmar mi divorcio 💦💦🦄",
                "Ahí fui al karaoke a cantar I will survive, empoderada. 👾👾👾 ",
                "Silvana Flores, con una jugada de auténtica crack ⚽⚽",
                "hola mutuals, recuerden que mañana no se usan redes sociales para nada 🙅‍♀️🙅‍♀️",
                "¡FELIZ CUMPLEAÑOS MIN YOONGI! Cañón de serpentina 🥊 ",
                "Gracias por ser un genio 🍄"
            ];

            if (this.messageTest < 20) {
                this.messageTest += 1;
                this.$store.commit("addMessageToQueue", {
                    u: names[ Math.floor(Math.random() * names.length)],
                    m: messages[ Math.floor(Math.random() * messages.length)]
                });
            }
        }
    },

    timers: {
        appInfoTransition: { time: 6000, autostart: true, repeat: true },
        sendTestMessages: { time: 1000, autostart: true, repeat: true }
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

.cn {
    position: relative;
    width: 100%;
    height: auto;
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

.super {
    position: absolute;
    top: 120px;
    left: 55px;
    width: fit-content;
    z-index: 3;
    color: white;
    font-size: 10px;
    text-align: justify;
    text-overflow: ellipsis;
    line-height: normal;
    text-transform: uppercase;
}

.user-name {
   color:  #f0b022 ;
   font-weight: bold;
}

.song-name {
    background-color: black;
    padding: 10px 20px;
    border-left: 6px solid #f0b022 !important;
}

#player:focus {
    outline: none !important;
}

.super-left-logo {
    position: absolute;
    top: 50px;
    left: 50px;
    z-index: 3;
    color: white;
    font-size: 15px;
    text-align: left;
    text-overflow: ellipsis;
    line-height: normal;
    text-transform: uppercase;
}

.left-logo {
    float: left;
    width: 65px;
}

.left-text {
    margin-top: 0;
    margin-left: 10px;
    padding-top: 6px;
    padding-bottom: 6px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 100px;
    height: 64px;
    padding-right: 40px;
    width: max-content;
}

.left-logo-text {
    margin-left: 68px;
    margin-top: 6px;
    margin-bottom: 0px;
}

.left-logo-text img {
    max-width: 181px;
    margin-top: -9px;
    padding-left: 25px;
}

.accent {
    color: #f0b022;
}

.badge-danger {
    color: red;
}

.vue-notification {
    font-size: 1.2em !important;
    background: rgba(0, 0, 0, 0.9) !important;
    padding-left: 50px;
    border-color: #f0b022 !important;
}

.vue-notification-group {
    bottom: 70px !important;
    left: 50px !important;
    width: fit-content !important;
}
</style>