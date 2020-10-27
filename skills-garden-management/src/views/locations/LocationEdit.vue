<template>
<div>
    <h2>Locatie wijzigen</h2>

    <v-progress-circular v-if="loading" :size="50" color="teal" indeterminate></v-progress-circular>

    <section v-if="!loading">
        <v-form @submit.prevent="saveLocation">
            <b-field label="Naam" message="De naam van de Skills Garden">
                <b-input type="text" v-model="location.name" minlength="2" maxlength="50"></b-input>
            </b-field>

            <b-field label="Plaats" message="De plaats waar de Skills Garden ligt">
                <b-input type="text" v-model="location.city" minlength="2" maxlength="50"></b-input>
            </b-field>

            <b-field label="Latitude" message="De latitude van de Skills Garden">
                <b-input type="text" v-model="location.lat"></b-input>
            </b-field>

            <b-field label="Longitude" message="De longitude van de Skills Garden">
                <b-input type="text" v-model="location.lng"></b-input>
            </b-field>

            <b-field label="Afbeelding" message="De afbeelding voor de Skills Garden">
                <div class="image-preview-block">
                    <span>Kies een afbeelding</span>
                    <el-avatar shape="square" :size="100" fit="fill" :src="image.url"></el-avatar>
                    <input type="file" ref="image" accept="image/*" @change="imageChange">
                </div>
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
            oldLocation: {
                id: "",
                name: "",
                city: "",
                lat: "",
                lng: "",
                image: ""
            },
            location: {
                id: "",
                name: "",
                city: "",
                lat: "",
                lng: "",
                image: ""
            },
            image: {
                name: "",
                file: "",
                url: ""
            }
        }
    },
    mounted() {
        this.getLocation(this.id);
    },
    methods: {
        getLocation(id) {
            axios
                .get("/locations/" + id)
                .then((response) => {
                    this.oldLocation = response.data;
                    this.location = response.data;
                    this.image.url = response.data.image;
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        imageChange(e) {
            const files = e.target.files
            if (files[0] !== undefined) {
                this.image.name = files[0].name
                if (this.image.name.lastIndexOf('.') <= 0) {
                    return
                }
                const fr = new FileReader()
                fr.readAsDataURL(files[0])
                fr.addEventListener('load', () => {
                    this.image.url = fr.result
                    this.image.file = files[0]
                })
            } else {
                this.image.name = ''
                this.image.file = ''
                this.image.url = ''
            }
        },
        saveLocation() {
            this.loadingButton = true;

            var bodyFormData = new FormData();

            bodyFormData.append("Name", this.location.name);
            bodyFormData.append("City", this.location.city);
            bodyFormData.append("Lat", this.location.lat);
            bodyFormData.append("Lng", this.location.lng);
            if (this.image.file != "") bodyFormData.append("Image", this.image.file, this.image.name);

            axios
                .put(
                    "/locations/" + this.id,
                    bodyFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.location = response.data;
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
                    this.getLocation(this.id);
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
.v-alert {
    margin-top: 10px;
}

.v-form>.container {
    padding-left: 0;
}

.image-preview-block>* {
    display: block;
    margin-bottom: 5px;
}
</style>
