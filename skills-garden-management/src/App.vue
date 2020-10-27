<template>
<v-app>
    <v-app-bar app color="teal" dark>
        <v-spacer></v-spacer>
        <v-btn text id="logout">
            <v-icon>mdi-logout</v-icon>
            <span class="mr-2" @click="logout">Uitloggen</span>
        </v-btn>
    </v-app-bar>

    <Menu />

    <v-main>
        <v-container class="py-8 px-6" fluid>
            <v-row id="main-row">
                <router-view />
            </v-row>
        </v-container>
    </v-main>
</v-app>
</template>

<script>
import Menu from './components/Menu';

export default {
    name: 'App',
    components: {
        Menu,
    },
    data: () => ({
        //
    }),
    methods: {
        logout() {
            this.$store.dispatch('logout')
        }
    }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;700&display=swap');

* {
    font-family: 'Assistant', sans-serif !important;
}

.v-toolbar__content {
    background: white;
    border-bottom: 1px solid #009688;
    height: 50px !important;
}

header {
    box-shadow: none !important;
}

.v-main {
    background: #f8f8f8;
}

.v-navigation-drawer__content {
    background: #eaeaea;
}

header {
    height: 50px !important;
}

#menu-header {
    height: 50px !important;
    background: white !important;
    color: #009688 !important;
    border-bottom: 1px solid #009688;
    font-size: 12px;
    font-weight: normal;
}

#main-row {
    margin-top: -10px;
    padding-left: 20px;
    padding-right: 20px;
}

#main-row>div {
    width: 100%;
}

#logout {
    color: #009688;
}

.v-list-item {
    height: 50px;
}

.v-list {
    padding-top: 0;
}

#menu-header h2 {
    line-height: 30px;
}

.v-main>.v-main__wrap>.container {
    margin-top: -20px;
}

.v-list-item__icon {
    margin: 12px 12px 12px 5px;
}

.v-list-item__content {
    margin-left: -10px;
}

.v-main h2 {
    font-size: 22px;
    padding-top: 5px;
    padding-bottom: 15px;
    font-weight: 600;
}

.v-card {
    background: transparent !important;
}

.v-card__actions {
    padding: 0;
}

#menu-header h2 {
    font-size: 22px;
    font-weight: 500;
}

.container {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    margin-top: -20px !important;
}

th,
td {
    line-height: 40px;
    font-size: 15px !important;
}

.v-data-table {
    -webkit-box-shadow: 2px 2px 5px 0px rgba(196, 196, 196, 1);
    -moz-box-shadow: 2px 2px 5px 0px rgba(196, 196, 196, 1);
    box-shadow: 2px 2px 5px 0px rgba(196, 196, 196, 1);
}

.v-alert {
    margin: 0 0 10px 0 !important;
}
</style>
