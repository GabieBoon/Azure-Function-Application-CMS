<template>
<v-navigation-drawer app>
    <div class="teal" id="menu-header" dark>
        <div class="d-flex align-center">
            <h2>Skills Garden CMS</h2>
        </div>
    </div>
    <v-list>
        <v-list-item v-for="item in items" :key="item.title" link>
            <v-list-item-icon v-if="item.icon">
                <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content v-if="item.title">
                <router-link :to="item.to">
                    <v-list-item-title>
                        {{item.title}}
                    </v-list-item-title>
                </router-link>
            </v-list-item-content>
            <v-subheader v-if="item.header" :key="item.header" inset>
                {{ item.header }}
            </v-subheader>
        </v-list-item>
    </v-list>
</v-navigation-drawer>
</template>

<script>
export default {
    data() {
        return {
            items: [{
                    icon: "mdi-home",
                    to: "/",
                    title: 'Dashboard'
                },
                {
                    header: "Skills Gardens"
                },
                {
                    icon: "mdi-map-marker",
                    to: "/locations",
                    title: 'Locaties'
                },
                {
                    icon: "mdi-billboard",
                    to: "/components",
                    title: 'Onderdelen'
                },
                {
                    icon: "mdi-calendar",
                    to: "/events",
                    title: 'Evenementen'
                },
                {
                    header: "Oefeningenbeheer"
                },
                {
                    icon: "mdi-basketball",
                    to: "/exercises",
                    title: 'Oefeningen'
                },
                {
                    icon: "mdi-weight-lifter",
                    to: "/workouts",
                    title: 'Workouts'
                },
                {
                    header: "Applicatiebeheer"
                },
                {
                    icon: "mdi-account",
                    to: "/users",
                    title: 'Gebruikers'
                },
                {
                    icon: "mdi-bluetooth-transfer",
                    to: "/beacons",
                    title: 'Beacons'
                },
            ]
        };
    }
};
</script>

<style scoped>
#menu-header {
    height: 64px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    color: white;
    padding: 10px 20px 10px 20px;
    line-height: 45px;
}

.v-list-item__content a {
    text-decoration: none;
    color: #333;
}

.v-subheader {
    margin-left: -11px;
    font-size: 14px;
    text-transform: uppercase;
    width: 96%;
    border-bottom: 1px solid #ccc;
    padding: 0;
    padding-left: 10px;
    position: absolute;
}
</style>
