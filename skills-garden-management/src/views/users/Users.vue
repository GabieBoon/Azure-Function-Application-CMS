<template>
<div>
    <h2>
        Gebruikers
        <v-btn class="ma-2" small outlined color="teal" @click="newUser">
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
                    Email
                </th>
                <th class="text-left">
                    Date of birth
                </th>
                <th class="text-left">
                    Gender
                </th>
                <th class="text-left">
                    Type
                </th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.dateofbirth }}</td>
                <td>{{ genders[user.gender] }}</td>
                <td>{{ types[user.type] }}</td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="teal" @click="editItem(user.id)">
                        <v-icon dark>mdi-pen</v-icon>
                        <span>Wijzig</span>
                    </v-btn>
                </td>
                <td class="table-small">
                    <v-btn class="mx-2" tile dark small color="red" @click="deleteItem(user.id)">
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
            users: [],
            genders: [
                'Man',
                'Vrouw',
                'Anders'
            ],
            types: [
                'Gebruiker',
                'Organisator',
                'Administrator'
            ],
        }
    },
    mounted() {
        this.getUsers();
    },
    methods: {
        getUsers() {
            axios
                .get("/users")
                .then((response) => {
                    this.users = response.data;
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                });
        },
        editItem(id) {
            this.$router.push({
                name: 'userEdit',
                params: {
                    id: id
                }
            })
        },
        deleteItem(id) {
            axios
                .delete("/users/" + id)
                .then((response) => {
                    // when success
                    if (response.status == 200) {
                        this.$buefy.toast.open({
                            message: "Succesvol verwijderd",
                            type: 'is-success'
                        })
                        this.getUsers();
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
        newUser() {
            this.$router.push({
                name: 'userCreate'
            })
        }
    }
}
</script>

<style>
.table-small {
    width: 50px;
}
</style>
