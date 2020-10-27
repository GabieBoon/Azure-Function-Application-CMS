<template>
<div>
    <h2>Evenement aanmaken</h2>

    <section>
        <v-form @submit.prevent="saveEvenement">
            <b-field label="Locatie van evenement">
                <b-select v-model="selectedLocation">
                    <option v-for="location in locations" :value="location.id" :key="location.id">
                        {{location.name}}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Titel" message="De titel van het evenement">
                <b-input type="text" name="title" v-model="event.title"></b-input>
            </b-field>

            <b-field label="Beschrijving" message="Beschrijving van het evenement">
                <b-input type="text" name="type" v-model="event.description" minlength="2" maxlength="200"></b-input>
            </b-field>

            <b-field label="Datum en tijd" message="De datum en tijd van het evenement">
                <b-datetimepicker v-model="event.starttime" rounded placeholder="Klik om te selecteren..." icon="calendar-today" locale="nl-NL" horizontal-time-picker></b-datetimepicker>
            </b-field>

            <b-field label="Afbeelding" message="Alleen png, jpg of jpeg">
                <div class="image-preview-block">
                    <span>Kies een afbeelding</span>
                    <el-avatar shape="square" :size="100" fit="fill" :src="image.url"></el-avatar>
                    <input type="file" ref="image" accept="image/*" @change="imageChange">
                </div>
            </b-field>

            <b-field label="Aantal deelnemers" message="Het maximaal aantal deelnemers dat zich online kan inschrijven">
                <b-numberinput v-model="event.maxRegistrations"></b-numberinput>
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
    data() {
        return {
            loading: false,
            disabled: false,
            exercises: [],
            selectedLocation: 0,
            locations: [],
            event: {
                title: "",
                description: "",
                starttime: new Date(),
                image: "",
                maxRegistrations: 20
            },
            image: {
                name: "",
                file: "",
                url: ""
            },
        }
    },
    mounted() {
        this.getLocations();
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
        saveEvenement() {
            this.loading = true;

            var bodyFormData = new FormData();

            var starttimeDate = new Date(this.event.starttime);

            bodyFormData.append("Title", this.event.title);
            bodyFormData.append("Description", this.event.description);
            bodyFormData.append("StartTime", starttimeDate.toISOString());
            bodyFormData.append("Image", this.image.file, this.image.name);
            bodyFormData.append("MaxRegistrations", this.event.maxRegistrations);

            axios
                .post(
                    "/locations/" + this.selectedLocation + "/events", bodyFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.$buefy.toast.open({
                            message: "Succesvol aangemaakt",
                            type: 'is-success'
                        })
                        this.disabled = true;
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

.list-add,
.forms-select,
.el-select {
    width: 500px;
}

ul {
    list-style-type: disc;
}

.image-preview-block>* {
    display: block;
    margin-bottom: 5px;
}
</style>
