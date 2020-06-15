<template>
    <div class="footer">
        <!-- <transition name="slide-fade" mode="out-in">
            <div :key="images[0].index">
                 <img :src="images[0].file" style="width:100%;" alt="">
            </div>
        </transition>  -->
    </div>
</template>

<script>
import { mapState } from "vuex";

const settings = require("electron-settings");

export default {
    name: "image-ads-component",
    props: {
        duration: Number,
        showDemo: Boolean
    },
    data: function() {
        return {
            images: [
                {file:'file:///Users/roy.corella/Downloads/banners/banner9.png', index: 1},
                {file:'https://as.com/meristation/imagenes/2019/06/13/noticias/1560407057_696857_1560407184_noticia_normal.jpg',index: 2},
                {file:'file:///Users/roy.corella/Downloads/banners/banner3.png', index: 3}
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
    bottom: 10px;
    z-index: 3;
    color: white;
    font-size: 1.5vw;
    text-align: left;
    text-overflow: ellipsis;
    line-height: normal;
    text-transform: uppercase;
    background: rgba(0, 0, 0, 0.8);
    padding: 9px 0;
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