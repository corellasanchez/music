<template>
    <div class="footer" v-if="localTextAds.length > 0 || showDemo">
        <marquee-text :key="0" :duration="duration">
            <span class="marqueeSpan" v-for="textAd in localTextAds" :key="textAd.index + 2000" :style="{color: textAd.color}"> {{textAd.text}}</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0 && showDemo" :key="3001"> No hay mensajes que mostrar 🙇🙇🙇🙇🙇🙇</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0 && showDemo" :key="3002">> Arega algunos arriba</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0 && showDemo" :style="{color: '#FF851B'}" :key="3003">> Puedes</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0 && showDemo" :style="{color: '#2ECC40'}" :key="3004">> ponerles</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0 && showDemo" :style="{color: '#FFFF00'}" :key="3005">> colores</span>
            <span class="marqueeSpan" v-if="localTextAds.length == 0 && showDemo" :key="3006">> y emoticones 🎉🎉🎉🎉🎉</span>
        </marquee-text>
    </div>
</template>

<script>
import { mapState } from "vuex";

const settings = require("electron-settings");

export default {
    name: "text-ads-component",
    props: {
    duration: Number,
    showDemo: Boolean  
    },
    methods: {
        getConfig() {
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
        this.getConfig();
    }
};
</script>

<style>
.footer {
    position: absolute;
    bottom: 10px;
    z-index: 3;
    color: white;
    font-size: 1.5vw;
    text-align: left;
    text-overflow: ellipsis;
    line-height: normal;
    text-transform: uppercase;
    background: rgba(0,0,0,0.8);
    padding: 9px 0;
}

.marqueeSpan {
    padding-left: 10px;
        font-weight: bolder;
}
</style>