<template>
<md-content>
    <form novalidate class="md-layout md-app config-form" @submit.prevent="validateForm">
        <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-content>
                <md-toolbar class="md-accent" v-if="configuration.licenceType == '0' || configuration.licenceType == '1'">
                    <p class="md-title">Sólo con la licencia Profesional pueden activar los videos e imagenes publicitarias, actualiza tu licencia.</p>
                </md-toolbar>
                <md-card-header>
                    <div class="md-title">Publicidad (Anuncios del local en video o imagen)</div>
                </md-card-header>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field md-clearable>
                            <label for="adsFolder">Directorio para los ANUNCIOS</label>
                            <md-input name="adsFolder" id="adsFolder" v-model="form.adsFolder" @keydown="disableKeys($event)" @click="selectFolder('ads')" />
                            <span class="md-helper-text">Elija un folder local donde guardaran las imagenes publicitarias y los videos.</span>
                            <span class="md-error" @click="selectFolder('ads')">Click aquí para seleccionar el directorio</span>
                        </md-field>
                        <p class="left small success">
                            Para las imágenes se recomienda el un tamaño de 150 pixeles de alto y de 1024 a 2000 pixeles de largo en formato .jpg .png o .gif
                            <br />Para los videos se recomienda el formato .mp4
                        </p>
                        <p> banners {{banners}}</p>
<p> video ads {{videoAds}}</p>
                    </div>
                </div>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100" v-if="configuration.licenceType === '2'">
                        <md-field>
                            <label for="adsEach">Mis anuncios de video se mostraran después de:</label>
                            <md-select name="adsEach" id="adsEach" v-model="form.adsEach" md-dense :disabled="sending">
                                <md-option value="1">cada canción</md-option>
                                <md-option value="2">2 canciones</md-option>
                                <md-option value="3">3 canciones</md-option>
                                <md-option value="4">4 canciones</md-option>
                                <md-option value="5">5 canciones</md-option>
                                <md-option value="6">6 canciones</md-option>
                                <md-option value="7">7 canciones</md-option>
                                <md-option value="8">8 canciones</md-option>
                                <md-option value="9">9 canciones</md-option>
                                <md-option value="10">10 canciones</md-option>
                                <md-option value="11">11 canciones</md-option>
                                <md-option value="12">12 canciones</md-option>
                                <md-option value="13">13 canciones</md-option>
                                <md-option value="14">14 canciones</md-option>
                                <md-option value="15">15 canciones</md-option>
                                <md-option value="20">20 canciones</md-option>
                                <md-option value="30">20 canciones</md-option>
                                <md-option value="40">40 canciones</md-option>
                                <md-option value="50">50 canciones</md-option>
                            </md-select>
                        </md-field>
                    </div>
                </div>
            </md-card-content>
            <md-card-actions class="action">
                <md-button class="md-raised md-primary" @click="regresar()">&lt; Regresar</md-button>
                <md-button class="md-raised md-primary" @click="validateForm()" :disabled="sending || configuration.licenceType !== '2' || !form.adsFolder">Guardar directorio de anucios</md-button>
            </md-card-actions>
        </md-card>

        <md-snackbar :md-active.sync="configurationSaved">"Configuración guardada correctamente"</md-snackbar>
    </form>

    <image-ads-component :duration="Number(duration)" :showDemo="false"></image-ads-component>
    <md-dialog :md-active.sync="sending" :md-close-on-esc="false" :md-click-outside-to-close="false">
        <md-dialog-title>{{savedMessage}}</md-dialog-title>
    </md-dialog>
</md-content>
</template>

<script>
import {
    validationMixin
} from "vuelidate";
import {
    required
} from "vuelidate/lib/validators";
import {
    mapState,
    mapMutations
} from "vuex";
import {
    ImageAdsComponent
} from "../components";
import {
    mixinsFb
} from "../helpers/firebaseMixins";
const {
    dialog
} = require("electron").remote;
const settings = require("electron-settings");

