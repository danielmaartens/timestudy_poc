<template>
    <div class="summary-container">
        <modal v-if="showModal">
            <p class="summary-submit-text" v-if="!selectedSession" slot="body">Saving your session...</p>
            <p class="summary-submit-text" v-else slot="body">Saving {{session.OperatorName}}'s rating...</p>
            <div slot="footer">
                <spinner color="green" name="three-bounce" fadeIn="quarter"/>
            </div>
        </modal>
        <h3 v-if="selectedSession" class="summary-header" slot="header">Session Summary for
            {{session.OperatorName}}</h3>
        <div class="summary">
            <h1 class="completed-heading" v-if="session.SessionStatus === 'COMPLETED'">Session Completed</h1>
            <h1 class="aborted-heading" v-if="session.SessionStatus === 'ABORTED'">Session Aborted</h1>
            <table class="summary-table">
                <tr class="summary-row">
                    <td class="align-right">Operator Name:</td>
                    <td class="align-left">{{session.OperatorName}}</td>
                </tr>
                <tr class="summary-row">
                    <td class="align-right">Total Items Required:</td>
                    <td class="align-left">{{session.TotalItems}}</td>
                </tr>
                <tr class="summary-row">
                    <td class="align-right">Items Completed:</td>
                    <td class="align-left">{{session.ItemsCompleted}}</td>
                </tr>
                <tr class="summary-row">
                    <td class="align-right">Average Time Per Item:</td>
                    <td class="align-left">{{typeof session.AverageItemTime === 'string' ? session.AverageItemTime :
                        formatTime(session.AverageItemTime)}}
                    </td>
                </tr>
                <tr class="summary-row">
                    <td class="align-right">Best Time:</td>
                    <td class="align-left">{{typeof session.BestTime === 'string' ? session.BestTime :
                        formatTime(session.BestTime)}}
                    </td>
                </tr>
                <tr class="summary-row">
                    <td class="align-right">Worst Time:</td>
                    <td class="align-left">{{typeof session.WorstTime === 'string' ? session.WorstTime :
                        formatTime(session.WorstTime)}}
                    </td>

                </tr>
                <tr class="summary-row">
                    <td class="align-right">Total Paused Time:</td>
                    <td class="align-left">{{typeof session.PauseTaken === 'string' ? session.PauseTaken :
                        formatTime(session.PauseTaken)}}
                    </td>
                </tr>
            </table>
            <div class="rate-component">
                <div>Rate <b>{{session.FirstName}}</b>'s Performance</div>
                <div class="summary-rating">
                    <div v-on:mouseleave="mouseLeave">
                        <star-rating @rating-selected="setRating" :show-rating="false"
                                     :glow="10" @current-rating="showCurrentRating" :increment="0.5"
                                     :rounded-corners="true"
                                     :star-points="[23,2, 14,17, 0,19, 10,34, 7,50, 23,43, 38,50, 36,34, 46,19, 31,17]"></star-rating>
                    </div>
                </div>
                <div><b>Rating: {{currentRating}}</b></div>
            </div>
            <button v-if="!selectedSession" class="rate-button" @click.prevent="finish()">SUBMIT SESSION</button>
            <button v-else class="rate-button" @click.prevent="finish()">SUBMIT RATING</button>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex'
    import Spinner from 'vue-spinkit';
    import Modal from '../../custom-components/Modal'
    import StarRating from 'vue-star-rating'
    import {SUMMARY_MODAL} from '../../store/modules/admin';

    console.log('SUMMARY VIEW');
    export default {
        name: "Summary",
        components: {
            Modal,
            Spinner,
            StarRating
        },
        props: {
            selectedSession: {
                type: Object,
                required: false
            },
        },
        data() {
            return {

                showModal: false,
                session: {},
                rating: 0,
                currentRating: "No Rating",
                currentSelectedRating: "No Current Rating",
                hasSelectedRating: false,
                toggleDashboardSummaryModal: false,

            };
        },
        mounted() {
            this.session = this.selectedSession || this.$store.state.session.currentSession;

            if (this.selectedSession) {
                this.toggleDashboardSummaryModal = true;
            }
        },
        computed: {},
        methods: {
            ...mapActions('session', [
                'updateSession',
            ]),

            ...mapActions('admin', [
                'toggleSummaryModal',
            ]),
            async finish() {
                this.showModal = true;

                await this.updateSession({
                    SupervisorRating: (this.rating / 5),
                    ID: this.session.ID,
                });

                setTimeout(async () => {

                    this.showModal = false;

                    if (this.toggleDashboardSummaryModal) {
                        this.toggleSummaryModal();
                    }

                    if (!this.selectedSession) {
                        this.$router.push('/session/start');
                    }

                }, 1000)

            },
            async setRating(rating) {
                this.hasSelectedRating = true;
                this.rating = rating;

            },
            showCurrentRating(rating) {

                this.currentRating = (rating / 5) * 100 + "%"
            },
            mouseLeave() {

                if (this.hasSelectedRating) {
                    this.currentRating = (this.rating / 5) * 100 + "%"
                } else {
                    this.currentRating = '0%';
                }
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
            async modalClicked() {

                this.showModal = true;
                if (this.currentInterval) clearInterval(this.currentInterval);
                if (this.currentPauseInterval) clearInterval(this.currentPauseInterval);
            },
        }
    }
</script>

<style scoped>

    .summary-header {
        color: black;
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

    .summary-table {
        margin: auto;
        padding: 20px 0 20px;
        width: 100%;
    }

    .summary-container {
        padding: 4em 20px 20px 20px;
    }

    .summary {
        width: 80%;
        background-color: white;
        border: 1px solid darkgrey;
        border-radius: 10px;
        margin: auto;
        color: #0d324d;
        padding: 20px 0 20px 0;
    }

    .summary-rating {
        padding: 0 0 10px;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .summary-row {
        padding: 20px 20px;
    }

    td {
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .rate-button {
        background: linear-gradient(0deg, #0b1d49, #4D5A7A);
        color: white;
        padding: 10px 70px 10px 70px;
        margin: 10px 10px;
        border-radius: 10px;
        font-size: 18px;
        cursor: pointer;
    }

    .completed-heading {
        color: green;
    }

    .aborted-heading {
        color: red;
    }

    .rate-component {
        padding: 20px 0 20px;
    }

    .summary-submit-text {
        color: black;
    }

</style>