<template>
<div>
    <h2>Beacon wijzigen</h2>

    <v-progress-circular v-if="loading" :size="50" color="teal" indeterminate></v-progress-circular>

    <section v-if="!loading">
        <v-form @submit.prevent="saveBeacon">
            <b-field label="Locatie" message="De locatie waar de beacon zich bevind">    
                <b-select v-model="selectedLocation">
                    <option
                        v-for="location in locations"
                        :value="location.id"
                        :key="location.id">
                        {{location.name}}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Naam" message="De naam van de Skills Garden">
                <b-input type="text" name="name" v-model="beacon.name"></b-input>
            </b-field>

            <b-field label="Breedtegraad" message="De breedtegraad van de coordinaat van de beacon - gebruik een (.) om decimalen aan te geven">
                <el-input-number v-model="beacon.lat" :precision="8" :min="3" :max="8" :controls="false"></el-input-number>
            </b-field>  

            <b-field label="Lengtegraad" message="De lengtegraad van de coordinaat van de beacon - gebruik een (.) om decimalen aan te geven">
                <el-input-number v-model="beacon.lng" :precision="8" :min="50" :max="53" :controls="false"></el-input-number>
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
        'beaconId'
    ],
    data() {
        return {
            loading: true,
            loadingButton: false,
            oldBeacon: {
                locationId: "",
                name: "",
                lat: "",
                lng: ""
            },
            beacon: {
                locationId: "",
                name: "",
                lat: "",
                lng: ""
            },
            locations : [],
            selectedLocation : 0
        }
    },
    mounted() {
        this.getBeacon(this.beaconId);
        this.getLocations();
    },
    methods: {
        getBeacon(id) {
            axios
                .get("/beacons/" + id)
                .then((response) => {
                    this.oldBeacon = response.data;
                    this.beacon = response.data;
                    this.selectedLocation = this.beacon.locationId
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        saveBeacon() {
            this.loading = true;

            axios
                .put(
                    "/beacons/" + this.beaconId, {
                        locationId: this.selectedLocation,
                        name: this.beacon.name,
                        lat: this.beacon.lat,
                        lng: this.beacon.lng
                    })
                .then((response) => {
                    // when success
                    if (response.status == 200) {
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
                    this.loading = false;
                })
                .catch((error) => {
                    this.$buefy.toast.open({
                        message: error.response.data != "" ? error.response.data.message : error.response.data,
                        type: 'is-danger'
                    })
                    this.loading = false;
                });
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
        }
    }
}
</script>

<style>
.v-alert {
    margin-top: 10px;
}

.v-form>.container {
    padding-left: 0;
}
</style>
