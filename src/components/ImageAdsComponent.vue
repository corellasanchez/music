<template>
<agile class="footer" :dots="false" :navButtons="false" :autoplay="true" :autoplay-speed="5000" v-if="configuration.licenceType == '2' && banners">
    <div class="slide" v-for="(banner, index) in banners" :key="index">
        <img :src="'file:///' + folder + banner" class="image-banner" alt="NO SE ENCONTRO LA IMAGEN" />
    </div>
</agile>
</template>

<script>
import {
    VueAgile
} from "vue-agile";

export default {
    name: "image-ads-component",
    props: {
        duration: Number,
        showDemo: Boolean,
        folder: String,
        banners: {}
    },
    mounted() {
        this.getConfig();
    },
    data: function () {
        return {
            configuration: {}
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
