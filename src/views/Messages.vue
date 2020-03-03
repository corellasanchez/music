<template>
  <md-content>
    <form novalidate class="md-layout md-app config-form" @submit.prevent="validateForm">
      <md-card class="md-layout-item md-size-100 md-small-size-100">
        <md-card-content>
          <md-card-header>
            <div class="md-title">Anuncios de texto</div>
          </md-card-header>

          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('message')">
                <label>*Mensaje que quieres mostrar en las pantallas</label>
                <md-input
                  id="message"
                  class="icon-input"
                  type="text"
                  v-model="form.message"
                  :disabled="sending"
                ></md-input>
                <span
                  class="md-helper-text"
                >*Este mensaje se muestra en la barra de mensajes abajo del video.</span>
                <span
                  class="md-error"
                  v-if="!$v.form.message.required"
                >Este código será solicitado para que los usuarios puedan poner música, aparecerá en las pantallas, es requerido.</span>
                <emoji-picker @emoji="append" :search="search">
                  <div
                    class="emoji-invoker"
                    slot="emoji-invoker"
                    slot-scope="{ events: { click: clickEvent } }"
                    @click.stop="clickEvent"
                  >
                    <svg
                      height="48"
                      viewBox="0 0 48 48"
                      width="48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
                      />
                    </svg>
                  </div>

                  <div slot="emoji-picker" slot-scope="{ emojis, insert }">
                    <div class="emoji-picker">
                      <!-- <div class="emoji-picker__search">
                                                                                                        <input type="text" v-model="search" v-focus>
                      </div>-->
                      <div>
                        <div v-for="(emojiGroup, category) in emojis" :key="category">
                          <h5>{{ category }}</h5>
                          <div class="emojis">
                            <span
                              v-for="(emoji, emojiName) in emojiGroup"
                              :key="emojiName"
                              @click="insert(emoji)"
                              :title="emojiName"
                            >{{ emoji }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </emoji-picker>
              </md-field>
            </div>
            <div class="md-layout-item md-size-20">
              <md-field>
                <label for="color">Seleccione el color del texto:</label>
                <div class="sc" :style="{'background-color': selectedColor}">{{form.selectedColor}}</div>
                <md-select name="color" id="color" v-model="selectedColor" :disabled="sending">
                  <md-option value="#ffffff">Blanco</md-option>
                  <md-option value="blue">Azul</md-option>
                  <md-option value="#00FFFF">Celeste</md-option>
                  <md-option value="#2ECC40">Verde</md-option>
                  <md-option value="#01FF70">Lima</md-option>
                  <md-option value="#FFFF00">Amarillo</md-option>
                  <md-option value="#FF851B">Naranja</md-option>
                  <md-option value="#FF0000">Rojo</md-option>
                  <md-option value="#FF0099">Rosado</md-option>
                  <md-option value="#F012BE">Fuchsia</md-option>
                  <md-option value="#B10DC9">Morado</md-option>
                  <md-option value="#AAAAAA">Gris</md-option>
                  <md-option value="#DDDDDD">Plateado</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="md-layout-item md-size-15 save">
              <md-button
                class="md-raised md-primary"
                @click="validateForm()"
                :disabled="sending"
              >Agregar Anuncio</md-button>
            </div>
          </div>

          <md-divider></md-divider>
          <md-card-header>
            <div class="md-title">Anuncios actuales</div>
          </md-card-header>
          <md-list>
            <md-list-item v-for="textAd in localTextAds" :key="textAd.index">
              <md-button class="md-icon-button md-accent" @click="removeMessage(textAd)">
                <md-icon>delete</md-icon>
              </md-button>
              <span class="md-list-item-text" :style="{color: textAd.color}">{{textAd.text}}</span>
            </md-list-item>
          </md-list>
        </md-card-content>
      </md-card>

      <md-snackbar :md-active.sync="configurationSaved">"Configuración guardada correctamente"</md-snackbar>
    </form>
    <text-ads-component></text-ads-component>
    <md-dialog
      :md-active.sync="sending"
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
    >
      <md-dialog-title>{{savedMessage}}</md-dialog-title>
    </md-dialog>
  </md-content>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapState, mapMutations } from "vuex";
import { TextAdsComponent } from "../components";

const { dialog } = require("electron").remote;
const settings = require("electron-settings");

export default {
  name: "Messages",
  mixins: [validationMixin],
  data: () => ({
    form: {
      message: null
    },
    input: "",
    search: "",
    configurationSaved: false,
    sending: false,
    savedMessage: ".",
    selectedColor: ""
  }),
  validations: {
    form: {
      message: {
        required
      }
    }
  },
  mounted() {
    this.getConfiguration();
    this.selectedColor = "#ffffff";
  },
  components: {
    TextAdsComponent
  },
  computed: {
    ...mapState(["localTextAds"]),
    ...mapMutations(["addLocalTextAd"])
  },
  methods: {
    append(emoji) {
      if (this.form.message) {
        this.form.message += emoji;
      } else {
        this.form.message = emoji;
      }
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
      if (settings.has("localTextAds")) {
        this.$store.commit("setLocalTextAds", settings.get("localTextAds"));
      }
    },

    validateForm() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        dialog.showErrorBox(
          "No se pudo agregar el mensaje",
          "Algunos campos son obligatorios, revisa los datos"
        );
      } else {
        this.addMessage();
        this.form.message = null;
      }
    },
    addMessage() {
      var message = {};
      message.text = this.form.message;
      message.color = this.selectedColor;
      message.index = this.localTextAds ? this.localTextAds.length + 1 : 1;
      this.$store.commit("addLocalTextAd", message);
      settings.set("localTextAds", this.localTextAds);
    },
    removeMessage(textAd) {
      this.$store.commit("removeLocalTextAd", textAd);
      settings.set("localTextAds", this.localTextAds);
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

.emoji-invoker > svg {
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

.emoji-picker__search > input {
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
</style>