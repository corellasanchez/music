<template>
<md-content>
    <form novalidate class="md-layout md-app config-form" @submit.prevent="validateForm">
        <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-content>
                <md-card-header>
                    <div class="md-title">Licencia del Programa</div>
                </md-card-header>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field>
                            <label for="licenceType">Seleccione su tipo de licencia:</label>
                            <md-select name="licenceType" id="licenceType" v-model="form.licenceType" md-dense :disabled="sending" @md-selected="licenceChange($event)">
                                <md-option value="0">Básica</md-option>
                                <md-option value="1">Plus</md-option>
                                <md-option value="2">Profesional</md-option>
                            </md-select>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-small-size-100 licence-desc" v-if="form.licenceType == 0">
                        <p class="md-subheading success">- Gratis</p>
                        <p class="md-subheading success">
                            - Los clientes pueden poner canciones de su biblioteca
                        </p>
                        <p class="md-subheading success">
                            - Los clientes pueden enviarse mensajes con el chat
                        </p>
                        <p class="md-subheading fail">
                            - Aparecerá publicidad de nuestros anunciantes
                        </p>
                        <p class="md-subheading fail">- Modo Karaoke desactivado</p>
                        <p class="md-subheading fail">
                            - No puedes poner publicidad de texto pantallas
                        </p>
                        <p class="md-subheading fail">
                            - No puedes poner imagenes publicitarias en pantallas
                        </p>
                        <p class="md-subheading fail">
                            - No puedes publicidad en video las pantallas
                        </p>
                        <p class="md-subheading fail">
                            - No puedes vender créditos a los clientes
                        </p>
                        <p class="md-subheading fail">
                            - No puedes enviar mensajes a tus clientes
                        </p>
                    </div>

                    <div class="md-layout-item md-small-size-100 licence-desc" v-if="form.licenceType == 1">
                        <p class="md-subheading success">
                            - Los clientes pueden poner canciones de su biblioteca
                        </p>
                        <p class="md-subheading success">
                            - Los clientes pueden enviarse mensajes con el chat
                        </p>
                        <p class="md-subheading success">
                            - Libre de publicidad de terceros
                        </p>
                        <p class="md-subheading success">
                            - Se puede activar el modo KARAOKE
                        </p>
                        <p class="md-subheading success">
                            - Puedes poner publicidad de texto en las pantallas
                        </p>
                        <p class="md-subheading fail">
                            - No puedes poner imagenes publicitarias en pantallas
                        </p>
                        <p class="md-subheading fail">
                            - No puedes publicidad en video las pantallas
                        </p>
                        <p class="md-subheading fail">
                            - No puedes vender créditos a los clientes
                        </p>
                        <p class="md-subheading fail">
                            - No puedes enviar mensajes a tus clientes
                        </p>
                        <md-button v-if="!form.licence" @click="openLicenceSite()" class="md-raised md-primary">Comprar una licencia ahora</md-button>
                    </div>

                    <div class="md-layout-item md-small-size-100 licence-desc" v-if="form.licenceType == 2">
                        <p class="md-subheading success">
                            - Los clientes pueden poner canciones de su biblioteca
                        </p>
                        <p class="md-subheading success">
                            - Los clientes pueden enviarse mensajes con el chat
                        </p>
                        <p class="md-subheading success">
                            - Libre de publicidad de terceros
                        </p>
                        <p class="md-subheading success">
                            - Se puede activar el modo KARAOKE
                        </p>
                        <p class="md-subheading success">
                            - Puedes poner publicidad de texto en las pantallas
                        </p>
                        <p class="md-subheading success">
                            - Puedes poner imagenes publicitarias en pantallas
                        </p>
                        <p class="md-subheading success">
                            - Puedes publicidad en video las pantallas
                        </p>
                        <p class="md-subheading success">
                            - Puedes vender créditos a los clientes
                        </p>
                        <p class="md-subheading success">
                            - Puedes enviar mensajes a tus clientes una vez por semana
                        </p>
                        <md-button v-if="!form.licence" @click="openLicenceSite()" class="md-raised md-primary">Comprar una licencia ahora</md-button>
                    </div>
                </div>

                <div class="md-layout md-gutter" v-if="form.licenceType == 1 || form.licenceType == 2">
                    <div class="md-layout-item md-size-50 md-small-size-100">
                        <md-field :class="getValidationClass('licence')">
                            <label for="folder">Licencia del programa</label>
                            <md-input name="licence" id="licence" v-model="form.licence" />
                            <span class="md-helper-text">*La licencia es necesaria para que el programa cuente con
                                todas sus funcionalidades.</span>
                            <span class="md-error">La licencia debe ser válida</span>
                        </md-field>
                    </div>
                </div>

                <md-divider></md-divider>
                <md-card-header>
                    <div class="md-title">Datos del establecimento</div>
                </md-card-header>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('name')">
                            <label for="last-name">*Nombre del Bar o establecimiento</label>
                            <md-input name="last-name" id="last-name" v-model="form.name" :disabled="sending" />
                            <span class="md-error" v-if="!$v.form.name.required">El nombre es requerido</span>
                            <span class="md-error" v-else-if="!$v.form.name.minlength">El nombre es muy corto</span>
                        </md-field>
                    </div>
                </div>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('email')">
                            <label for="last-name">*Email</label>
                            <md-input name="email" id="email" v-model="form.email" :disabled="sending" />
                            <span class="md-error" v-if="!$v.form.email.required">El email es requerido</span>
                            <span class="md-error" v-else-if="!$v.form.email.email">El formato del email es inválido</span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('phone')">
                            <label for="phone">Teléfono para reservaciones</label>
                            <md-input name="phone" id="phone" v-model="form.phone" :disabled="sending" type="number" />
                        </md-field>
                    </div>
                </div>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('wifi')">
                            <label for="wifi">*Nombre de la red WiFi</label>
                            <md-input name="wifi" id="wifi" v-model="form.wifi" :disabled="sending" />
                            <span class="md-helper-text">** Los usuarios deben estar conectados en la misma red para que se conecten al local.</span>
                            <span class="md-error" v-if="!$v.form.wifi.required">El nombre de la red WiFi es requerido</span>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('wifi_password')">
                            <label for="wifi_password">Contraseña de la red WiFi</label>
                            <md-input name="wifi_password" id="wifi_password" v-model="form.wifi_password" :disabled="sending" />
                             <span class="md-helper-text">** Esta contraseña aparecerá en las pantallas.</span>
                            <span class="md-error" v-if="!$v.form.wifi_password.required">La Contraseña de la red WiFi es requerida</span>
                        </md-field>
                    </div>
                </div>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('direccion')">
                            <label for="last-name">*Dirección</label>
                            <md-input name="address" id="address" v-model="form.address" :disabled="sending" />
                            <span class="md-error" v-if="!$v.form.name.required">La dirección es requerida</span>
                            <span class="md-error" v-else-if="!$v.form.name.minlength">Indique la calle o la dirección exacta del
                                establecimiento</span>
                        </md-field>
                    </div>
                </div>

                <md-divider></md-divider>

                <md-card-header>
                    <div class="md-title">Directorios locales</div>
                </md-card-header>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('musicFolder')" md-clearable>
                            <label for="musicFolder">*Directorio donde se guarda la MUSICA</label>
                            <md-input name="musicFolder" id="musicFolder" v-model="form.musicFolder" @keydown="disableKeys($event)" @click="selectFolder('music')" />
                            <span class="md-helper-text">*El directorio debe tener permisos de lectura y
                                escritura.</span>
                            <span class="md-error" @click="selectFolder('music')">Click aquí para seleccionar el directorio</span>
                        </md-field>
                    </div>
                </div>
                <div class="md-layout md-gutter" v-if="form.licenceType !== '0'">
                    <div class="md-layout-item md-small-size-100">
                        <md-field md-clearable>
                            <label for="karaoke">Directorio donde se guarda el KARAOKE</label>
                            <md-input name="karaoke" id="karaoke" v-model="form.karaokeFolder" @keydown="disableKeys($event)" @click="selectFolder('karaoke')" />
                            <span class="md-helper-text">*El directorio debe tener permisos de lectura y
                                escritura.</span>
                            <span class="md-error" @click="selectFolder('karaoke')">Click aquí para seleccionar el directorio</span>
                        </md-field>
                    </div>
                </div>

                <md-divider></md-divider>

                <md-card-header>
                    <div class="md-title">Preferencias del reproductor</div>
                </md-card-header>

                <div class="md-layout md-gutter">
                    <div class="md-layout-item md-small-size-100">
                        <md-field :class="getValidationClass('maxSongs')">
                            <label for="gender">Máximo de canciones en cola por cliente</label>
                            <md-select name="maxSongs" id="maxSongs" v-model="form.maxSongs" md-dense :disabled="sending">
                                <md-option value="0">Sin límite</md-option>
                                <md-option value="1">1</md-option>
                                <md-option value="2">2</md-option>
                                <md-option value="3">3</md-option>
                                <md-option value="4">4</md-option>
                                <md-option value="5">5</md-option>
                                <md-option value="6">6</md-option>
                                <md-option value="7">7</md-option>
                                <md-option value="8">8</md-option>
                                <md-option value="9">9</md-option>
                                <md-option value="10">10</md-option>
                                <md-option value="20">20</md-option>
                                <md-option value="30">30</md-option>
                                <md-option value="40">40</md-option>
                                <md-option value="50">50</md-option>
                                <md-option value="100">100</md-option>
                            </md-select>
                            <span class="md-error">Número de canciones es requerido</span>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-small-size-100">
                        <md-field>
                            <label for="songsOrder">Ordenar las canciones</label>
                            <md-select name="songsOrder" id="songsOrder" v-model="form.songsOrder" md-dense :disabled="sending">
                                <md-option value="1">La primera en entrar primera en sonar</md-option>
                                <md-option value="2">Según los votos de los clientes</md-option>
                            </md-select>
                            <span class="md-error">En el modo votación la cancion mas votada sonará
                                primero</span>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-small-size-100" v-if="form.licenceType !== '0'">
                        <md-field>
                            <label for="karaokeTime">Tiempo de espera entre canciones de Karaoke</label>
                            <md-select name="karaokeTime" id="karaokeTime" v-model="form.karaokeTime" md-dense :disabled="sending">
                                <md-option value="0">Sin tiempo de espera</md-option>
                                <md-option value="10">10 segundos</md-option>
                                <md-option value="20">20 segundos</md-option>
                                <md-option value="30">30 segundos</md-option>
                                <md-option value="40">40 segundos</md-option>
                                <md-option value="50">50 segundos</md-option>
                                <md-option value="60">1 minuto</md-option>
                                <md-option value="120">2 minutos</md-option>
                                <md-option value="180">3 minutos</md-option>
                                <md-option value="240">4 minutos</md-option>
                                <md-option value="300">5 minutos</md-option>
                            </md-select>
                        </md-field>
                    </div>
                </div>
                <div class="md-layout md-gutter md-size-100">
                    <div class="md-layout-item md-small-size-100 left" v-if="form.licenceType !== '0'">
                        <md-checkbox v-model="form.karaokeMode">Activar modo KARAOKE</md-checkbox>
                        <br />
                        <span class="md-helper-text">*Los usuarios solo pueden poner canciones del folder de KARAOKE
                            se desactivará el chat.</span>
                    </div>
                    <div class="md-layout-item md-small-size-100 left">
                        <md-checkbox v-model="form.chatActive">Los usuarios pueden usar el CHAT (Los mensajes aparecerán en
                            las pantallas)</md-checkbox>
                    </div>
                    <div class="md-layout-item md-small-size-100 left">
                        <md-checkbox v-model="form.badWordsFilter">Activar filtro de malas palabras en el chat</md-checkbox>
                    </div>
                    <div class="md-layout-item md-small-size-100 left" v-if="form.licenceType === '2'">
                        <md-checkbox v-model="form.creditSale">Activar venta de créditos</md-checkbox>
                    </div>
                </div>
            </md-card-content>
            <md-divider></md-divider>

            <md-progress-bar md-mode="indeterminate" v-if="sending" />

            <md-card-actions class="action">
                <md-button class="md-raised md-primary" @click="regresar()">&lt; Regresar</md-button>
                <md-button type="submit" class="md-raised md-primary" :disabled="sending">Guardar Configuración</md-button>
            </md-card-actions>
        </md-card>

        <md-snackbar :md-active.sync="configurationSaved">"Configuración guardada correctamente"</md-snackbar>
        <!-- <pre>{{form}}</pre> -->
    </form>
    <md-dialog :md-active.sync="sending" :md-close-on-esc="false" :md-click-outside-to-close="false">
        <md-dialog-title>{{ savedMessage }}</md-dialog-title>
    </md-dialog>
