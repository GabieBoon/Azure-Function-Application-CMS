<template>
<div>
    <h2>Gebruiker wijzigen</h2>

    <v-progress-circular v-if="loading" :size="50" color="teal" indeterminate></v-progress-circular>

    <section v-if="!loading">
        <v-form @submit.prevent="saveUser">
            <b-field label="Naam">
                <b-input type="text" v-model="user.name" minlength="2" maxlength="50"></b-input>
            </b-field>

            <b-field label="Email">
                <b-input type="text" v-model="user.email" minlength="2" maxlength="50"></b-input>
            </b-field>

            <b-field label="Geboortedatum">
                <b-datepicker v-model="user.dateofbirth" locale="nl-NL" placeholder="Selecteer datum..." icon="calendar-today" trap-focus>
                </b-datepicker>
            </b-field>

            <b-field label="Wachtwoord">
                <b-input type="password" v-model="user.password" minlength="2" maxlength="50"></b-input>
            </b-field>

            <b-field label="Geslacht">
                <b-select placeholder="Kies een geslacht" v-model="user.gender">
                    <option v-for="(gender, key) in genders" :value="key" :key="key">
                        {{ gender }}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Type">
                <b-select placeholder="Select a name" v-model="user.type">
                    <option v-for="(type, key) in types" :value="key" :key="key">
                        {{ type }}
                    </option>
                </b-select>
            </b-field>

            <v-btn outlined color="teal" type="submit" :loading="loadingButton">
                Opslaan
            </v-btn>
        </v-form>
    </section>
</div>
</template>

<script>
import axios from '../../axios-auth';

export default {
    props: [
        'id'
    ],
    data() {
        return {
            loading: true,
            loadingButton: false,
            genders: [
                'Man',
                'Vrouw',
                'Anders'
            ],
            types: [
                'Administrator',
                'Organisator',
                'Gebruiker'
            ],
            user: {
                id: "",
                name: "",
                email: "",
                password: "",
                dateofbirth: "",
                gender: "",
                type: "",
            }
        }
    },
    mounted() {
        this.getUser(this.id);
    },
    methods: {
        getUser(id) {
            axios
                .get("/users/" + id)
                .then((response) => {
                    this.user.name = response.data.name;
                    this.user.email = response.data.email;
                    this.user.password = response.data.password;
                    this.user.dateofbirth = new Date(response.data.dateofbirth);
                    this.user.gender = response.data.gender;
                    this.user.type = response.data.type;
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        saveUser() {
            this.loadingButton = true;

            axios
                .put(
                    "/users/" + this.id, {
                        name: this.user.name,
                        email: this.user.email,
                        password: this.user.password,
                        dateofbirth: this.user.dateofbirth,
                        gender: this.user.gender,
                        type: this.user.type,
                    })
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.user.name = response.data.name;
                        this.user.email = response.data.email;
                        this.user.dateofbirth = new Date(response.data.dateofbirth);
                        this.user.gender = response.data.gender;
                        this.user.type = response.data.type;
                        this.$buefy.toast.open({
                            message: "Succesvol opgeslagen",
                            type: 'is-success'
                        })
                    }
                    // on error
                    else {
                        this.$buefy.toast.open({
                            message: response.response.data != "" ? response.response.data.message : response.response.data,
                            type: 'is-danger'
                        })
                    }
                    this.loadingButton = false;
                })
                .catch((error) => {
                    // on error
                    this.$buefy.toast.open({
                        message: error.response.data != "" ? error.response.data.message : error.response.data,
                        type: 'is-danger'
                    })
                    this.loadingButton = false;
                });
        }
    }
}
</script>

<style> 
</style>
