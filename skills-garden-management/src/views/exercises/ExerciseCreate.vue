<template>
<div>
    <h2>Oefening aanmaken</h2>

    <section>
        <v-form @submit.prevent="saveOefening">
            <b-field label="Naam" message="De naam van de oefening">
                <b-input type="text" name="name" v-model="oefening.name"></b-input>
            </b-field>

            <b-field label="Media" message="Een url naar een instructie video">
                <b-input type="url" name="media" v-model="oefening.media" minlength="2" maxlength="200"></b-input>
            </b-field>

            <b-field class="list-add" label="Benodigdheden" message="">
                <b-input placeholder="Typ een nieuwe benodigdheid..." v-model="newRequirement" type="text" icon-right="plus" icon-right-clickable @icon-right-click="addRequirement"></b-input>
            </b-field>
            <b-field v-if="oefening.requirements.length == 0">
                <i>Nog geen benodigdheden</i>
            </b-field>
            <b-field>
                <ul>
                    <li v-for="(requirement, index) in oefening.requirements" :key="index">
                        {{ requirement }}
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteRequirement(requirement)"></el-button>
                    </li>
                </ul>
            </b-field>

            <b-field class="list-add" label="Stappen" message="">
                <b-input placeholder="Typ een nieuwe stap..." v-model="newStep" type="text" icon-right="plus" icon-right-clickable @icon-right-click="addStep"></b-input>
            </b-field>
            <b-field v-if="oefening.steps.length == 0">
                <i>Nog geen stappen</i>
            </b-field>
            <b-field>
                <ol>
                    <li v-for="(step, index) in oefening.steps" :key="index">
                        {{ step }}
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteStep(step)"></el-button>
                    </li>
                </ol>
            </b-field>

            <b-field class="forms-select" label="Beweegvormen" message="De beweegvorm(en) welke van toepassing is/zijn">
                <el-select v-model="oefening.forms" multiple placeholder="Selecteer beweegvorm(en)">
                    <el-option v-for="(form, index) in movementforms" :key="index" :label="form" :value="index"></el-option>
                </el-select>
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
            newRequirement: '',
            newStep: '',
            oefening: {
                name: "",
                media: "",
                requirements: [],
                steps: [],
                forms: []
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
    methods: {
        saveOefening() {
            this.loading = true;

            axios
                .post(
                    "/exercises", {
                        name: this.oefening.name,
                        media: this.oefening.media,
                        requirements: this.oefening.requirements,
                        steps: this.oefening.steps,
                        forms: this.oefening.forms,
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
        addRequirement() {
            this.oefening.requirements.push(this.newRequirement);
            this.newRequirement = '';
        },
        deleteRequirement(requirement) {
            var step = this.oefening.requirements.indexOf(requirement);
            this.oefening.requirements.splice(step, 1);
        },
        addStep() {
            this.oefening.steps.push(this.newStep);
            this.newStep = '';
        },
        deleteStep(step) {
            var index = this.oefening.steps.indexOf(step);
            this.oefening.steps.splice(index, 1);
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
</style>