</md-content>
</template>

<script>
import {
    validationMixin
} from "vuelidate";
import {
    mixins
} from "../helpers/mixins";
import {
    mixinsRequest
} from "../helpers/requestMixins";
import {
    mixinsFb
} from "../helpers/firebaseMixins";
import {
    required,
    email,
    minLength,
    maxLength,
} from "vuelidate/lib/validators";
import {
    mapState
} from "vuex";
import {
    v4 as uuidv4
} from "uuid";

export default {
    name: "FormValidation",
    mixins: [validationMixin, mixins, mixinsFb, mixinsRequest],
    data: () => ({
        form: {
            adsFolder: null,
            adsEach: 1,
            address: null,
            badWordsFilter: false,
            barCode: null,
            bannerDuration: 5,
            chatActive: false,
            creditSale: false,
            country_code: null,
            email: null,
            ip: null,
            karaokeFolder: null,
            karaokeMode: false,
            karaokeTime: 0,
            licence: "NO-LICENCE",
            licenceType: "0",
            maxSongs: 3,
            musicFolder: "",
            name: null,
            phone: null,
            region_name: null,
            songsOrder: 1,
            wifi: null,
            wifi_password: null
        },
        configurationSaved: false,
        sending: false,
        savedMessage: ".",
    }),
    validations: {
        form: {
            name: {
                required,
                minLength: minLength(3),
            },
            address: {
                required,
                minLength: minLength(3),
                maxLength: maxLength(500),
            },
            email: {
                required,
                email,
            },
            musicFolder: {
                required,
            },
            licence: {
                required,
            },
            wifi: {
                required,
            },
            wifi_password: {
                required,
            }
        },
    },
    mounted() {
        this.getConfiguration();
    },
    computed: {
        ...mapState(["musicFiles", "karaokeFiles", "ads"]),
    },
    methods: {
        regresar() {
            this.$router.replace({
                path: "player",
            });
        },
        getValidationClass(fieldName) {
            const field = this.$v.form[fieldName];
            if (field) {
                return {
                    "md-invalid": field.$invalid && field.$dirty,
                };
            }
        },
        getConfiguration() {
            if (this.$settings.has("configuration")) {
                this.form = this.$settings.get("configuration");

                if (!this.form.ip) {
                    this.getIpInfo()
                        .then((response) => {
                            this.form.ip = response.data.ip;
                            this.form.country_code = response.data.country_code;
                            this.form.region_name = response.data.region_name;
                        })
                        .catch((error) => {
                            this.$alert(
                                "Error localizacion",
                                "No se pudo obtener su localizacion" + error,
                                "error"
                            );
                        });
                }
            }
        },
        async saveConfiguration() {
            this.sending = true;
            this.configurationSaved = false;
            this.savedMessage = "Guardando la configuracíon";

            if (!this.form.barCode) {
                this.form.barCode = uuidv4();
            }

            // console.log(this.form);

            var verifiedLicence = this.form.licenceType === "0" ? true : false;

            if (!verifiedLicence) {
                // Licence verification
                try {
                    var licence = await this.getLicenseFs(this.form);
                    if (licence.exists) {
                        if (licence.data().customer !== this.form.barCode) {
                            this.$alert(
                                "Esta licencia pertenece a otro usuario, verifique su codigo del bar",
                                "Error de licencias",
                                "warning"
                            );
                            this.sending = false;
                            return false;
                        }

                        if (licence.data().type !== this.form.licenceType) {
                            this.$alert(
                                "Esta licencia no corresponde con el tipo de licencia seleccionado",
                                "Error de licencias",
                                "warning"
                            );
                            this.sending = false;
                            return false;
                        }

                        if (
                            licence.data().expiration_date.seconds < this.timestamp().seconds
                        ) {
                            this.$alert(
                                "Esta licencia ha expirado, por favor compre una nueva o cambie el tipo de licencia a básico",
                                "Error de licencias",
                                "warning"
                            );

                            this.openLicenceSite();
                            this.sending = false;
                            return false;
                        }
                    } else {
                        this.$alert(
                            "Esta licencia no es valida. Puede comprar una licencia en nuestro sitio web.",
                            "Licencia inválida",
                            "warning"
                        );

                        this.openLicenceSite();
                        this.sending = false;
                        return false;
                    }
                } catch (error) {
                    this.$alert(
                        "Error al obtener información de la licencia" + error,
                        "Verifica tu conexión a Internet",
                        "error"
                    );
                    this.sending = false;
                    return false;
                }
            }

            try {
                var customerFs = await this.getCustomerFs(this.form);
            } catch (error) {
                this.$alert(
                    "Verifica tu conexión a Internet",
                    "Error al obtener información del cliente" + error,
                    "error"
                );

                this.sending = false;
                return false;
            }

            if (customerFs.exists) {
                // the customer exists

                if (
                    this.verifyPassword(this.form.password, customerFs.data().password)
                ) {
                    // save the configuration to the local settings
                    this.$settings.set("configuration", this.form);

                    // save the customer in the db
                    this.saveCustomerFs(this.form);

                    await this.indexFolders();

                    this.savedMessage = "Configuración guardada";
                    this.sending = false;
                    this.configurationSaved = true;
                    this.configurationUpdated(this.form);
                    this.$router.replace({
                        path: "player",
                    });
                } else {
                    // Wrong password
                    this.$alert(
                        "No se guardo la configuración, verifique su contraseña o utilice la función para restablecer su contraseña",
                        "Contraseña incorrecta",
                        "error"
                    );
                    this.sending = false;
                    return false;
                }
            } else {
                // New costumer
                // save the configuration to the local settings
                this.$settings.set("configuration", this.form);

                // save the customer in the db
                this.saveCustomerFs(this.form);

                await this.indexFolders();

                this.savedMessage = "Nuevo establecimiento registrado";
                this.sending = false;
                this.configurationSaved = true;
                this.configurationUpdated(this.form);
                this.$router.replace({
                    path: "player",
                });
            }
        },
        async indexFolders() {
            if (this.form.musicFolder) {
                this.savedMessage = "Actualizando canciones...";
                var cachedMusicFiles = await this.indexFolder(this.form.musicFolder);
                this.$store.commit("setMusicFiles", cachedMusicFiles);
                if (this.musicFiles.length === 0) {
                    this.$alert(
                        "Debes elegir una carpeta que tenga canciones en video .mp4 o .mp3",
                        "No se encontraron canciones",
                        "warning"
                    );
                    this.form.musicFolder = "";
                    this.sending = false;
                    return;
                }
                this.savedMessage = "Canciones actualizadas";
            }

            if (this.form.karaokeFolder && this.form.licenceType !== "0") {
                this.savedMessage = "Actualizando canciones de Karaoke...";
                var cachedKaraokeFiles = await this.indexFolder(
                    this.form.karaokeFolder
                );
                this.$store.commit("setKaraokeFiles", cachedKaraokeFiles);
                this.savedMessage = "Canciones de Karaoke actualizadas";
            }
        },

        validateForm() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                this.$alert(
                    "Algunos campos son obligatorios, revisa los datos",
                    "No se pudo guardar la configuración",
                    "warning"
                );
            } else {
                this.saveConfiguration();
            }
        },
        selectFolder(type) {
            this.$ipcRenderer.invoke("openFolder").then((result) => {
                if (result) {
                    switch (type) {
                        case "music":
                            this.form.musicFolder = result;
                            break;

                        case "karaoke":
                            this.form.karaokeFolder = result;
                            break;

                        case "ads":
                            this.form.adsFolder = result;

                            break;

                        default:
                            break;
                    }
                }
            });
        },
        disableKeys: function (evt) {
            evt.preventDefault();
        },
        licenceChange(event) {
            if (event == "0") {
                this.form.licence = "NO-LICENCE";
                this.form.karaokeFolder = "";
                this.form.adsFolder = "";
                this.form.creditSale = false;
                this.form.karaokeMode = false;
            }
            if (event !== "0" && this.form.licence == "NO-LICENCE") {
                this.form.licence = "";
            }
        },
    },
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
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
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
</style>
