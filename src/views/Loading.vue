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

import { mixins } from "../helpers/mixins";
import { mixinsFb } from "../helpers/firebaseMixins";
import { mapState } from "vuex";

const settings = require("electron-settings");
const { dialog } = require("electron").remote;

export default {
    name: "Loading",
    mixins: [mixins, mixinsFb],
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
           //settings.delete("configuration");
            this.loadingMessage = 'Verificando configuración del negocio...';
            if (settings.has('configuration')) {
                this.configuration = settings.get("configuration");
                this.loadingMessage = 'Se encontró configuración del local';
                this.verifyLicence(this.configuration);
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
                this.loadingMessage = "Canciones de Karaoke actualizadas";
            }

            if (configuration.adsFolder && configuration.licenceType !== "2") {
                this.loadingMessage = "Actualizando anuncios...";
                cachedAdsFiles = await this.indexFolder(configuration.adsFolder);
                this.$store.commit("setAds", cachedAdsFiles);
                this.loadingMessage = "Anuncios actualizados";
            }

            if (configuration.musicFolder) {
                this.loadingMessage = "Actualizando canciones...";
                cachedMusicFiles = await this.indexFolder(configuration.musicFolder);
                this.$store.commit("setMusicFiles", cachedMusicFiles);
                if (this.musicFiles.length === 0) {
                    dialog.showErrorBox("No se encontraron canciones", "Debes elegir una carpeta que tenga canciones en video .mp4 o .mp3")
                    this.$router.replace({ path: 'config' })
                } else {
                    this.loadingMessage = "Canciones actualizadas";
                }
            }
        },
        async verifyLicence(configuration) {

            this.loadingMessage = 'Verificando Licencia';
            var verifiedLicence = configuration.licenceType === "0" ? true : false;

            if (!verifiedLicence) {
                // Licence verification
                try {
                    var licence = await this.getLicenseFs(configuration);
                    if (licence.exists) {
                        if (licence.data().customer !== configuration.barCode) {
                            dialog.showErrorBox(
                                "Error de licencias",
                                "Esta licencia pertenece a otro usuario, verifique su codigo del bar"
                            );
                            this.$router.replace({ path: 'config' })
                            return false;
                        }

                        if (licence.data().type !== configuration.licenceType) {
                            dialog.showErrorBox(
                                "Error de licencias",
                                "Esta licencia no corresponde con el tipo de licencia seleccionado"
                            );
                            this.$router.replace({ path: 'config' })
                            return false;
                        }

                        if (
                            licence.data().expiration_date.seconds <
                            this.timestamp().seconds
                        ) {

                            var fechaExpiracion = this.$moment.unix(licence.data().expiration_date.seconds).format('DD MMMM YYYY, h:mm:ss a')

                            dialog.showErrorBox(
                                "La licencia a expirado !!!",
                                "Esta licencia expiró el " + fechaExpiracion + ", por favor compre una nueva ó cambie el tipo de licencia a Basico"
                            );
                            this.openLicenceSite();
                            this.$router.replace({ path: 'config' })
                            return false;
                        }
                    } else {
                        dialog.showErrorBox(
                            "Licencia inválida",
                            "Esta licencia no es valida. Puede comprar una licencia en nuestro sitio web."
                        );
                        this.openLicenceSite();
                        this.$router.replace({ path: 'config' })
                        return false;
                    }
                } catch (error) {
                    dialog.showErrorBox(
                        "Error al obtener información de la licencia",
                        "Verifica tu conexión a Internet"
                    );
                    return false;
                }
            }
            this.loadingMessage = 'Licencia Correcta';
            this.$router.replace({ path: 'player' });
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