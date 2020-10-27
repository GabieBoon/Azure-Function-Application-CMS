<template>
<div>
    <h2>
        Oefeningen
        <v-btn class="ma-2" small outlined color="teal" @click="newExercise">
            NIEUW
        </v-btn>
    </h2>

    <v-progress-circular v-if="loading" :size="50" color="teal" indeterminate></v-progress-circular>

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
                    Beweegvormen
                </th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(exercise, index) in exercises" :key="exercise.id">
                <td>{{ exercise.id }}</td>
                <td>{{ exercise.name }}</td>
                <td>{{ exerciseForms(index) }}</td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="teal" @click="editItem(exercise.id)">
                        <v-icon dark>mdi-pen</v-icon>
                        <span>Wijzig</span>
                    </v-btn>
                </td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="red" @click="deleteItem(exercise.id)">
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
        }
    },
    mounted() {
        this.getExercises();
    },
    methods: {
        getExercises() {
            axios
                .get("/exercises")
                .then((response) => {
                    this.exercises = response.data;
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        editItem(id) {
            this.$router.push({
                name: 'exerciseEdit',
                params: {
                    exerciseId: id
                }
            })
        },
        deleteItem(id) {
            axios
                .delete("/exercises/" + id)
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.$buefy.toast.open({
                            message: "Succesvol verwijderd",
                            type: 'is-success'
                        })
                        this.getExercises();
                    }
                    // on error
                    else {
                        this.$buefy.toast.open({
                            message: response.data != "" ? response.data.message : response.data,
                            type: 'is-danger'
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        newExercise() {
            this.$router.push({
                name: 'exerciseCreate'
            })
        },
        exerciseForms(index) {
            var exercisesString = '';
            this.exercises[index].forms.forEach(form => {
                if (exercisesString != '') {
                    exercisesString = exercisesString + ', ';
                }
                exercisesString = exercisesString + this.movementforms[form];
            });
            return exercisesString;
        }
    }
}
</script>

<style>
.table-small {
    width: 50px;
}
</style>
