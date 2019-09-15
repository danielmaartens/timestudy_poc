<template>
    <div class="client-profile-container">

        <h3 class="profile-title">{{client.Name}} Details</h3>
        <div class="details-table">
            <h3 class="profile-table-headings">Users</h3>
            <data-table :items="client.users">
                <data-column label="Name" width="15%">
                    <template slot-scope="props">
                        <div>{{`${props.item.FirstName} ${props.item.LastName}`}}</div>
                    </template>
                </data-column>
                <data-column field="Role" label="Role" width="15%"/>
                <data-column field="LocationName" label="Location" width="15%"/>
                <data-column field="Email" label="Email"/>
                <data-column field="CreatedAt" label="Date Added" :render="formatDate"/>
            </data-table>
        </div>
        <div class="details-table">
            <h3 class="profile-table-headings">Locations</h3>
            <data-table :items="client.locations">
                <data-column field="Name" label="Location" width="15%"/>
                <data-column field="CreatedAt" label="Date Added" :render="formatDate"/>
            </data-table>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex'
    import '../../css/vueteible.css'
    import {DataTable, DataColumn} from 'vue-teible'
    import moment from 'moment';

    console.log('CLIENT PROFILE VIEW');

    export default {
        name: "ClientProfile",
        components: {
            DataTable,
            DataColumn,
        },
        props: {
            client: {
                type: Object,
                required: true,
            }
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
            ]),
            edit(clientDetails) {
                this.editClient = true;
                this.clientToEdit = clientDetails
            },
            formatDate(value, item) {

                return moment(value).format('Do MMMM YYYY');

            },
        },
    }
</script>

<style lang="scss">
    .details-table {
        margin: auto;
        width: 90%;
        color: black;
    }

    .profile-table-headings {
        text-align: left;
        color: black;
    }

    .profile-title {
        color: black;
    }

    .client-profile-container {
        border: 1px solid black;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        margin: auto;
        width: 80%;
        background-color: #F3F0F0;
    }

    a, u {
        text-decoration: none;
        color: inherit;
    }

    .home-link-button {
        background-color: black;
        color: white;
        border-radius: 10px;
        padding: 30px;
        margin-left: 20px;
        margin-right: 20px;
    }

    .home-links-container {
        padding: 20px;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .star-summary-rating-element {
        padding-top: 10px;
    }

    .home-links {
        display: inline-block;
        padding: 30px 30px;
    }

    .edit-client-button {
        background-color: lightgrey;
        font-weight: bold;
        border-radius: 10px;
        text-align: center;
        padding: 5px;

    }

</style>