<template>
<div>
    <h2>
        Evenementen
        <v-btn class="ma-2" small outlined color="teal" @click="newWorkout">
            NIEUW
        </v-btn>
    </h2>

    <b-field label="Geselecteerde locatie">
        <b-select v-model="selectedLocation">
            <option v-for="location in locations" :value="location.id" :key="location.id">
                {{location.name}}
            </option>
        </b-select>
    </b-field>

    <v-progress-circular v-if="loading" :size="50" color="teal" indeterminate></v-progress-circular>

    <v-simple-table v-if="!loading">
        <thead>
            <tr>
                <th class="text-left">
                    ID
                </th>
                <th class="text-left">
                    Titel
                </th>
                <th class="text-left">
                    Organisator
                </th>
                <th class="text-left">
                    Tijd
                </th>
                <th class="text-left">
                    Deelnemers
                </th>
                <th class="text-left">
                    Maximaal deelnemersaantal
                </th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="evenement in evenementen" :key="evenement.id">
                <td>{{ evenement.id }}</td>
                <td>{{ evenement.title }}</td>
                <td>{{ evenement.organisor }}</td>
                <td>{{ evenement.startTime }}</td>
                <td>{{ evenement.registrations }}</td>
                <td>{{ evenement.maxRegistrations }}</td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="teal" @click="editItem(evenement.id)">
                        <v-icon dark>mdi-pen</v-icon>
                        <span>Wijzig</span>
                    </v-btn>
                </td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="red" @click="deleteItem(evenement.id)">
                        <v-icon dark>mdi-delete</v-icon>
                        <span>Verwijder</span>
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
            evenementen: [],
            locations: [],
            selectedLocation: 0
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
                    this.loading = false;
                    this.locations = response.data;
                    this.getEvenementen(this.locations[0].id);
                    this.selectedLocation = this.locations[0].id;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        getEvenementen(locationId) {
            axios
                .get("/locations/" + locationId + "/events")
                .then((response) => {
                    this.evenementen = response.data;
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        editItem(id) {
            this.$router.push({
                name: 'eventEdit',
                params: {
                    locationId: this.selectedLocation,
                    eventId: id
                }
            })
        },
        deleteItem(id) {
            axios
                .delete("/evenementen/" + id)
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.$buefy.toast.open({
                            message: "Succesvol verwijderd",
                            type: 'is-success'
                        })
                        this.getEvenementen();
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
        newWorkout() {
            this.$router.push({
                name: 'eventCreate'
            })
        }
    },
    watch: {
        selectedLocation: function (value) {
            this.components = this.getEvenementen(value)
        }
    }
}
</script>

<style>
.table-small {
    width: 50px;
}

.el-transfer-panel {
    width: 700px;
}
</style>
