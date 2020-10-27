<template>
<v-app>
    <v-main>
        <v-container class="py-8 px-6" fluid>
            <v-row id="main-row">
                <v-container fill-height fluid id="login-container">
                    <v-row justify="center">
                        <v-col cols="8" md="6" lg="4">
                            <v-card ref="form">
                                <v-card-text>
                                    <h2>Inloggen</h2>
                                    <v-alert v-if="authData.error" type="error">
                                        {{ authData.error.message }}
                                    </v-alert>
                                    <v-text-field v-model="authData.email" label="Email"></v-text-field>
                                    <v-text-field v-model="authData.password" type="password" label="Wachtwoord"></v-text-field>
                                    <v-btn color="primary" @click="login"> Login </v-btn>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-row>
        </v-container>
    </v-main>
</v-app>
</template>

<script>
export default {
    components: {},
    data: () => ({
        authData: {
            email: "",
            password: "",
            error: ""
        }
    }),
    methods: {
        login() {
            this.$store
                .dispatch("login", this.authData)
                .then(() => window.open("/", "_self"))
                .catch(err => console.log(err));
        }
    }
};
</script>

<style scoped>
#login-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    background: white;
    z-index: 1000;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}
</style>
