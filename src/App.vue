<template>
    <div class="main-container">
        <div id="app" class="app-container">
            <div v-if="$route.path === '/'">
                <div class="app-header">
                    <h2 class="app-title">Time Study App</h2>
                    <p>Welcome to the Time Study App where you can monitor staff performance in your production line
                        !</p>

                    <button class="admin-portal" @click.prevent="adminPortal">Admin Portal</button>

                </div>

                <div class="select-container">
                    <div class="app-select client-select">
                        <label class="input-label-element" for="client">Organisation*</label>
                        <select id="client" class="select-css input-label-element" v-on:change="valueChange"
                                name="client" required>
                            <option value="0" :selected="!currentClient" disabled>Select an organisation...</option>
                            <option v-for="client in clients" v-bind:value="client.ID"
                                    :selected="currentClient && currentClient.ID === client.ID">
                                {{ client.value || client.Name }}
                            </option>
                        </select>
                    </div>
                    <!--<div v-if="currentClient">-->
                    <div class="app-select">
                        <label class="input-label-element" for="location">Location</label>
                        <select id="location" class="select-css input-label-element" v-on:change="valueChange"
                                name="location">
                            <option v-if="!currentClient" value="null" :selected="!currentClientLocation" disabled>First
                                select an
                                organisation...
                            </option>
                            <option v-if="currentClient" value="0">All</option>
                            <option v-for="location in clientLocations" v-bind:value="location.ID"
                                    :selected="currentClientLocation && currentClientLocation.ID === location.ID">
                                {{ location.value || location.Name }}
                            </option>
                        </select>
                    </div>

                    <div class="app-select supervisor-select">
                        <label class="input-label-element" for="supervisor">Supervisor*</label>
                        <select id="supervisor" class="select-css input-label-element" v-on:change="valueChange"
                                name="supervisor" required>
                            <option v-if="!currentClient" value="null" selected disabled>First select an
                                organisation...
                            </option>
                            <!--<option v-if="!currentSupervisor" value="0" selected disabled>Select a supervisor...</option>-->
                            <option v-if="currentClient && clientSupervisors && clientSupervisors.length === 0 && !currentClientLocation"
                                    value="0" selected disabled>No supervisors for {{currentClient.Name}}
                            </option>
                            <option v-if="currentClient && clientSupervisors && clientSupervisors.length === 0 && currentClientLocation"
                                    value="0" selected disabled>No supervisors for {{currentClientLocation.Name}}
                            </option>
                            <option v-if="clientSupervisors && clientSupervisors.length > 0" value="0"
                                    :selected="!currentSupervisor"
                                    disabled>Select a supervisor...
                            </option>
                            <option v-for="supervisor in clientSupervisors" v-bind:value="supervisor.ID"
                                    :selected="currentSupervisor && currentSupervisor.ID === supervisor.ID">
                                {{ supervisor.value || `${supervisor.FirstName} ${supervisor.LastName}` }}
                            </option>
                        </select>
                    </div>
                    <!--</div>-->
                </div>

                <div v-if="currentSupervisor" class="nav-container">
                    <div class="nav-links-container">
                        <button class="nav-link supervisor-nav" @click.prevent="$router.push('/admin/dash')">Supervisor
                            Dashboard
                        </button>
                        <button class="nav-link session-nav" @click.prevent="$router.push('/session/start')">Create A
                            Session
                        </button>
                    </div>
                </div>
            </div>
            <router-view/>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex'
    import moment from 'moment';

    console.log('APP VIEW');
    export default {
        name: "App",
        data() {
            return {}
        },
        async mounted() {
            console.log('APP VIEW MOUNTED');
            await this.getClients();
        },
        created() {
            console.log('APP VIEW CREATED');
        },
        computed: {
            ...mapState('admin', [
                    'clients',
                    'clientSupervisors',
                    'clientLocations',
                    'currentClient',
                    'currentClientLocation',
                    'currentSupervisor',
                ]
            ),
        },
        methods: {
            ...mapActions('admin', [
                'getClients',
                'setClient',
                'setLocation',
                'setSupervisor',
            ]),
            async valueChange(e) {

                const name = e.target.name;
                const id = Number(e.target.value);

                if (name === 'client') {
                    const client = this.clients.find(c => c.ID === id);
                    await this.setClient(client);
                }

                if (name === 'location') {
                    if (id) {
                        const location = this.clientLocations.find(l => l.ID === id);
                        await this.setLocation(location);
                    }
                }

                if (name === 'supervisor') {
                    const supervisor = this.clientSupervisors.find(s => s.ID === id);
                    await this.setSupervisor(supervisor);
                }
            },
            adminPortal() {
                this.$router.push('/admin/portal');
            },
        },
    }
</script>


<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #eff8e2;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            /*color: #2c3e50;*/
            &.router-link-exact-active {
                /*color: #42b983;*/
            }
        }
    }

    button input {
        &:hover {
            opacity: 0.8;
        }

        &:active, &:focus {
            outline: none;
        }
    }

    input {
        &:hover {
            opacity: 0.8;
        }

        &:active, &:focus {
            outline: none;
        }
    }

    button {
        &:active, &:focus {
            outline: none;
        }
    }

    .app-header {
        margin-bottom: 4em;
    }

    .app-title {
        font-size: 40px;
        margin-bottom: 0;
    }

    .admin-portal {
        float: right;
        position: absolute;
        top: 2em;
        right: 2em;
        background-color: #1A2D3A;
        color: white;
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
        font-size: 18px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
    }


    .client-select {
        @media (min-width: 1001px) {
            float: left;
        }
    }

    .supervisor-select {

        @media (min-width: 1001px) {
            float: right;
        }
    }

    .app-select {

        @media (max-width: 1000px) {
            display: block;
            margin: 10px auto;
            width: 80%;
        }

        @media (min-width: 1001px) {
            display: inline-block;
            margin: 10px;
            width: 31%;
        }
    }

    .app-container {
        width: 99%;
        margin: auto;
        background-color: #00487c;
        padding-bottom: 3em;
        border: 1px solid black;
        border-radius: 20px;
        height: 80%;
        overflow: auto;
    }

    .main-container {
        margin-top: 1em;
    }

    a, u {
        text-decoration: none;
        color: inherit;
    }

    .input-label-element {
        display: block;
        text-align: left;
    }

    .home-link-button {
        background-color: black;
        color: white;
        border-radius: 10px;
        padding: 30px;
        margin: 20px;
    }

    .nav-links-container {
        width: 90%;
        display: flex;
        justify-content: center;
    }

    .nav-container {
        padding: 10px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-size: 20px;
        margin: 0 auto;

    }

    .nav-link {
        display: inline-block;
        padding: 30px 30px;
        background-color: #457B9D;
        color: white;
        border-radius: 10px;
        width: 50%;
        cursor: pointer;
        border: none;
        font-size: 1em;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
    }

    .supervisor-nav {
        margin-right: 1em;
    }

    .session-nav {
        margin-left: 1em;
    }

    .location-supervisor-selects {
        display: inline-block;
        margin: 10px;
    }


    .select-container {
        margin: auto;
        width: 90%;
        padding-bottom: 2em;
    }

    .select-css {
        display: block;
        font-size: 16px;
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

    .datatable__unit .datatable__text {
        color: #eff8e2;
    }
</style>
