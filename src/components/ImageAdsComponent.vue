<template>
<agile class="footer" :dots="false" :navButtons="false" :autoplay="true" :autoplay-speed="5000">
    <div class="slide" v-for="image in images" :key="image.index">
        <img :src="image.file" class="image-banner" alt="NO SE ENCONTRO LA IMAGEN">
    </div>
</agile>
</template>

<script>
import {
    mapState
} from "vuex";

// YourComponent.vue
import {
    VueAgile
} from 'vue-agile'

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
                {
                    file: 'file:///D:/banners/banner-2.png',
                    index: 2
                },
                {
                    file: 'file:///D:/banners/banner-3.png',
                    index: 3
                },
                 {
                    file: 'file:///D:/banners/banner-4.png',
                    index: 3
                }
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
    components: {
        agile: VueAgile
    }

};
</script>

<style>
.footer {
    position: absolute;
    bottom: 0px;
    z-index: 3;
    padding: 50px;
    width: 100%;
    text-align: center;
    background-color: transparent !important;
}

.image-banner {
    max-height: 150px !important;
    width: auto;
}

.agile {
    position: absolute;
}
</style>
