<template>
<div class="container">
    <div class="super" v-if="!showWaitingScreen">
        <h1 class="song-name" v-if="currentSongName && showSuper" v-animate-css="superTransition">
            <strong class="user-name" v-show="currentUserName">
                {{ currentUserName }}:
                <br />
            </strong>
            {{ currentSongName }}
        </h1>
    </div>

    <div class="super-left-logo" v-if="configuration && (superAppInfo || superAppInfo2 || superAppInfo3)">
        <div class="left-logo">
            <img src="../assets/images/logo.svg" />
        </div>
        <div class="left-text">
            <h1 class="left-logo-text" v-show="superAppInfo">
                {{ configuration.name }}
            </h1>
            <h1 class="left-logo-text" v-show="superAppInfo2">
                Descarga Gratis
                <span class="accent">Pongala Music</span>
                <img src="../assets/images/google-play-store.svg" />
                <img src="../assets/images/apple-logo.svg" />
            </h1>
            <h1 class="left-logo-text" v-show="superAppInfo3">
                Conectate al WiFi:
                <span class="accent">{{ configuration.wifi }}</span>
                con la contraseña :
                <span class="accent">{{ configuration.wifi_password }}</span>
            </h1>
        </div>
    </div>

    <Media v-if="!showWaitingScreen" id="player" :controls="true" :kind="'video'" :isMuted="false" :src="currentVideo" :autoplay="true" :loop="false" :ref="'player'" @pause="pause()" @ended="ended()" @waiting="waiting()" @emptied="empitied()" @stalled="stalled()" @suspend="suspend()" @playing="playing()"></Media>

    <div class="karaoke-waiting" v-if="showWaitingScreen">
        <h1>
            <strong class="waiting-user-name" v-show="currentUserName">
                {{ currentUserName }}
                <br />
            </strong>
            <span class="waiting-text"> {{ currentSongName }}</span>
            <br />

            <span class="waiting-time"> {{ waitTime }}</span>
        </h1>
    </div>

    <notifications group="user-messages" position="bottom left" :duration="Number(15000)" :max="Number(9)" />

    <text-ads-component :duration="Number(adDuration)" :showDemo="false" v-if="configuration && configuration.licenceType != '0'"></text-ads-component>

    <image-ads-component :showDemo="false" v-bind:banners="banners"></image-ads-component>
</div>
</template>

<script>
import {
    mapState,
    mapMutations
} from "vuex";
import Media from "@dongido/vue-viaudio";
import {
    mixins
} from "../helpers/mixins";
// import {
//     mixinsFb
// } from "../helpers/firebaseMixins";
import {
    netMixins
} from "../helpers/netMixins";
import {
    TextAdsComponent,
    ImageAdsComponent
} from "../components";

