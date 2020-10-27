<template>
<div>
    <h2>
        Workouts
        <v-btn class="ma-2" small outlined color="teal" @click="newWorkout">
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
                    Soort
                </th>
                <th class="text-left">
                    Aantal oefeningen
                </th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="workout in workouts" :key="workout.id">
                <td>{{ workout.id }}</td>
                <td>{{ workout.name }}</td>
                <td>{{ workout.type }}</td>
                <td>{{ workout.exercises }}</td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="teal" @click="editItem(workout.id)">
                        <v-icon dark>mdi-pen</v-icon>
                        <span>Wijzig</span>
                    </v-btn>
                </td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="red" @click="deleteItem(workout.id)">
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
            workouts: [],
        }
    },
    mounted() {
        this.getWorkouts();
    },
    methods: {
        getWorkouts() {
            axios
                .get("/workouts")
                .then((response) => {
                    this.workouts = response.data;
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        editItem(id) {
            this.$router.push({
                name: 'workoutEdit',
                params: {
                    workoutId: id
                }
            })
        },
        deleteItem(id) {
            axios
                .delete("/workouts/" + id)
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.$buefy.toast.open({
                            message: "Succesvol verwijderd",
                            type: 'is-success'
                        })
                        this.getWorkouts();
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
        newWorkout() {
            this.$router.push({
                name: 'workoutCreate'
            })
        }
    }
}
</script>

<style>
.table-small {
    width: 50px;
}

.el-transfer-panel {
    width: 700px;
}
</style>
