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
import {
    mixins
} from "../helpers/mixins";
import {
    mixinsFb
} from "../helpers/firebaseMixins";
import {
    mapState
} from "vuex";


export default {
    name: "Loading",
    mixins: [mixins, mixinsFb],
    computed: {
        ...mapState(["musicFiles", "karaokeFiles", "ads"])
    },
    data: () => ({
        loadingMessage: "",
        configuration: null
    }),
    mounted() {
        this.verifyConfiguration();
    },
    methods: {
        verifyConfiguration() {
            //this.$settings.delete("configuration");
            this.loadingMessage = "Verificando configuración del negocio...";
            if (this.$settings.has("configuration")) {
                this.configuration = this.$settings.get("configuration");
                this.loadingMessage = "Se encontró configuración del local";
                this.verifyLicence(this.configuration);
                this.getFilesCache(this.configuration);
            } else {
                this.loadingMessage = "No se encontró configuración del local";
                this.$alert(
                    "Debes llenar la configuración antes de usar la aplicación",
                    "Bienvenido",
                    "info"
                );
                this.$router.replace({
                    path: "config"
                });
            }
        },
        async getFilesCache(configuration) {
            var cachedMusicFiles = null;
            var cachedKaraokeFiles = null;
            var cachedBannerFiles = null;
            var cachedVideoAdsFiles = null;

            if (configuration.karaokeFolder && configuration.licenceType !== "0") {
                this.loadingMessage = "Actualizando canciones de Karaoke...";
                try {
                    cachedKaraokeFiles = await this.indexFolder(
                        configuration.karaokeFolder,
                        "videos"
                    );
                    this.$store.commit("setKaraokeFiles", cachedKaraokeFiles);
                    this.loadingMessage = "Canciones de Karaoke actualizadas";
                } catch (error) {
                    this.$alert(
                        "Esta carpeta " +
                        configuration.karaokeFolder +
                        " no existe o no tiene los permisos de lectura adecuados, por favor actualice la informacion",
                        "No se encontro la carpeta de karaoke",
                        "error"
                    );

                    // save the configuration to the local settings
                    configuration.karaokeFolder = "";
                    this.$settings.set("configuration", configuration);
                    this.$router.replace({
                        path: "config"
                    });
                    return;
                }
            }

            if (configuration.adsFolder && configuration.licenceType == "2") {
                this.loadingMessage = "Actualizando anuncios...";
                try {
                    cachedBannerFiles = await this.indexFolder(
                        configuration.adsFolder,
                        "images"
                    );
                    this.$store.commit("setBanners", cachedBannerFiles);

                    cachedVideoAdsFiles = await this.indexFolder(
                        configuration.adsFolder,
                        "videos"
                    );
                    this.$store.commit("setVideoAds", cachedVideoAdsFiles);

                    this.loadingMessage = "Anuncios actualizados";
                } catch (error) {
                    this.$alert(
                        "Esta carpeta " +
                        configuration.adsFolder +
                        " no existe o no tiene los permisos de lectura adecuados, por favor actualice la informacion",
                        "No se encontro la carpeta de anuncios",
                        "error"
                    );

                    // save the configuration to the local settings
                    configuration.adsFolder = "";
                    this.$settings.set("configuration", configuration);
                    this.$router.replace({
                        path: "config"
                    });
                    return;
                }
            }

            if (configuration.musicFolder) {
                this.loadingMessage = "Actualizando canciones...";
                try {
                    cachedMusicFiles = await this.indexFolder(
                        configuration.musicFolder,
                        "videos"
                    );
                    this.$store.commit("setMusicFiles", cachedMusicFiles);
                    if (this.musicFiles.length === 0) {
                        this.$alert(
                            "Debes elegir una carpeta que tenga canciones en video .mp4 o .mp3",
                            "No se encontraron canciones",
                            "error"
                        );
                        this.$router.replace({
                            path: "config"
                        });
                    } else {
                        this.loadingMessage = "Canciones actualizadas";
                    }
                } catch (error) {

                    this.$alert(
                        "Esta carpeta " +
                        configuration.musicFolder +
                        " no existe o no tiene los permisos de lectura adecuados, por favor actualice la informacion",
                        "No se encontro la carpeta de musica",
                        "error"
                    );

                    // save the configuration to the local settings
                    configuration.musicFolder = "";
                    this.$settings.set("configuration", configuration);
                    this.$router.replace({
                        path: "config"
                    });
                    return;
                }
            }
            this.$router.replace({
                path: "player"
            });
        },
        async verifyLicence(configuration) {
            this.loadingMessage = "Verificando Licencia";
            var verifiedLicence = configuration.licenceType === "0" ? true : false;

            if (!verifiedLicence) {
                // Licence verification
                try {
                    var licence = await this.getLicenseFs(configuration);
                    if (licence.exists) {
                        if (licence.data().customer !== configuration.barCode) {

                            this.$alert(
                                "Esta licencia pertenece a otro usuario, verifique su codigo del bar",
                                "Error de licencias",
                                "error"
                            );

                            this.$router.replace({
                                path: "config"
                            });
                            return false;
                        }

                        if (licence.data().type !== configuration.licenceType) {
                            this.$alert(
                                "Esta licencia no corresponde con el tipo de licencia seleccionado",
                                "Error de licencias",
                                "error"
                            );

                            this.$router.replace({
                                path: "config"
                            });
                            return false;
                        }

                        if (
                            licence.data().expiration_date.seconds < this.timestamp().seconds
                        ) {
                            var fechaExpiracion = this.$moment
                                .unix(licence.data().expiration_date.seconds)
                                .format("DD MMMM YYYY, h:mm:ss a");

                            this.$alert(
                                "Esta licencia expiró el " +
                                fechaExpiracion +
                                ", por favor compre una nueva ó cambie el tipo de licencia a Basico",
                                "La licencia a expirado !!!",
                                "warning"
                            );

                            this.openLicenceSite();
                            this.$router.replace({
                                path: "config"
                            });
                            return false;
                        }
                    } else {
                         this.$alert(
                                "Esta licencia no es valida. Puede comprar una licencia en nuestro sitio web.",
                                "Licencia inválida",
                                "warning"
                            );
                            
                        this.openLicenceSite();
                        this.$router.replace({
                            path: "config"
                        });
                        return false;
                    }
                } catch (error) {
                     this.$alert(
                                "Error al obtener información de la licencia",
                                "Verifica tu conexión a Internet",
                                "warning"
                            );
                    return false;
                }
            }
            this.loadingMessage = "Licencia Correcta";
        }
    }
};
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