export default {
    name: "app",
    components: {
        Media,
        TextAdsComponent,
        ImageAdsComponent,
    },
    mixins: [mixins, netMixins],
    data: function () {
        return {
            videoCount: 0,
            fileProtocol: "file:///",
            configuration: null,
            currentVideo: [],
            currentVideoAd: 0,
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
            messageTest: 0,
            showWaitingScreen: false,
            waitTime: 0,
        };
    },
    created() {},
    mounted() {
        this.configuration = this.$settings.get("configuration");
        if (this.$settings.has("configuration.markeeDuration")) {
            this.duration = this.$settings.get("configuration.markeeDuration");
        } else {
            this.duration = 15;
        }
        this.$store.commit("setAdDuration", this.duration);

        if (this.configuration.chatActive) {
            this.$store.watch(
                (state, getters) => getters.messageQueue,
                () => {
                    this.getNextMessage();
                }
            );
        }

        this.$store.watch(
            (state, getters) => getters.goToNextSong,
            (value) => {
                if (value) {
                    this.$store.commit("setGoToNextSong", false);
                    this.currentVideo = this.nextVideo();
                    if (this.configuration.karaokeMode && this.currentUserName !== "Pongala Music") {
                        this.waitingScreen();
                    } else {
                        this.currentVideo = this.nextVideo();
                    }
                }
            }
        );

        setTimeout(() => {
            this.currentVideo = this.nextVideo();
            this.configurationUpdated(this.configuration);
        }, 1000);
        //  this.sendTestMessages();

        if (!this.socketInit) {
            this.setUdpService();
            this.$store.commit("setSocketInit", true);
        }
        // this.setTcpSocket();
    },
    computed: {
        ...mapState([
            "musicFiles",
            "karaokeFiles",
            "musicQueue",
            "messageQueue",
            "localTextAds",
            "banners",
            "videoAds",
            "socketInit",
            "adDuration",
            "goToNextSong",
        ]),
        ...mapMutations([
            "addLocalTextAd",
            "addMessageToQueue",
            "setNowPlaying",
            "setSocketInit",
            "setGoToNextSong",
        ]),
    },
    methods: {
        pause() {
            // ////console.log("Video paused!");
            // setTimeout( () => {
            //   this.$refs.player.play()
            // }, 2000)
        },
        ended() {
            // ////console.log("Video ended!", this.$refs.player);

            this.currentVideo = this.nextVideo();
            if (this.configuration.karaokeMode && this.currentUserName !== "Pongala Music") {
                this.waitingScreen();
            } else {
                this.currentVideo = this.nextVideo();
            }
        },
        waiting() {
            // ////console.log("Video waiting!");
        },
        stalled() {
            // ////console.log("Video stalled!");
        },
        empitied() {
            // ////console.log("Video empitied!");
        },
        suspend() {
            // ////console.log("Video suspend!");
        },
        playing() {
            // ////console.log("Video suspend!");
        },
        nextVideo() {
            var nextVideoFile = "";
            var nextSong = {};
            var nextVideoAd = "";
            var folder = "";

            if (this.musicQueue.length > 0) {
                if (this.configuration.songsOrder == 1) {
                    nextSong = this.getLowerIndexSong();
                } else {
                    nextSong = this.getSongByVotes();
                }
                nextVideoFile = this.configuration.karaokeMode ?
                    this.karaokeFiles[nextSong.s] :
                    this.musicFiles[nextSong.s];
                folder =
                    nextSong.type === "karaoke" ?
                    this.configuration.karaokeFolder :
                    this.configuration.musicFolder;
                this.moveToNext(nextSong);
            } else {
                nextVideoFile = this.musicFiles[
                    Math.floor(Math.random() * this.musicFiles.length)
                ];
                this.currentUserName = "Pongala Music";
                this.currentSongName = this.clearSongName(nextVideoFile);
                folder = this.configuration.musicFolder;
                this.showSongInfo();
            }

            //// Show ads each..
            if (
                this.configuration.licenceType === "2" &&
                this.videoAds.length &&
                this.configuration.adsEach
            ) {
                if (this.videoCount < this.configuration.adsEach) {
                    this.videoCount++;
                } else {
                    this.videoCount = 0;
                }
                if (!this.videoCount) {
                    nextVideoAd =
                        this.fileProtocol +
                        this.configuration.adsFolder +
                        this.videoAds[this.currentVideoAd];
                    if (this.currentVideoAd < this.videoAds.length - 1) {
                        this.currentVideoAd++;
                    } else {
                        this.currentVideoAd = 0;
                    }
                    return nextVideoAd;
                }
            }

            return this.fileProtocol + folder + nextVideoFile;
        },
        delay(time) {
            // time in seconds
            return new Promise((resolve) => setTimeout(resolve, time * 1000));
        },
        async decreaseWaitTime() {
            await this.delay(1);
            this.waitTime--;
        },
        async waitingScreen() {
            var seconds = 0;
            this.showWaitingScreen = true;
            seconds = parseInt(this.configuration.karaokeTime);
            this.waitTime = seconds;
            for (let index = 0; index < seconds; index++) {
                await this.decreaseWaitTime();
            }
            this.showWaitingScreen = false;
        },

        moveToNext(nextSong) {
            // s = song index on musicFiles
            // u = user name
            // v = votes
            // index = order index

            var songName = nextSong.sn;
            var userName = nextSong.u;

            this.currentUserName = userName;
            this.currentSongName = songName;

            this.removeSongFromQueue(nextSong.s);
            this.showSongInfo();
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
            this.$store.commit("setNowPlaying", {
                u: this.currentUserName,
                sn: this.currentSongName,
            });
            this.getNowPlaying();
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
        getSongByVotes() {
            this.musicQueue.sort((a, b) => {
                return Number(b.v) - Number(a.v);
            });
            return this.musicQueue[0];
        },
        getNextMessage() {
            if (this.messageQueue.length > 0) {
                this.messageQueue.sort((a, b) => {
                    return Number(a.index) - Number(b.index);
                });
                this.$notify({
                    group: "user-messages",
                    text: "<strong>" +
                        this.messageQueue[0].u +
                        ": </strong> " +
                        this.messageQueue[0].m,
                    position: "bottom left",
                });
                this.messageQueue.shift();
            }
        },
        sendTestMessages() {
            var names = [
                "Hellen Brooks",
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
                "Howard Smith",
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
                "Gracias por ser un genio 🍄",
            ];

            if (this.messageTest < 20 && this.configuration.chatActive) {
                this.messageTest += 1;
                this.$store.commit("addMessageToQueue", {
                    u: names[Math.floor(Math.random() * names.length)],
                    m: messages[Math.floor(Math.random() * messages.length)],
                });
            }
        },
    },

    timers: {
        appInfoTransition: {
            time: 10000,
            autostart: true,
            repeat: true,
        },
        // sendTestMessages: {
        //     time: 1000,
        //     autostart: true,
        //     repeat: true,
        // },
    },
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
    color: #f0b022;
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
    bottom: 200px !important;
    left: 50px !important;
    width: fit-content !important;
}

.karaoke-waiting {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

.waiting-user-name {
    font-size: 7vw;
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    text-transform: uppercase;
    color: #fff;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    font-weight: bold;
    text-shadow:
        0 1px 0 #ccc,
        0 2px 0 #c9c9c9,
        0 3px 0 #bbb,
        0 4px 0 #b9b9b9,
        0 5px 0 #aaa,
        0 6px 1px rgba(0, 0, 0, .1),
        0 0 5px rgba(0, 0, 0, .1),
        0 1px 3px rgba(0, 0, 0, .3),
        0 3px 5px rgba(0, 0, 0, .2),
        0 5px 10px rgba(0, 0, 0, .25),
        0 10px 10px rgba(0, 0, 0, .2),
        0 20px 20px rgba(0, 0, 0, .15);
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.waiting-text {
    color: rgb(27, 21, 21);
    font-size: 3vw;
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    text-transform: uppercase;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    text-align: center;
    padding-left: 10%;
    padding-right: 10%;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
}

.waiting-time {
    color: #fff;
    font-size: 8vw;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    font-weight: bold;
    line-height: normal;
    text-shadow:
        0 1px 0 #ccc,
        0 2px 0 #c9c9c9,
        0 3px 0 #bbb,
        0 4px 0 #b9b9b9,
        0 5px 0 #aaa,
        0 6px 1px rgba(0, 0, 0, .1),
        0 0 5px rgba(0, 0, 0, .1),
        0 1px 3px rgba(0, 0, 0, .3),
        0 3px 5px rgba(0, 0, 0, .2),
        0 5px 10px rgba(0, 0, 0, .25),
        0 10px 10px rgba(0, 0, 0, .2),
        0 20px 20px rgba(0, 0, 0, .15);
    justify-content: center;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
