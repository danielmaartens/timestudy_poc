<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <button v-if="close" class="close-button" @click.prevent="close">CLOSE</button>
                    <div class="modal-header">
                        <slot name="header">
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "Modal",
        props: {
            close: {
                type: Function,
                required: false,
            },
        },
    }
</script>

<style scoped>

    .close-button {
        float: right;
        /*position: absolute;*/
        top: 2em;
        right: 2em;
        background-color: black;
        color: white;
        border-radius: 10px;
        padding: 10px;
        cursor: pointer;
    }

    .modal-mask {
        position: relative;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        position: absolute;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        top: 300px;
        width: 60%;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
    }

    .modal-header {
        position: relative;
        margin-top: 0;
        color: black !important;
    }

    .modal-body {
        margin: 20px 0;
    }

    .modal-default-button {
        float: right;
    }

    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>