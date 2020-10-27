<template>
<div>
    <h2>Locatie aanmaken</h2>

    <v-alert type="success" v-if="message != null && message.type == 'success'">
        {{ message.text }}
    </v-alert>
    <v-alert type="warning" v-if="message != null && message.type == 'warning'">
        {{ message.text }}
    </v-alert>

    <section>
        <v-form @submit.prevent="saveLocation">
            <b-field label="Naam" message="De naam van de Skills Garden">
                <b-input type="text" name="name" v-model="location.name"></b-input>
            </b-field>

            <b-field label="Plaats" message="De plaats waar de Skills Garden ligt">
                <b-input type="text" name="city" v-model="location.city" minlength="2" maxlength="50">
                </b-input>
            </b-field>

            <b-field label="Latitude" message="De latitude van de Skills Garden">
                <b-input type="text" name="lat" v-model="location.lat">
                </b-input>
            </b-field>

            <b-field label="Longitude" message="De longitude van de Skills Garden">
                <b-input type="text" name="lng" v-model="location.lng">
                </b-input>
            </b-field>

            <b-field label="Afbeelding" message="De afbeelding voor de Skills Garden">
                <div class="image-preview-block">
                    <span>Kies een afbeelding</span>
                    <el-avatar shape="square" :size="100" fit="fill" :src="image.url"></el-avatar>
                    <input type="file" ref="image" accept="image/*" @change="imageChange">
                </div>
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
            location: {
                name: "",
                city: "",
                lat: "",
                lng: ""
            },
            image: {
                name: "",
                file: "",
                url: ""
            }
        }
    },
    methods: {
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
            this.loading = true;

            var bodyFormData = new FormData();

            bodyFormData.append("Name", this.location.name);
            bodyFormData.append("City", this.location.city);
            bodyFormData.append("Lat", this.location.lat);
            bodyFormData.append("Lng", this.location.lng);
            bodyFormData.append("Image", this.image.file, this.image.name);

            this.message = null;

            axios
                .post(
                    "/locations",
                    bodyFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.message = {
                            type: "success",
                            text: "Succesvol aangemaakt"
                        }
                        this.disabled = true;
                    }
                    // on error
                    else {
                        this.message = {
                            type: "warning",
                            text: response.data != "" ? response.data.message : response.data
                        }
                    }
                    this.loading = false;
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
    margin-bottom: -10px;
}

.v-form>.container {
    padding-left: 0;
}

.image-preview-block>* {
    display: block;
    margin-bottom: 5px;
}
</style>
