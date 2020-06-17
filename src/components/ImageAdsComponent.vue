<template>
<transition name="slide-fade" mode="out-in">
    <div :key="images[0].index" class="footer">
        <img :src="images[0].file" class="image-banner" alt="Image banner">
    </div>
</transition>
</template>

<script>
import {
    mapState
} from "vuex";

const settings = require("electron-settings");

export default {
    name: "image-ads-component",
    props: {
        duration: Number,
        showDemo: Boolean
    },
    data: function () {
        return {
            images: [{
                    file: 'file:///D:/banners/banner-1.png',
                    index: 1
                },
                // {file:'https://as.com/meristation/imagenes/2019/06/13/noticias/1560407057_696857_1560407184_noticia_normal.jpg',index: 2},
                // {file:'file:///Users/roy.corella/Downloads/banners/banner3.png', index: 3}
            ],
        };
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
    },

};
</script>

<style>
.footer {
    position: absolute;
    bottom: 0px;
    z-index: 3; 
    padding:50px;
    width: 100%;
    text-align: center;
    background-color: transparent !important;
}

.image-banner {
    max-height: 150px !important;
    width: auto;

}

.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */

    {
    transform: translateX(10px);
    opacity: 0;
}
</style>
