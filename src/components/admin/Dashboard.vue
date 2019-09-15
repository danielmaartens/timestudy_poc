<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div>
        <modal :close="close" v-if="showSummaryModal">
            <div slot="body">
                <session-summary :selected-session="selectedSession"/>
            </div>
        </modal>
        <button class="home-links dashboard-home-link-button" @click.prevent="goHome">Home</button>
        <h2 class="dashboard-header">Supervisor Dashboard</h2>
        <div>
            <div>
                <data-table :items="$store.state.session.currentSessions">
                    <data-column field="CreatedAt" label="Session Date" :render="formatDate" width="10px"/>
                    <data-column field="OperatorName" label="Operator Name" width="10px"/>
                    <data-column field="SupervisorName" label="Supervisor" width="10px"/>
                    <data-column field="LocationName" label="Location" width="10px"/>
                    <data-column field="TaskDescription" label="Operator Task" width="10px"/>
                    <data-column field="TaskTargetTime" label="Task Target Time" width="10px">
                        <template slot-scope="props">
                            <div class="column-content-center">{{formatTime(props.value)}}</div>
                        </template>
                    </data-column>
                    <data-column field="TotalItems" label="Items To Be Completed" width="10px"/>
                    <data-column field="ItemsCompleted" label="Items Completed" width="10px"/>
                    <data-column field="CurrentTime" label="Current Task Timer" width="10px">
                        <template slot-scope="props">
                            <div v-if="props.item.SessionStatus === 'COMPLETED' || props.item.SessionStatus === 'ABORTED'">
                                Not Running
                            </div>
                            <div v-if="props.item.SessionStatus !== 'PAUSED' && Number(props.value) > Number(props.item.TaskTargetTime)"
                                 class="task-over-time current-time">{{formatTime(props.value)}}
                            </div>
                            <div v-if="props.item.SessionStatus !== 'PAUSED' && Number(props.value) > 0 && Number(props.value) < Number(props.item.TaskTargetTime)"
                                 class="task-in-progress current-time">{{formatTime(props.value)}}
                            </div>
                            <div v-if="props.item.SessionStatus === 'PAUSED'" class="task-paused current-time">
                                {{formatTime(props.value)}}
                            </div>
                        </template>
                    </data-column>
                    <data-column field="BestTime" label="Best Time" :render="formatTime" width="10px">
                        <template slot-scope="props">
                            <div class="column-content-center">{{props.value}}</div>
                        </template>
                    </data-column>
                    <data-column field="WorstTime" label="Worst Time" :render="formatTime" width="10px">
                        <template slot-scope="props">
                            <div class="column-content-center">{{props.value}}</div>
                        </template>
                    </data-column>
                    <data-column field="AverageItemTime" label="Average Item Time" :render="formatTime" width="10px">
                        <template slot-scope="props">
                            <div class="column-content-center">{{props.value}}</div>
                        </template>
                    </data-column>
                    <data-column field="PauseTaken" label="Pause Taken" :render="formatTime" width="10px">
                        <template slot-scope="props">
                            <div v-if="props.item.SessionStatus === 'PAUSED'"
                                 class="task-in-progress current-time">{{props.value}}
                            </div>
                            <div v-else class="column-content-center">{{props.value}}</div>
                        </template>
                    </data-column>
                    <data-column field="SessionStatus" label="Status" width="20px">
                        <template slot-scope="props">
                            <div v-if="props.value === 'COMPLETED'" class="status-completed status">{{props.value}}
                            </div>
                            <div v-if="props.value === 'ABORTED'" class="status-aborted status">{{props.value}}</div>
                            <div v-if="props.value === 'PAUSED'" class="status-paused status">{{props.value}}</div>
                            <div v-if="props.value === 'IN PROGRESS'" class="status-in-progress status">
                                {{props.value}}
                            </div>
                        </template>
                    </data-column>
                    <data-column field="SupervisorRating" label="Supervisor Rating" :sortable="false" width="10px">
                        <template slot-scope="props">
                            <button class="supervisor-rating" @click.prevent="addRating(props.item)">{{`${props.value
                                ===
                                null ? '0' : props.value*100}%`}}
                            </button>
                        </template>
                    </data-column>
                </data-table>

            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex';
    import '../../css/vueteible.css';
    import {DataTable, DataColumn} from 'vue-teible';
    import SessionSummary from '../session/Summary.vue';
    import Modal from '../../custom-components/Modal';
    import moment from 'moment';

    console.log('DASHBOARD VIEW');
    export default {
        name: "Dashboard",
        components: {
            DataTable,
            DataColumn,
            SessionSummary,
            Modal,
        },
        data() {
            return {
                selectedSession: {},
                getSessionsInterval: null,
            }
        },
        async mounted() {
            await this.getSessions();

            this.getSessionsInterval = setInterval(async () => {
                await this.getSessions();
            }, 1000);
        },
        computed: {
            ...mapState('admin', [
                    'showSummaryModal'
                ]
            ),
        },
        methods: {
            ...mapActions('session', [
                'getSessions',
            ]),
            ...mapActions('admin', [
                'toggleSummaryModal',
            ]),
            destroy(x) {
                this.items = this.items.filter(item => item.id !== x.id)
            },
            addRating(sessionDetails) {
                this.selectedSession = sessionDetails;
                this.toggleSummaryModal();

            },
            formatTime(value, item) {

                value = Number(value);

                if (!value) {
                    return '00:00';
                }

                const minutes = Math.floor(value / 60);
                const seconds = value % 60;

                return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
            },
            formatDate(value, item) {

                return moment(value).format('ddd, D MMM YY');

            },
            close() {
                this.toggleSummaryModal();
            },
            goHome() {
                clearInterval(this.getSessionsInterval);
                this.$router.push('/');
            },
        },
    }
