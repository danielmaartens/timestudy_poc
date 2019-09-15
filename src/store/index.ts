import Vue from 'vue';
import Vuex from 'vuex';
import session from './modules/session';
import admin from './modules/admin';
import createLogger, { LoggerOption } from 'vuex/dist/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const options: LoggerOption<any> = {
    collapsed: false, // auto-expand logged mutations
    filter(mutation: any, stateBefore: any, stateAfter: any) {
        // returns `true` if a mutation should be logged
        // `mutation` is a `{ type, payload }`
        return mutation.type !== 'aBlacklistedMutation';
    },
    transformer(state: any) {
        // transform the state before logging it.
        // for example return only a specific sub-tree
        return state.subTree;
    },
    mutationTransformer(mutation) {
        // mutations are logged in the format of `{ type, payload }`
        // we can format it any way we want.
        return mutation.type;
    }, // implementation of the `console` API, default `console`
};


export default new Vuex.Store({
    modules: {
        session,
        admin,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : [],
});
