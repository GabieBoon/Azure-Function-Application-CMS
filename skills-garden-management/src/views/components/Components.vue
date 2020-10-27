<template>
<div>
    <h2>
        Onderdelen
        <v-btn class="ma-2" small outlined color="teal" @click="newComponent">
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

    <b-field label="Geselecteerde locatie">    
        <b-select v-model="selectedLocation">
            <option
                v-for="location in locations"
                :value="location.id"
                :key="location.id">
                {{location.name}}
            </option>
        </b-select>
    </b-field>

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
                    Beschrijving
                </th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="component in components" :key="component.id">
                <td>{{ component.id }}</td>
                <td>{{ component.name }}</td>
                <td>{{ component.description }}</td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="teal" @click="editItem(component.id)">
                        <v-icon dark>mdi-pen</v-icon>
                        <span>Wijzig</span>
                    </v-btn>
                </td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="red" @click="deleteItem(selectedLocation, component.id)">
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
            components: [],
            locations: [],
            selectedLocation : 0
        }
    },
    mounted() {
        this.getLocations();
    },
    methods: {
        getComponents(locationId) {
            this.selectedLocation = locationId;
            axios
                .get("/locations/" + locationId + "/components")
                .then((response) => {   
                    this.loading = false;
                    this.components = response.data;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        editItem(componentId) {
            this.$router.push({
                name: 'componentEdit',
                params: {
                    locationId: this.selectedLocation,
                    componentId: componentId
                }
            })
        },
        deleteItem(locationId, componentId) {
            console.log(locationId);
            console.log(componentId);

            axios
                .delete("/locations/" + locationId + "/components/" + componentId)
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.message = {
                            type: "success",
                            text: "Succesvol verwijderd"
                        }
                        this.getComponents(this.selectedLocation);
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
        newComponent() {
            this.$router.push({
                name: 'componentCreate'
            })
        },
        getLocations() {
            axios
                .get("/locations")
                .then((response) => {
                    this.loading = false;
                    this.locations = response.data;
                    this.getComponents(this.locations[0].id);
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        }
    },
    watch:{
        selectedLocation:function(value){
            this.components = this.getComponents(value)
        }
    }
}
</script>

<style>
.table-small {
    width: 50px;
}
</style>