</script>

<style scoped>

    .dashboard-home-link-button {
        background: rgba(255, 255, 255, .2);
        border: none;
        color: white;
        font-weight: bold;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        padding: 10px;
        margin-bottom: 20px;
        width: 100%;
        cursor: pointer;
        font-size: 18px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .dashboard-header {
        padding-bottom: 20px;
    }

    .app-links {
        display: inline-block;
        padding: 10px 10px;
    }

    .current-time {
        font-weight: bold;
        font-size: large;
        color: white;
        text-align: center;
        height: 100%;
        padding: 10px 0 10px 0;
        width: 100%;
    }

    .status {
        font-weight: bold;
        font-size: small;
        color: white;
        text-align: center;
        height: 100%;
        word-break: keep-all;
        padding: 10px 0 10px 0;
        width: 100%;
    }
    .status-in-progress {
        background: linear-gradient(0deg, #50865F, #77C98E);
    }

    .status-aborted {
    background: linear-gradient(0deg, #BA3131, #FF5353);
    }



    .status-completed {
        background: linear-gradient(0deg, #0b1d49, #4D5A7A);

    }

    .status-paused {
        background: linear-gradient(0deg, #D16D44, #FF9061);
    }

    .supervisor-rating {
        background: linear-gradient(0deg, #5299D3, #B1DDF1);
        font-weight: bold;
        border-radius: 30px;
        text-align: center;
        padding: 10px;
        cursor: pointer;
        font-size: 20px;
        width: 100%;
        color: white;

    }

    .task-over-time {
        background: linear-gradient(0deg, #BA3131, #FF5353);
    }

    .task-in-progress {
        background: linear-gradient(0deg, #50865F, #77C98E);
    }

    .task-paused {
        background: linear-gradient(0deg, #D16D44, #FF9061);
    }

    .column-content-center {
        text-align: center;
    }

    th {
        word-wrap: break-word;
    }

    @-webkit-keyframes AnimationName {
        0% {
            background-position: 50% 0%
        }
        50% {
            background-position: 51% 100%
        }
        100% {
            background-position: 50% 0%
        }
    }

    @-moz-keyframes AnimationName {
        0% {
            background-position: 50% 0%
        }
        50% {
            background-position: 51% 100%
        }
        100% {
            background-position: 50% 0%
        }
    }

    @keyframes AnimationName {
        0% {
            background-position: 50% 0%
        }
        50% {
            background-position: 51% 100%
        }
        100% {
            background-position: 50% 0%
        }
    }
</style>