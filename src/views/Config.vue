<template>
    <div>
        <form novalidate class="md-layout md-app" @submit.prevent="validateUser">
            <md-card class="md-layout-item md-size-100 md-small-size-100">
                <md-card-header>
                    <div class="md-title">Configuración</div>
                </md-card-header>
    
                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('barCode')">
                                <label for="bar-code">Código del Bar</label>
                                <md-input name="bar-code" id="bar-code upper" autocomplete="given-name" v-model="form.barCode" :disabled="sending" @input="barCodeChanged"/>
                                <span class="md-error" v-if="!$v.form.barCode.required">Este código será solicitado para que los usuarios puedan poner música, aparecerá en las pantallas, es requerido.</span>
                                <span class="md-error" v-else-if="!$v.form.barCode.alphaNum">El código contener solo números o letras sin espacios</span>
                                <span class="md-error" v-else-if="!$v.form.barCode.minlength">El código debe tener al menos 3 carácteres</span>
                            </md-field>
                        </div>
    
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('lastName')">
                                <label for="last-name">Last Name</label>
                                <md-input name="last-name" id="last-name" autocomplete="family-name" v-model="form.lastName" :disabled="sending" />
                                <span class="md-error" v-if="!$v.form.lastName.required">The last name is required</span>
                                <span class="md-error" v-else-if="!$v.form.lastName.minlength">Invalid last name</span>
                            </md-field>
                        </div>
                    </div>
    
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('gender')">
                                <label for="gender">Gender</label>
                                <md-select name="gender" id="gender" v-model="form.gender" md-dense :disabled="sending">
                                    <md-option></md-option>
                                    <md-option value="M">M</md-option>
                                    <md-option value="F">F</md-option>
                                </md-select>
                                <span class="md-error">The gender is required</span>
                            </md-field>
                        </div>
    
                        <div class="md-layout-item md-small-size-100">
                            <md-field :class="getValidationClass('age')">
                                <label for="age">Age</label>
                                <md-input type="number" id="age" name="age" autocomplete="age" v-model="form.age" :disabled="sending" />
                                <span class="md-error" v-if="!$v.form.age.required">The age is required</span>
                                <span class="md-error" v-else-if="!$v.form.age.maxlength">Invalid age</span>
                            </md-field>
                        </div>
                    </div>
    
                    <md-field :class="getValidationClass('email')">
                        <label for="email">Email</label>
                        <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending" />
                        <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
                        <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
                    </md-field>
                </md-card-content>
    
                <md-progress-bar md-mode="indeterminate" v-if="sending" />
    
                <md-card-actions>
                    <md-button type="submit" class="md-primary" :disabled="sending">Create user</md-button>
                </md-card-actions>
            </md-card>
    
            <md-snackbar :md-active.sync="userSaved">The user {{ lastUser }} was saved with success!</md-snackbar>
        </form>
    </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
    required,
    email,
    minLength,
    maxLength,
    alphaNum
} from "vuelidate/lib/validators";

export default {
    name: "FormValidation",
    mixins: [validationMixin],
    data: () => ({
        form: {
            barCode: null,
            lastName: null,
            gender: null,
            age: null,
            email: null
        },
        userSaved: false,
        sending: false,
        lastUser: null
    }),
    validations: {
        form: {
            barCode: {
                required,
                minLength: minLength(3),
                alphaNum
            },
            lastName: {
                required,
                minLength: minLength(3)
            },
            age: {
                required,
                maxLength: maxLength(3)
            },
            gender: {
                required
            },
            email: {
                required,
                email
            }
        }
    },
    methods: {
        getValidationClass(fieldName) {
            const field = this.$v.form[fieldName];

            if (field) {
                return {
                    "md-invalid": field.$invalid && field.$dirty
                };
            }
        },
        clearForm() {
            this.$v.$reset();
            this.form.barCode = null;
            this.form.lastName = null;
            this.form.age = null;
            this.form.gender = null;
            this.form.email = null;
        },
        saveUser() {
            this.sending = true;

            // Instead of this timeout, here you can call your API
            window.setTimeout(() => {
                this.lastUser = `${this.form.barCode} ${this.form.lastName}`;
                this.userSaved = true;
                this.sending = false;
                this.clearForm();
            }, 1500);
        },
        validateUser() {
            this.$v.$touch();

            if (!this.$v.$invalid) {
                this.saveUser();
            }
        },
        barCodeChanged(){
           this.form.barCode =  String(this.form.barCode).toUpperCase();
        }

    }
};

</script>

<style>
.md-app {
    height: 100vh;
}

.md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
}
</style>