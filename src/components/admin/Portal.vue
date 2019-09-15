<template>
    <div>
        <div>
            <div>
                <button class="portal-home-link-button" @click.prevent="goHome">Home</button>
            </div>
            <div>
                <h2>Welcome To The Admin Portal</h2>
                <p>In the Admin Portal you can view existing organisations, their locations and users</p>
                <p><i>*Future release - Create your own organisations, setup locations, and add staff !</i></p>
            </div>
            <div v-if="!clientToEdit">
                <router-view/>
                <div class="portal-table-container">
                    <h3 class="portal-table-headings">Organisations</h3>
                    <data-table :items="$store.state.admin.clients">
                        <data-column field="Name" label="Organisation" width="15%"/>
                        <data-column field="Email" label="Email"/>
                        <data-column field="Telephone" label="Contact Number"/>
                        <data-column field="Address" label="Address"/>
                        <data-column field="CreatedAt" label="Created" :render="formatDate"/>
                        <data-column label="" :sortable="false">
                            <template slot-scope="props">
                                <div class="edit-client-button" @click.prevent="edit(props.item)">DETAILS</div>
                            </template>
                        </data-column>
                    </data-table>
                </div>
            </div>
        </div>
        <div v-if="clientToEdit !== null">
            <button class="return-to-portal-button" @click.prevent="goBack">Return To Portal</button>
            <ClientProfile :client="clientToEdit"/>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex'
    import '../../css/vueteible.css'
    import {DataTable, DataColumn} from 'vue-teible'
    import SessionSummary from '../session/Summary.vue';
    import ClientProfile from '../admin/ClientProfile';
    import Modal from '../../custom-components/Modal';
    import moment from 'moment';

    console.log('PORTAL VIEW');

    export default {
        name: "Portal",
        components: {
            DataTable,
            DataColumn,
            SessionSummary,
            Modal,
            ClientProfile,
        },
        data() {
            return {
                clientToEdit: null,
                editClient: false,
            }
        },
        methods: {
            ...mapActions('admin', [
                'getClients',
                'setClient',
            ]),
            edit(clientDetails) {

                this.editClient = true;
                const client = clientDetails;

                client.users = client.users.map(u => {
                    return {
                        ...u,
                        Role: u.role.Role,
                        LocationName: u.location.Name,
                    }
                });

                this.clientToEdit = client;
                this.$router.push('/admin/portal')
            },
            formatDate(value, item) {

                return moment(value).format('Do MMMM YYYY');

            },
            goBack() {
                this.clientToEdit = null;
            },
            goHome() {
                this.$router.push('/');
            },
        }
    }
</script>

<style lang="scss">

    a, u {
        text-decoration: none;
        color: inherit;
    }

    .portal-table-headings {
        text-align: left;
        color: black;
    }

    .portal-home-link-button {
        background: rgba(255, 255, 255, .2);
        border: none;
        color: white;
        font-weight: bold;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        padding: 10px;
        width: 100%;
        cursor: pointer;
        font-size: 18px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .portal-table-container {
        border: 1px solid black;
        border-radius: 20px;
        margin: auto;
        width: 80%;
        padding: 0 20px 20px 20px;
        background-color: #F3F0F0;
    }

    .return-to-portal-button {
        background: rgba(255, 255, 255, .2);
        border: none;
        color: white;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        padding: 10px;
        width: 80%;
        margin: auto;
        cursor: pointer;
        font-weight: bold;
        font-size: 15px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
    }

    .home-links {
        display: inline-block;
        padding: 30px 30px;
    }

    .portal-home-links-container {
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .star-summary-rating-element {
        padding-top: 10px;
    }

    .edit-client-button {
        /*background-color: #80a1c1;*/
        background: linear-gradient(0deg, #0b1d49, #4D5A7A);
        color: white;
        font-weight: bold;
        border-radius: 10px;
        text-align: center;
        padding: 5px;
        cursor: pointer;
    }

</style>