<template>
    <div>
        <div class="md-layout md-gutter">
            <div class="md-layout-item"></div>
            <div class="md-layout-item">
                <img class="logo" src="../assets/images/logo.png" />
            </div>
            <div class="md-layout-item"></div>
        </div>
    
        <div class="md-layout md-alignment-center-center">
            <span class="md-display-4">Bienvenido</span>
        </div>
        <div class="md-layout md-alignment-center-center">
            <span class="md-display-2">{{loadingMessage}}</span>
        </div>
    </div>
</template>

<script>
//const path = require('path');
//const find = require("find");
// const fs = require("fs");
import { mixins } from "../helpers/mixins";
const settings = require("electron-settings");
const { dialog } = require("electron").remote;
import { mapState } from "vuex";


export default {
    name: "Loading",
    mixins: [mixins],
    computed: {
        ...mapState(["musicFiles", "karaokeFiles", "ads"])
    },
    data: () => ({
        loadingMessage: '',
        configuration: null
    }),
    mounted() {
          this.verifyConfiguration();
    },
    methods: {
        verifyConfiguration() {
            this.loadingMessage = 'Verificando configuración del negocio...';

            if (settings.has('configuration')) {
                // console.log('Configuration', settings.get("configuration"));
                this.configuration = settings.get("configuration");
                this.loadingMessage = 'Se encontró configuración del local';
                this.getFilesCache(this.configuration);
            } else {
                this.loadingMessage = 'No se encontró configuración del local';
                dialog.showErrorBox("Bienvenido", "Debes llenar la configuración antes de usar la aplicación")
                this.$router.replace({ path: 'config' })
            }
        },
        async getFilesCache(configuration) {

            var cachedMusicFiles = null;
            var cachedKaraokeFiles = null;
            var cachedAdsFiles = null;

            if (configuration.karaokeFolder && configuration.licenceType !== "0") {
                this.loadingMessage = "Actualizando canciones de Karaoke...";
                cachedKaraokeFiles = await this.indexFolder(configuration.karaokeFolder);
                this.$store.commit("setKaraokeFiles", cachedKaraokeFiles);
                // console.log('mus', this.karaokeFiles);
                this.loadingMessage = "Canciones de Karaoke actualizadas";
            }

            if (configuration.adsFolder && configuration.licenceType !== "2") {
                this.loadingMessage = "Actualizando anuncios...";
                cachedAdsFiles = await this.indexFolder(configuration.adsFolder);
                this.$store.commit("setAds", cachedAdsFiles);
                // console.log('cachedAdsFiles', this.ads);
                this.loadingMessage = "Anuncios actualizados";
            }

            if (configuration.musicFolder) {
                this.loadingMessage = "Actualizando canciones...";
                cachedMusicFiles = await this.indexFolder(configuration.musicFolder);
                this.$store.commit("setMusicFiles", cachedMusicFiles);
               // // console.log(cachedMusicFiles);
                if (this.musicFiles.length === 0) {
                    dialog.showErrorBox("No se encontraron canciones", "Debes elegir una carpeta que tenga canciones en video .mp4 o .mp3")
                    this.$router.replace({ path: 'config' })
                } else {
                    this.loadingMessage = "Canciones actualizadas";
                    this.$router.replace({ path: 'player' });
                }
            }


        }
    }
}
</script>

<style>
.md-app {
    height: 100vh;
}

.logo {
    margin-top: 150px;
}

.md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
}

.left {
    text-align: left;
}

.action {
    margin-top: 50px;
}
</style>