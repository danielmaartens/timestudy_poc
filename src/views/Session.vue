<template>
    <div>
        <div id="nav" class="session-create-button">
            <router-link to="/session/start">Create A Session</router-link>
        </div>
        <router-view/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class Session extends Vue {
        @Prop() private msg!: string;
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .session-create-button {
        background-color: #42b983;
        color: white;
        border-radius: 10px;
        padding: 30px;
        margin: auto;
        width: 60%;
    }
</style>