export default {
    name: "",
    mixins: [validationMixin, mixinsFb],
    data: () => ({
        form: {
            adsFolder: null,
            adsEach: 1
        },
        input: "",
        search: "",
        configurationSaved: false,
        sending: false,
        configuration: {},
        savedMessage: "",
        duration: Number
    }),
    validations: {
        form: {
            adsFolder: {
                required
            }
        }
    },
    mounted() {
        this.getConfiguration();
        this.selectedColor = "#ffffff";
    },
    components: {
        ImageAdsComponent
    },
    computed: {
        ...mapState(["banners","videoAds"]),
        ...mapMutations(["setBanners", "setVideoAds"])
    },
    methods: {
        regresar() {
            this.$router.replace({
                path: "player"
            });
        },
        getValidationClass(fieldName) {
            const field = this.$v.form[fieldName];
            if (field) {
                return {
                    "md-invalid": field.$invalid && field.$dirty
                };
            }
        },
        getConfiguration() {
            if (settings.has("configuration")) {
                this.configuration = settings.get("configuration");
                this.form.adsEach = this.configuration.adsEach;
                this.form.adsFolder = this.configuration.adsFolder;
            }
        },

        validateForm() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                dialog.showErrorBox(
                    "No se pudo guardar la configuracion",
                    "Algunos campos son obligatorios, revisa los datos"
                );
            } else {
                this.saveConfiguration();
                this.form.message = null;
            }
        },
        async saveConfiguration() {
            this.sending = true;
            this.configurationSaved = false;
            this.savedMessage = "Guardando la configuracíon";
            var newConfiguration = Object.assign({}, this.configuration);
            newConfiguration.adsFolder = this.form.adsFolder;
            newConfiguration.adsEach = this.form.adsEach;

            try {
                this.saveCustomerFs(newConfiguration);
                settings.set("configuration", newConfiguration);
              
              if (this.form.adsFolder && this.form.licenceType === "2") {
                    this.savedMessage = "Actualizando anuncios...";
                    var cachedBannerFiles = await this.indexFolder(
                        this.configuration.adsFolder,
                        "images"
                    );
                    this.$store.commit("setBanners", cachedBannerFiles);

                    var cachedVideoAdsFiles = await this.indexFolder(
                        this.configuration.adsFolder,
                        "videos"
                    );
                    this.$store.commit("setVideoAds", cachedVideoAdsFiles);

                    this.savedMessage = "Anuncios actualizados";
                }
              
                this.savedMessage = "Configuración guardada";
                this.sending = false;
                this.configurationSaved = true;
            } catch (error) {
                dialog.showErrorBox(
                    "Error al guardar la configuracion",
                    "Verifica tu conexión a Internet " + error
                );
                this.sending = false;
                return false;
            }
        },
        selectFolder() {
            dialog
                .showOpenDialog({
                    properties: ["openFile", "openDirectory"]
                })
                .then(result => {
                    this.form.adsFolder = result.filePaths[0];
                })
                .catch(err => {
                    dialog.showErrorBox(
                        "No se pudo seleccionar un folder, verifica que el folder tenga pemisos de lectura ",
                        "error " + err
                    );
                    // console.log(err);
                });
        },
        disableKeys: function (evt) {
            evt.preventDefault();
        }
    },
    directives: {
        focus: {
            inserted(el) {
                el.focus();
            }
        }
    }
};
</script>

<style>
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
    margin-bottom: 40px;
}

.config-form {
    overflow-y: scroll;
    min-height: 100px;
    margin-left: 40px;
    padding-right: 35px;
}

::-webkit-scrollbar {
    width: 12px;
}

::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

.md-gutter {
    padding-bottom: 20px;
}

.md-card-header {
    padding-top: 42px;
}

.success {
    color: greenyellow;
}

.fail {
    color: #ff4040;
}

.licence-desc {
    text-align: left;
}

.md-card {
    box-shadow: none;
}

.wrapper {
    position: relative;
    display: inline-block;
}

.regular-input {
    padding: 0.5rem 1rem;
    border-radius: 3px;
    border: 1px solid #ccc;
    width: 20rem;
    height: 12rem;
    outline: none;
}

.regular-input:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

.emoji-invoker {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
}

.emoji-invoker:hover {
    transform: scale(1.1);
}

.emoji-invoker>svg {
    fill: #b1c6d0;
}

.emoji-picker {
    position: absolute;
    left: 0px;
    bottom: -379px;
    z-index: 6;
    border: 1px solid #ccc;
    width: 100%;
    height: 20rem !important;
    overflow: scroll;
    padding: 1rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 0.5rem;
    background: #fff;
    -webkit-box-shadow: 1px 1px 8px #c7dbe6;
    box-shadow: 1px 1px 8px #c7dbe6;
    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.emoji-picker__search {
    display: flex;
}

.emoji-picker__search>input {
    flex: 1;
    border-radius: 10rem;
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    outline: none;
}

.emoji-picker h5 {
    margin-bottom: 0;
    color: #b1b1b1;
    text-transform: uppercase;
    font-size: 0.8rem;
    cursor: default;
}

.emoji-picker .emojis {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.emoji-picker .emojis:after {
    content: "";
    flex: auto;
}

.emoji-picker .emojis span {
    padding: 0.4rem;
    cursor: pointer;
    border-radius: 5px;
    font-size: 2rem;
}

.emoji-picker .emojis span:hover {
    background: #ececec;
    cursor: pointer;
}

.icon-input {
    padding-right: 40px !important;
}

.sc {
    width: 20px;
    height: 18px;
    margin-top: 6px;
    margin-right: 8px;
}

.save {
    padding-top: 10px;
}

.danger {
    color: red;
}

.messageListText {
    text-align: left !important;
    font-size: 1rem;
}

.left-button {
    display: block;
    max-height: 25px !important;
}

.small {
    padding-top: 10px;
    font-weight: normal;
    font-size: 12px;
}
</style>
