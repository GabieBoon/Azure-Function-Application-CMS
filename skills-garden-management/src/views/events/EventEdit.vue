<template>
<div>
    <h2>Evenement wijzigen</h2>

    <section>
        <v-form @submit.prevent="saveEvenement">
            <b-field label="Titel" message="De titel van het evenement">
                <b-input type="text" name="title" v-model="event.title"></b-input>
            </b-field>

            <b-field label="Beschrijving" message="Beschrijving van het evenement">
                <b-input type="textarea" name="type" v-model="event.description" minlength="2" maxlength="500"></b-input>
            </b-field>

            <b-field label="Datum en tijd" message="De datum en tijd van het evenement">
                <b-datetimepicker v-model="event.startTime" rounded placeholder="Klik om te selecteren..." icon="calendar-today" locale="nl-NL" horizontal-time-picker></b-datetimepicker>
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

            <v-btn outlined color="teal" type="submit" :loading="loading">
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
        'locationId',
        'eventId'
    ],
    data() {
        return {
            loading: false,
            event: {
                title: "",
                description: "",
                startTime: new Date(),
                image: "",
                maxRegistrations: 20
            },
            image: {
                name: "",
                file: "",
                url: ""
            },
            movementforms: [
                "klimmen",
                "balans",
                "mikken",
                "gooien",
                "springen",
                "zwaaien",
                "rollen",
                "hardlopen",
                "overspelen",
                "stoeien"
            ]
        }
    },
    mounted() {
        this.getEvenement();
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
        getEvenement() {
            axios
                .get("/locations/" + this.locationId + '/events/' + this.eventId)
                .then((response) => {
                    this.loading = false;
                    this.event.title = response.data.title;
                    this.event.description = response.data.description;
                    this.event.startTime = new Date(response.data.startTime);
                    this.event.maxRegistrations = response.data.maxRegistrations;
                    this.event.image = response.data.image;
                    this.image.url = response.data.image;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        saveEvenement() {
            this.loading = true;

            var bodyFormData = new FormData();

            var startTimeDate = new Date(this.event.startTime);

            bodyFormData.append("Title", this.event.title);
            bodyFormData.append("Description", this.event.description);
            bodyFormData.append("StartTime", startTimeDate.toISOString());
            if (this.image.file != "") bodyFormData.append("Image", this.image.file, this.image.name);
            bodyFormData.append("MaxRegistrations", this.event.maxRegistrations);

            axios
                .put(
                    "/locations/" + this.locationId + '/events/' + this.eventId, bodyFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
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

.list-add,
.forms-select,
.el-select {
    width: 500px;
}

ul {
    list-style-type: disc;
}

.el-transfer-panel {
    width: 700px;
}

.image-preview-block>* {
    display: block;
    margin-bottom: 5px;
}

.b-numberinput {
    width: 200px;
}

.b-numberinput .control button {
    background: #009688;
}
</style>
