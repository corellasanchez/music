<template>
<agile class="footer" :dots="false" :navButtons="false" :autoplay="true" :autoplay-speed="5000">
    <div class="slide" v-for="(banner, index) in banners" :key="index">
        <img :src="'file:///' + configuration.adsFolder + banner" class="image-banner" alt="NO SE ENCONTRO LA IMAGEN" />
    </div>
</agile>
</template>

<script>
import {
    mapState
} from "vuex";

import {
    VueAgile
} from "vue-agile";

export default {
    name: "image-ads-component",
    props: {
        duration: Number,
        showDemo: Boolean
    },
    computed: {
        ...mapState(["banners"])
    },
    mounted() {
        this.getConfig();
    },
    data: function () {
        return {
            configuration: {},
            images: []
        };
    },
    methods: {
        getConfig() {
            if (this.$settings.has("configuration")) {
                this.configuration = this.$settings.get("configuration");
            }
        },
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
