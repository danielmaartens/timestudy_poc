<template>
    <div>
        <modal v-if='showModal' @close="showModal = false">
            <h3 class="session-end-header" slot='header'>Are you sure you would like to end your session ?</h3>
            <div slot='footer'>
                <button class="progress-option-button end-button" @click.prevent="end()">
                    Yes, I want to End my session
                </button>
                <br/>
                <button class="progress-option-button restart-button" @click.prevent="restart()">
                    No, I want to continue my session.
                </button>

                <button class="progress-option-button pause-button" @click.prevent="pause()">
                    No, I want to Pause my session.
                </button>
            </div>
        </modal>
        <div v-if='currentSession' class="session-header">
        <h1 class="session-operator">{{currentSession.OperatorName}}</h1>
            <p class="session-info"><b>Supervisor:</b> {{currentSession.SupervisorName}} <b>Location:</b> {{currentSession.LocationName}}</p>
            <p class="session-info"><b>Task:</b> {{currentSession.TaskDescription}}</p>
        </div>
        <div class="progress-container">
        <div class="linear-progress-bar">
            <progress-bar
                    :bar-color='linearBarColor'
                    :val="(itemCount/totalItemsToBeCompleted)*100"
                          :size='linearBarSize'
                    :bg-color='linearBarBackground'
            />
        </div>

        <div class="circle-progress-bar">
            <radial-progress-bar
                    :animate-speed='animateSpeed'
                    :diameter='200'
                    :completed-steps="currentTimer/60"
                    :total-steps="targetTime/60"
                    :innerStrokeColor='innerStrokeColor'
                    :startColor='startColor'
                    :stopColor='stopColor'
                    :blinking-colors='blinkingColors'
                    :blinking-rate='blinkingRate'


            >
                <p>{{`${currentTimeRemaining >= 0 ? Math.floor(currentTimeRemaining/60) : Math.floor(currentTimer/60)}m
                    ${currentTimeRemaining >= 0 ? currentTimeRemaining % 60 : currentTimer % 60}s `}}</p>
                <p><b>{{`${currentTimeRemaining >= 0 ? 'remaining' : 'over target'}`}}</b></p>
            </radial-progress-bar>
        </div>
            <div class="session-progress-buttons">
        <button class="progress-option-button pause-button" v-if='inProgress' @click.prevent="pause()">Pause Session</button>
        <button class="progress-option-button restart-button" v-if='hasPaused' @click.prevent="restart()">Restart Session</button>
        <button class="progress-option-button end-button" @click.prevent="modalClicked()">End Session</button>
        <button class="progress-option-button next-button" v-if="!canFinishSession" @click.prevent="next()">Next Item ({{totalItemsToBeCompleted-(itemCount+1)}} Laps Remaining)</button>
        <button class="progress-option-button finish-button" v-if='canFinishSession' @click.prevent="finish()">FINISH</button>
                </div>

        <modal v-if='showFinishModal'>
            <p class="session-progress-modal-header" slot='body'>Summarising your session...</p>
            <div slot='footer'>
                <spinner color='green' name="three-bounce" fadeIn='quarter'/>
            </div>
        </modal>


    </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex'
    import Spinner from 'vue-spinkit';
    import {UPDATE_CURRENT_SESSION} from '../../store/modules/session'
    import RadialProgressBar from '../../custom-components/RadialProgressBar.vue'
    import Modal from '../../custom-components/Modal'
    import ProgressBar from "vue-simple-progress/src/components/Progress.vue";

    
    export default {
        name: 'StartSession',
        components: {
            RadialProgressBar,
            ProgressBar,
            Modal,
            Spinner,
        },
        data() {
            return {
                options: {
                    color: '#3a3a3a',
                    strokeWidth: 5,
                    trailColor: '#f4f4f4',
                    trailWidth: 0.8,
                    duration: 1200,
                    easing: 'easeOut',
                    from: {color: '#eee'},
                    to: {color: '#000'},
                    step(state, circle, attachment) {
                        circle.path.setAttribute('stroke', 'blue');
                    },

                },
                innerStrokeColor: '#eae6e5',
                startColor: '#009933',
                stopColor: '#009933',
                targetTime: 0,
                totalItemsToBeCompleted: 0,
                currentTimeRemaining: 0,
                currentTimer: 0,
                currentInterval: null,
                itemCount: 0,
                laps: [],
                pauseTime: 0,
                currentPauseInterval: null,
                fill: {gradient: ['red', 'green', 'blue']},
                linearBarSize: 'large',
                linearBarColor: '#74a57f',
                blinkingRate: '0s',
                blinkingColors: '',
                inProgress: true,
                hasPaused: false,
                showModal: false,
                animateSpeed: 1000,
                canFinishSession: false,
                showSpinner: false,
                showFinishModal: false,
                linearBarBackground: '#eae6e5',

            };
        },
        async mounted() {
            this.targetTime = await this.taskTargetTime();
            this.totalItemsToBeCompleted = this.totalItems();
            await this.resetAndStart();

        },

        computed: {
            ...mapState('session', [
                    'currentSession'
                ],
            ),
        },
        methods: {
            ...mapActions('session', [
                'updateSession',
            ]),
            ...mapGetters('session', [
                'taskTargetTime',
                'totalItems',
            ]),
            worstTime() {

                const sortedAscending = this.laps.sort((a,b) => {
                    return a.time > b.time;
                });
                
                if (sortedAscending.length) {
                    return sortedAscending[0].time;
                }

                return null;
            },

            bestTime() {
                const sortedDescending = this.laps.sort((a,b) => {
                    return a.time > b.time;
                }).reverse();

                if (sortedDescending.length) {
                    return sortedDescending[0].time;
                }

                return null;
            },
            averageTime() {

                if (this.laps.length) {
                    const totalTime = this.laps.reduce((sum, l) => {
                        return sum += l.time;
                    }, 0);

                    return Math.floor(totalTime / this.laps.length);
                }

                return null;
            },
            async resetAndStart() {
                this.animateSpeed = 0;
                this.blinkingRate = '0s';
                this.blinkingColors = '';
                this.currentTimer = 0;
                this.currentTimeRemaining = this.targetTime;
                this.startColor = '#009933';
                this.stopColor = '#009933';

                this.canFinishSession = this.totalItemsToBeCompleted - 1 === this.itemCount;

                this.currentInterval = setInterval(async () => {
                    this.animateSpeed = 1000;
                    this.currentTimer += 1;
                    this.currentTimeRemaining -= 1;
                    const progress = this.currentTimeRemaining / this.targetTime;

                    if (progress < 0.5 && progress > 0.20) {
                        this.startColor = '#F9B94A';
                        this.stopColor = '#F9B94A';
                    }
                    if (progress <= 0.2 && progress > 0) {
                        this.startColor = '#e30e0e';
                        this.stopColor = '#e30e0e';
                    }

                    if (progress < 0) {
                        this.blinkingRate = '1s';
                        this.blinkingColors = '#e30e0e; #FFFFFF';
                    }
                    
                    await this.updateSession({
                        CurrentTime: this.currentTimer,
                        SessionStatus: 'IN PROGRESS',
                    })
                }, 1000);
            },
            async pause() {
                this.showModal = false;
                this.hasPaused = true;
                this.inProgress = false;
                clearInterval(this.currentInterval);

                await this.updateSession({
                    SessionStatus: 'PAUSED',
                });

                this.currentPauseInterval = setInterval(async () => {
                    this.pauseTime += 1;

                    await this.updateSession({
                        PauseTaken: this.pauseTime,
                    });

                }, 1000)
            },

            async restart() {
                this.showModal = false;
                this.hasPaused = false;
                this.inProgress = true;

                if (this.currentPauseInterval) {
                    clearInterval(this.currentPauseInterval);
                }

                await this.updateSession({
                    SessionStatus: 'IN PROGRESS',
                });

                this.currentInterval = setInterval(async () => {
                    this.currentTimer += 1;
                    this.currentTimeRemaining -= 1;
                    const progress = this.currentTimeRemaining / this.targetTime;

                    if (progress < 0.5 && progress > 0.20) {
                        this.startColor = '#F9B94A';
                        this.stopColor = '#F9B94A';
                    }
                    if (progress <= 0.2 && progress > 0) {
                        this.startColor = '#e30e0e';
                        this.stopColor = '#e30e0e';
                    }

                    if (progress < 0) {
                        this.blinkingRate = '1s';
                        this.blinkingColors = '#e30e0e; #FFFFFF';
                    }
                    
                    await this.updateSession({
                        CurrentTime: this.currentTimer,
                    })
                }, 1000)
            },
            async modalClicked() {

                this.showModal = true;
                if (this.currentInterval) clearInterval(this.currentInterval);
                if (this.currentPauseInterval) clearInterval(this.currentPauseInterval);
            },
            async end() {
                this.showModal = false;
                this.showFinishModal = true;

                if (this.currentInterval) clearInterval(this.currentInterval);
                if (this.currentPauseInterval) clearInterval(this.currentPauseInterval);

                await this.updateSession({
                    SessionStatus: 'ABORTED',
                    WorstTime: this.worstTime(),
                    BestTime: this.bestTime(),
                    AverageItemTime: this.averageTime(),
                    CurrentTime: 0,
                    ItemsCompleted: this.itemCount,
                });

                setTimeout(() => {
                    this.showFinishModal = false;
                    this.$router.push('/session/summary');
                }, 1000)
            },

            async next() {
                if (this.currentInterval) clearInterval(this.currentInterval);
                if (this.currentPauseInterval) clearInterval(this.currentPauseInterval);

                this.itemCount += 1;
                this.laps.push({
                    lap: this.itemCount,
                    time: this.currentTimer,
                });

                await this.updateSession({
                    ItemsCompleted: this.itemCount,
                    CurrentTime: 0,
                });

                await this.resetAndStart();
            },

            async finish() {
                this.showModal = false;
                this.itemCount += 1;

                this.laps.push({
                    lap: this.itemCount,
                    time: this.currentTimer,
                });

                if (this.currentInterval) clearInterval(this.currentInterval);
                if (this.currentPauseInterval) clearInterval(this.currentPauseInterval);

                this.showFinishModal = true;

                await this.updateSession({
                    SessionStatus: 'COMPLETED',
                    WorstTime: this.worstTime(),
                    BestTime: this.bestTime(),
                    AverageItemTime: this.averageTime(),
                    ItemsCompleted: this.itemCount,
                    CurrentTime: 0,
                });

                setTimeout(() => {
                    this.showFinishModal = false;
                    this.$router.push('/session/summary');

                }, 2000);
            }
        }
    }
