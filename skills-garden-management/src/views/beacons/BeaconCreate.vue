<template>
<div>
    <h2>Beacon aanmaken</h2>

    <v-alert type="success" v-if="message != null && message.type == 'success'">
        {{ message.text }}
    </v-alert>
    <v-alert type="warning" v-if="message != null && message.type == 'warning'">
        {{ message.text }}
    </v-alert>

    <section>
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

            <b-field label="Naam" message="De naam van de beacon">
                <b-input type="text" name="name" v-model="beacon.name"></b-input>
            </b-field>

            <b-field label="Breedtegraad" message="De breedtegraad van de coordinaat van de beacon  gebruik een (.) om decimalen aan te geven">
                <el-input-number v-model="beacon.lat" :precision="8" :min="3" :max="8" :controls="false"></el-input-number>
            </b-field>  

            <b-field label="Lengtegraad" message="De lengtegraad van de coordinaat van de beacon - gebruik een (.) om decimalen aan te geven">
                <el-input-number v-model="beacon.lng" :precision="8" :min="50" :max="53" :controls="false"></el-input-number>
            </b-field>  

            <v-btn outlined color="teal" type="submit" :loading="loading" :disabled="disabled">
                Aanmaken
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
            loading: false,
            disabled: false,
            message: null,
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
        this.getLocations();
    },
    methods: {
        saveBeacon() {
            this.loadingButton = true;

            axios
                .post(
                    "/beacons", {
                        locationId: this.beacon.locationId,
                        name: this.beacon.name,
                        lat: this.beacon.lat,
                        lng: this.beacon.lng
                    })
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.beacon.locationId = response.data.locationId;
                        this.beacon.name = response.data.name;
                        this.beacon.lat = response.data.lat;
                        this.beacon.lng = response.data.lng;
                        this.$buefy.toast.open({
                            message: "Succesvol aangemaakt",
                            type: 'is-success'
                        })
                        this.disabled = true;
                    }
                    // on error
                    else {
                        this.$buefy.toast.open({
                            message: response.data != "" ? response.data.message : response.data,
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
    },
        watch:{
        selectedLocation:function(value){
            console.log(value)
            this.beacon.locationId = value
        }
    }
}
</script>

<style>
.v-alert {
    margin-top: 10px;
    margin-bottom: -10px;
}

.v-form>.container {
    padding-left: 0;
}
</style>
