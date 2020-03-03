<template>
    <div class="footer">
        <marquee-text :key="0" :duration="100">
            <span class="marqueeSpan" v-for="textAd in localTextAds" :key="textAd.index" :style="{color: textAd.color}"> {{textAd.text}}</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0"> No hay mensajes que mostrar 🙇🙇🙇🙇🙇🙇</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0"> Arega algunos arriba</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0" :style="{color: '#FF851B'}"> Puedes</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0" :style="{color: '#2ECC40'}"> ponerles</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0" :style="{color: '#FFFF00'}"> colores</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0"> y emoticones 🎉🎉🎉🎉🎉</span>
        </marquee-text>
    </div>
</template>

<script>
import { mapState } from "vuex";

const settings = require("electron-settings");

export default {
    name: "text-ads-component",
    data() {
        return {
            isInputActive: false
        };
    },
    methods: {
        getLocalTextAds() {
            if (settings.has("localTextAds")) {
                this.$store.commit("setLocalTextAds", settings.get("localTextAds"));
            }
        }
    },
    computed: {
        ...mapState([
            "localTextAds"
        ])
    },
    mounted() {
        this.getLocalTextAds();
    }
};
</script>

<style>
.footer {
    position: absolute;
    bottom: 50px;
    z-index: 3;
    color: white;
    font-size: 1.5vw;
    text-align: left;
    text-overflow: ellipsis;
    line-height: normal;
    text-transform: uppercase;
    background-color:#181818;
    padding: 9px 0;
}

.marqueeSpan {
    padding-left: 10px;
}
</style>