</script>

<style scoped>

    .session-progress-modal-header {
        color: black;
    }

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

    .session-end-header {
        color: #ba3f1d;
    }

    .vue-simple-progress {
        background-color: grey !important;
    }

    .linear-progress-bar {
        margin: auto;
        width: 90%;
        padding-top: 20px;
    }

    .circle-progress-bar {
        margin: auto;
        padding: 20px 20px;
        color: black;
    }

    .radial-progress-inner p {
        display: block;
        margin-block-start: 0em;
        margin-block-end: 0em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }

    .radial-progress-container {
        margin: auto;
    }

    .do-not-display {
        display: none;
    }

    .progress-container {
        border: 1px solid black;
        border-radius: 20px;
        margin: auto;
        width: 40%;
        background-color: #DDDDDD;
    }

    .session-progress-buttons {
        padding-bottom: 20px;
    }

    .session-header {
        margin-bottom: 40px;
    }

    .session-info {
        margin-top: 0;
    }

    .session-operator {
        margin-bottom: 0;
    }

    .progress-option-button {
        padding: 10px;
        margin: 10px 10px;
        border-radius: 10px;
        font-size: 18px;
        cursor: pointer;

    }

    .end-button {
        /*background-color: #ef6461;*/
        background: linear-gradient(0deg, #BA3131, #FF5353);
        color:  #eff8e2;

    }

    .next-button {
        background: linear-gradient(0deg, #0b1d49, #4D5A7A);
        /*background-color: #00487c;*/
        color:  #eff8e2;

    }

    .finish-button {
        /*background-color: #74a57f;*/
        background: linear-gradient(0deg, #50865F, #77C98E);
        color:  #eff8e2;

    }

    .pause-button {
        /*background-color: #ffba49;*/
        background: linear-gradient(0deg, #D16D44, #FF9061);
        color:  #eff8e2;

    }

    .restart-button {
        background: linear-gradient(0deg, #50865F, #77C98E);
        color: #eff8e2;

    }



</style>