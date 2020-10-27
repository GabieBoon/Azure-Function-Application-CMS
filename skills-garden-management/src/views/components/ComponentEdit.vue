<template>
<div>
    <h2>Onderdeel wijzigen</h2>

    <section>
        <v-form @submit.prevent="saveComponent">
            <b-field label="Locatie van onderdeel">
                <b-select v-if="location != null" v-model="selectedLocation" disabled>
                    <option value="0" selected>
                        {{location.name}}
                    </option>
                </b-select>
            </b-field>

            <b-field label="Naam" message="De naam van het onderdeel">
                <b-input type="text" name="name" v-model="component.name"></b-input>
            </b-field>

            <b-field label="Beschrijving" message="De beschrijving van het onderdeel">
                <b-input type="text" name="city" v-model="component.description" minlength="2" maxlength="50">
                </b-input>
            </b-field>

            <b-field label="Afbeelding" message="Alleen png, jpg of jpeg">
                <div class="image-preview-block">
                    <span>Kies een nieuwe afbeelding</span>
                    <el-avatar shape="square" :size="100" fit="fill" :src="component.image"></el-avatar>
                    <input type="file" ref="image" accept="image/*" @change="imageChange">
                </div>
            </b-field>

            <section>
                <b-field class="field" label="Oefeningen" message="Selecteer de oefeningen voor deze component en zet ze in de rechter lijst">
                    <el-transfer v-if="exercises != []" :titles="['Alle oefeningen', 'Oefeningen voor dit onderdeel']" :render-content="renderFunc" filterable :filter-method="filterMethod" filter-placeholder="Zoek op beweegvorm" v-model="component.exercises" :data="exercises"></el-transfer>
                </b-field>
            </section>

            <v-btn outlined color="teal" type="submit" :loading="loading" :disabled="disabled">
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
        'componentId'
    ],
    data() {
        return {
            loading: false,
            disabled: false,
            component: {
                name: "",
                description: "",
                image: "",
                exercises: []
            },
            image: {
                name: "",
                file: "",
                url: ""
            },
            location: null,
            selectedLocation: 0,
            exerciseCheckBox: [],
            exercises: [],
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
            ],
            renderFunc(h, option) {
                return <span> {
                    option.label
                } ({
                    option.movementforms
                }) </span>;
            },
            filterMethod(query, item) {
                return item.movementforms.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
        }
    },
    mounted() {
        this.getLocation();
        this.getComponent();
        this.getExercises();
    },
    methods: {
        getLocation() {
            axios
                .get("/locations/" + this.locationId)
                .then((response) => {
                    this.loading = false;
                    this.location = response.data;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        getComponent() {
            axios
                .get("/locations/" + this.locationId + "/components/" + this.componentId)
                .then((response) => {
                    this.loading = false;
                    this.component.name = response.data.name;
                    this.component.description = response.data.description;
                    this.component.image = response.data.image;
                    this.component.exercises = response.data.exercises;
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
                    this.component.image = fr.result
                    this.image.url = fr.result
                    this.image.file = files[0]
                })
            } else {
                this.component.image = ''
                this.image.name = ''
                this.image.file = ''
                this.image.url = ''
            }
        },
        saveComponent() {
            this.loading = true;

            var bodyFormData = new FormData();

            bodyFormData.append("Name", this.component.name);
            bodyFormData.append("Description", this.component.description);
            bodyFormData.append("Exercises", this.component.exercises);
            if (this.image.file != "") bodyFormData.append("Image", this.image.file, this.image.name);

            axios
                .put(
                    "/locations/" + this.locationId + "/components/" + this.componentId,
                    bodyFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.$buefy.toast.open({
                            message: 'Succesvol opgeslagen',
                            type: 'is-success'
                        })
                        this.disabled = true;
                    }
                    // on error
                    else {
                        this.response = response;
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
        getExercises() {
            axios
                .get("/exercises")
                .then((response) => {
                    console.log(response.data);
                    this.loading = false;
                    var self = this;
                    response.data.forEach(exercise => {
                        var movementforms = '';
                        exercise.forms.forEach(form => {
                            if (movementforms != '') {
                                movementforms = movementforms + ', '
                            }
                            movementforms = movementforms + self.movementforms[form];
                        });
                        self.exercises.push({
                            label: exercise.name,
                            key: exercise.id,
                            movementforms: movementforms
                        });
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        }
    },
    watch: {
        selectedLocation: function (value) {
            this.selectedLocation = value
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

.el-transfer-panel {
    width: 700px;
}

.image-preview-block > * {
    display: block;
    margin-bottom: 5px;
}
</style>
