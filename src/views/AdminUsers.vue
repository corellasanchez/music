<template>
<md-content>
    <form novalidate class="md-layout md-app config-form">
        <md-card class="md-layout-item md-size-100 md-small-size-100">
            <md-card-content>
                <md-toolbar class="md-accent" v-if="configuration.licenceType != '2'">
                    <p class="md-title">
                        Sólo la licencia Profesional pueden vender creditos y agregar usuarios actualiza tu licencia.
                    </p>
                </md-toolbar>
                <md-card-header>
                    <div class="md-title">Usuarios administrativos</div>
                </md-card-header>

                <div class="md-layout md-gutter"  v-if="configuration.licenceType === '2'">
                    <div class="md-layout-item md-small-size-50">
                        <md-field maxlength=20>
                            <label>*Usuario</label>
                            <md-input v-model="user" type="text"></md-input>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-50">
                        <md-field maxlength=20>
                            <label>*Contraseña</label>
                            <md-input v-model="password" type="password"></md-input>
                        </md-field>
                    </div>

                    <div class="md-layout-item md-size-15 save">
                        <md-button class="md-raised md-primary" @click="validateForm()" :disabled="sending">Agregar Usuario</md-button>
                    </div>
                </div>

                <md-divider></md-divider>
                <md-card-header>
                    <div class="md-title">Usuarios activos</div>
                </md-card-header>
                <md-list>
                    <div class="md-layout md-gutter" v-for="user in adminUsers" :key="user.name">
                        <div class="small-button">
                            <md-button class="md-icon-button md-accent left-button" @click="removeUser(user)">
                                <md-icon>delete</md-icon>
                            </md-button>
                        </div>
                        <div class="md-layout-item md-small-size-100 messageListText">
                            {{ user.name }}
                        </div>
                        <md-divider></md-divider>
                    </div>
                </md-list>
            </md-card-content>
            <md-card-actions class="action">
                <md-button class="md-raised md-primary" @click="regresar()">&lt; Regresar</md-button>
            </md-card-actions>
        </md-card>

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
    required
} from "vuelidate/lib/validators";
import {
    mapState,
    mapMutations
} from "vuex";

export default {
    name: "Messages",
    mixins: [validationMixin],
    data: () => ({

        user: '',
        password: '',
        savedMessage: '',
        sending: false,
        configuration: {},
    }),
    validations: {
        form: {
            message: {
                required,
            },
        },
    },
    mounted() {
        this.getConfiguration();
        this.selectedColor = "#ffffff";
    },
    computed: {
        ...mapState(["adminUsers"]),
        ...mapMutations(["setAdminUsers"]),
    },
    methods: {
        regresar() {
            this.$router.replace({
                path: "player",
            });
        },
        append(emoji) {
            if (this.form.message) {
                this.form.message += emoji;
            } else {
                this.form.message = emoji;
            }
        },
        getConfiguration() {
            if (this.$settings.has("adminUsers")) {
                this.$store.commit(
                    "setAdminUsers",
                    this.$settings.get("adminUsers")
                );
            }
          this.configuration = this.$settings.get("configuration");
        },

        validateForm() {
            console.log(this.user, this.password);
            if (!this.user || !this.password) {
                this.$alert(
                    "Debes incluir el nombre del usuario y la contraseña, revisa los datos",
                    "No se puede agregar el usuario",
                    "error"
                );
            } else {
                const i = this.adminUsers.findIndex(x => x.name === this.user.toLowerCase());
                if (i > -1) {
                    this.$alert(
                        "Ya existe un usuario con ese nombre, revisa los datos",
                        "No se puede agregar el usuario",
                        "error"
                    );
                } else {
                    this.addUser();
                    this.user = '';
                    this.password = '';
                }
            }
        },
        addUser() {
            var user = {};
            user.name = this.user.toLowerCase();
            user.password = this.password;
            this.$store.commit("addAdminUser", user);
            this.$settings.set("adminUsers", this.adminUsers);
        },
        removeUser(user) {
            this.$store.commit("removeAdminUser", user);
            this.$settings.set("adminUsers", this.adminUsers);
        },
    },
    directives: {
        focus: {
            inserted(el) {
                el.focus();
            },
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
</style>
