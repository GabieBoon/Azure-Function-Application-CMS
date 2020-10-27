<template>
<div>
    <h2>
        Bluetooth Beacons
        <v-btn class="ma-2" small outlined color="teal" @click="newBeacon">
            NIEUW
        </v-btn>
    </h2>

    <v-alert type="success" v-if="message != null && message.type == 'success'">
        {{ message.text }}
    </v-alert>
    <v-alert type="warning" v-if="message != null && message.type == 'warning'">
        {{ message.text }}
    </v-alert>

    <v-progress-circular v-if="loading" :size="50" color="teal" indeterminate></v-progress-circular>

    <v-simple-table v-if="!loading">
        <thead>
            <tr>
                <th class="text-left">
                    ID
                </th>
                <th class="text-left">
                    Location
                </th>
                <th class="text-left">
                    Name
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
            <tr v-for="beacon in beacons" :key="beacon.id">
                <td>{{ beacon.id }}</td>
                <td>{{ locationName(beacon.locationId) }}</td>
                <td>{{ beacon.name }}</td>
                <td>{{ beacon.lat }}</td>
                <td>{{ beacon.lng }}</td>

                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="teal" @click="editItem(beacon.id)">
                        <v-icon dark>mdi-pen</v-icon>
                        <span>Wijzig</span>
                    </v-btn>
                </td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="red" @click="deleteItem(beacon.id)">
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
            message: null,
            beacons: [],
            locations: [],
            selectedLocation : 0
        }
    },
    mounted() {
        this.getLocations();
        this.getBeacons();
    },
    methods: {
        getBeacons() {
            axios
                .get("/beacons")
                .then((response) => {   
                    this.loading = false;
                    this.beacons = response.data;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        editItem(beaconId) {
            this.$router.push({
                name: 'beaconEdit',
                params: {
                    beaconId: beaconId
                }
            })
        },
        deleteItem(beaconId) {
            console.log(beaconId);
            axios
                .delete("/beacons/" + beaconId)
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.message = {
                            type: "success",
                            text: "Succesvol verwijderd"
                        }
                        this.getBeacons();
                    }
                    // on error
                    else {
                        this.message = {
                            type: "warning",
                            text: response.data != "" ? response.data.message : response.data
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        newBeacon() {
            this.$router.push({ 
                name: 'beaconCreate'
            })
        },
        getLocations() {
            axios
                .get("/locations")
                .then((response) => {
                    this.loading = false;
                    this.locations = response.data;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        locationName(id){
            var location = this.locations.find(l => l.id == id)
            if (location != null){
            return location["name"]
            }
        }
    }
}
</script>

<style>
.table-small {
    width: 50px;
}
</style>
