<template>
<div>
    <h2>Workout wijzigen</h2>

    <section>
        <v-form @submit.prevent="saveWorkout">
            <b-field label="Naam" message="De naam van de workout">
                <b-input type="text" name="name" v-model="workout.name"></b-input>
            </b-field>

            <b-field label="Soort" message="Wat voor soort workout">
                <b-input type="text" name="type" v-model="workout.type" minlength="2" maxlength="200"></b-input>
            </b-field>

            <section>
                <b-field class="field" label="Oefeningen" message="Selecteer de oefeningen voor deze workout en zet ze in de rechter lijst">
                    <el-transfer v-if="workouts != []" :titles="['Alle oefeningen', 'Oefeningen voor deze workout']" :render-content="renderFunc" filterable :filter-method="filterMethod" filter-placeholder="Zoek op beweegvorm" v-model="selectedExercises" :data="exercises"></el-transfer>
                </b-field>
            </section>

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
        'workoutId'
    ],
    data() {
        return {
            loading: false,
            exercises: [],
            selectedExercises: [],
            workout: {
                name: "",
                type: "",
                exercises: []
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
        this.getWorkout();
        this.getExercises();
    },
    methods: {
        getExercises() {
            axios
                .get("/exercises")
                .then((response) => {
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
        },
        getWorkout() {
            axios
                .get("/workouts/" + this.workoutId)
                .then((response) => {
                    this.loading = false;
                    this.workout.name = response.data.name;
                    this.workout.type = response.data.type;
                    this.workout.exercises = response.data.exercises;
                    this.workout.exercises.forEach(exercise => {
                        this.selectedExercises.push(exercise.id);
                    })
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        saveWorkout() {
            this.loading = true;

            axios
                .put(
                    "/workouts/" + this.workoutId, {
                        name: this.workout.name,
                        type: this.workout.type,
                        exercises: this.selectedExercises,
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
</style>
