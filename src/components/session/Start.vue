<template>
    <div>
        <form>
            <div>
                <button class="home-links create-session-home-link-button" @click.prevent="goHome">Home</button>
            </div>
            <div class="session-form create-session-container">
                <h1>Create A Session</h1>
                <div class="error" v-if="missingInputs.length">
                    <li v-for="missing in missingInputs">
                        {{ `${missing.displayName} is required` }}
                    </li>
                </div>
                <table class="session-input-table">
                    <tr>
                        <td class="align-right">Operator Name:</td>
                        <td class="align-left">
                            <select
                                    class="select-css"
                                    v-model="selectedOperator"
                                    ref="OperatorID"
                                    required
                            >
                                <option v-for="operator in operators" v-bind:value="operator.ID">
                                    {{ operator.value || `${operator.FirstName} ${operator.LastName}` }}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="align-right">Supervisor:</td>
                        <td class="align-left">
                            <select class="select-css" ref="SupervisorID" required>
                                <option v-for="supervisor in clientSupervisors" v-bind:value="supervisor.ID"
                                        :selected="currentSupervisor.ID === supervisor.ID">
                                    {{ `${supervisor.FirstName} ${supervisor.LastName}` }}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="align-right">Location:</td>
                        <td class="align-left"><select class="select-css" ref="LocationID" required>
                            <option :selected="!currentClientLocation" value="placeholder" disabled>Select a
                                location...
                            </option>
                            <option v-for="location in clientLocations" v-bind:value="location.ID"
                                    :selected="currentClientLocation && currentClientLocation.ID === location.ID">
                                {{ location.Name }}
                            </option>
                        </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="align-right">Task:</td>
                        <td class="align-left">
                            <select
                                    class="select-css"
                                    v-model="selectedTask"
                                    ref="TaskID"
                                    required
                            >
                                <option v-for="task in tasks" v-bind:value="task.ID">
                                    {{ task.value || task.Description }}
                                </option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="align-right">Task Target Time:</td>
                        <td class="align-left">
                            <input class="session-input"
                                   type="number"
                                   min="1"
                                   ref="TaskTargetTime"
                                   value="1"
                                   required
                            >
                            <span>  minutes per task</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="align-right">Total Items Per Session:</td>
                        <td class="align-left">
                            <input
                                    class="session-input"
                                    type="number"
                                    min="1"
                                    ref="TotalItems"
                                    value="1"
                                    required
                            >
                            <span>  items</span>
                        </td>
                    </tr>
                </table>
                <button class="start-button" @click.prevent="getFormValues()">Let's Start !</button>
            </div>
        </form>


    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';

    const required = [
        {
            input: 'OperatorID',
            displayName: 'Operator Name',
            valuesNotAllowed: ['placeholder'],
        },
        {
            input: 'TaskID',
            displayName: 'Task',
            valuesNotAllowed: ['placeholder'],
        },
        {
            input: 'LocationID',
            displayName: 'Location',
            valuesNotAllowed: ['placeholder'],
        },
        {
            input: 'TaskTargetTime',
            displayName: 'Task Target Time',
            valuesNotAllowed: [0, ''],
        },
        {
            input: 'TotalItems',
            displayName: 'Total Items Per Session',
            valuesNotAllowed: [0, ''],
        },
    ];

    export default {
        name: 'StartSession',
        data() {
            return {
                selectedOperator: 'placeholder',
                selectedTask: 'placeholder',
                formValues: {},
                missingInputs: [],

            };
        },
        async mounted() {
            await this.getOperators();
            await this.getTasks();
        },
        computed: {
            ...mapState('admin', [
                    'clientSupervisors',
                    'clientLocations',
                    'currentClientLocation',
                    'currentSupervisor',
                ],
            ),
            operators() {
                return [
                    {ID: 'placeholder', value: 'Select an operator...'},
                    ...this.$store.state.admin.operators,
                ];
            },
            tasks() {
                return [
                    {ID: 'placeholder', value: 'Select a task...'},
                    ...this.$store.state.admin.tasks,
                ];
            },
        },
        methods: {
            ...mapActions('admin', [
                'getOperators',
                'getTasks',
                'startTask',
            ]),
            ...mapActions('session', [
                'startSession',
            ]),
            async getFormValues() {

                const inputKeys = Object.keys(this.$refs);

                const inputValues = inputKeys.reduce((obj, key) => {
                    obj[key] = this.$refs[key].value;
                    return obj;
                }, {});

                let cannotSubmit = this.cannotSubmitCheck(inputKeys, inputValues);

                this.formValues = inputValues;

                this.missingInputs = cannotSubmit;

                if (!cannotSubmit.length) {
                    await this.startSession({
                        ...inputValues,
                        TaskTargetTime: inputValues.TaskTargetTime * 60,
                    });
                    this.$router.push('/session/progress');
                }
            },
            cannotSubmitCheck(inputs, values) {
                return required.reduce((i, r) => {

                    if (!inputs.includes(r.input) || (inputs.includes(r.input) && r.valuesNotAllowed.includes(values[r.input]))) {
                        i.push(r);
                    }

                    return i;
                }, []);
            },
            goHome() {
                this.$router.push('/');
            },
        },
    }
</script>

<style scoped>
    .error {
        width: 30%;
        margin: auto;
        padding: 10px;
        background-color: lightcoral;
        border: 1px solid red;
        border-radius: 5px;
    }

    .session-form {
        padding: 20px;
    }

    .session-input-table {
        margin: auto;
        padding: 1em 1em 3em 1em;
    }

    .create-session-home-link-button {
        background: rgba(255, 255, 255, .2);
        border: none;
        color: white;
        font-weight: bold;
        border-radius: 10px;
        padding: 10px;
        margin: 20px 0 10px 0;
        width: 60%;
        cursor: pointer;
        font-size: 18px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .home-links {
        display: inline-block;
        padding: 10px 10px;
    }

    .align-left {
        text-align: left;
        padding-left: 5px;
        width: 50%;
    }

    .align-right {
        text-align: right;
        padding-right: 5px;
        width: 50%;
        font-weight: bold;
    }

    .select-css {
        display: block;
        font-size: 16px;
        font-family: sans-serif;
        color: #444;
        line-height: 1.3;
        padding: .6em 1.4em .5em .8em;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        margin: 0;
        border: 1px solid #aaa;
        box-shadow: 0 1px 0 1px rgba(0, 0, 0, .04);
        border-radius: .5em;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        background-color: #fff;
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: .65em auto, 100%;
    }

    .select-css::-ms-expand {
        display: none;
    }

    .select-css:hover {
        border-color: #888;
    }

    .select-css:focus {
        border-color: #aaa;
        box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
        box-shadow: 0 0 0 3px -moz-mac-focusring;
        color: #222;
        outline: none;
    }

    .select-css option {
        font-weight: normal;
    }

    .session-input {
        width: 20%;
        height: 40px;
        border-radius: 10px;
        font-size: 20pt;
        font-weight: bold;
        text-align: center;
        border: 1px solid #cccccc;
    }

    .start-button {
        padding: 1em 3em 1em 3em;
        font-size: 1.5em;
        background: linear-gradient(0deg, #50865F, #77C98E);
        color: white;
        border-radius: 5em;
        cursor: pointer !important;
    }

    .create-session-container {
        width: 60%;
        background-color: white;
        border: 1px solid darkgrey;
        border-radius: 10px;
        margin: auto;
        color: #0d324d;
        padding-bottom: 40px;
    }
</style>