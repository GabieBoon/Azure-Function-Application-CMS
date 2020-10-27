<template>
<div>
    <h2>
        Locaties
        <v-btn class="ma-2" small outlined color="teal" @click="newLocation">
            NIEUW
        </v-btn>
    </h2>

    <v-progress-circular v-if="loading" :size="50" color="teal" indeterminate></v-progress-circular>

    <v-simple-table v-if="!loading">
        <thead>
            <tr>
                <th class="text-left">
                    ID
                </th>
                <th class="text-left">
                    Naam
                </th>
                <th class="text-left">
                    Stad
                </th>
                <th class="text-left">
                    Latitude
                </th>
                <th class="text-left">
                    Longitude
                </th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="location in locations" :key="location.id">
                <td>{{ location.id }}</td>
                <td>{{ location.name }}</td>
                <td>{{ location.city }}</td>
                <td>{{ location.lat }}</td>
                <td>{{ location.lng }}</td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="teal" @click="editItem(location.id)">
                        <v-icon dark>mdi-pen</v-icon>
                        <span>Edit</span>
                    </v-btn>
                </td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="red" @click="deleteItem(location.id)">
                        <v-icon dark>mdi-delete</v-icon>
                        <span>Remove</span>
                    </v-btn>
                </td>
            </tr>
        </tbody>
    </v-simple-table>
</div>
</template>

<script>
import axios from '../../axios-auth';

export default {
    data() {
        return {
            loading: true,
            locations: []
        }
    },
    mounted() {
        this.getLocations();
    },
    methods: {
        getLocations() {
            axios
                .get("/locations")
                .then((response) => {
                    this.locations = response.data;
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        editItem(id) {
            this.$router.push({
                name: 'locationEdit',
                params: {
                    id: id
                }
            })
        },
        deleteItem(id) {
            axios
                .delete("/locations/" + id)
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.$buefy.toast.open({
                            message: "Succesvol verwijderd",
                            type: 'is-success'
                        })
                        this.getLocations();
                    }
                    // on error
                    else {
                        this.$buefy.toast.open({
                            message: response.data != "" ? response.data.message : response.data,
                            type: 'is-danger'
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        newLocation() {
            this.$router.push({
                name: 'locationCreate'
            })
        }
    }
}
</script>

<style>
.table-small {
    width: 50px;
}
</style>
