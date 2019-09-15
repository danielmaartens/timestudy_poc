// tslint:disable-next-line:max-line-length
import axios from 'axios';
import {config} from '@/config';
// import shop from '../../api/shop'
// console.log('\n\nSESSION STORE\n\n');
// initial state
// shape: [{ id, quantity }]
const initialState = {
    sessions: [],
    sessionStartRequested: false,
    sessionStartSuccess: false,
    sessionStartFailed: false,
    sessionUpdateRequested: false,
    sessionUpdateSuccess: false,
    sessionUpdateFailed: false,
    sessionsRequested: false,
    sessionsSuccess: false,
    sessionsFailed: false,
    sessionRequested: false,
    sessionSuccess: false,
    sessionFailed: false,
    currentSession: {},
    currentLaps: [],
    currentSessions: [],
};

// console.log('SESSION STORE');
export const START_SESSION_REQUEST = '/session/START_SESSION_REQUEST';
export const START_SESSION_SUCCESS = '/session/START_SESSION_SUCCESS';
export const START_SESSION_FAILURE = '/session/START_SESSION_FAILURE';

export const UPDATE_SESSION_REQUEST = '/session/UPDATE_SESSION_REQUEST';
export const UPDATE_SESSION_SUCCESS = '/session/UPDATE_SESSION_SUCCESS';
export const UPDATE_SESSION_FAILURE = '/session/UPDATE_SESSION_FAILURE';

export const GET_SESSIONS_REQUEST = '/session/GET_SESSIONS_REQUEST';
export const GET_SESSIONS_SUCCESS = '/session/GET_SESSIONS_SUCCESS';
export const GET_SESSIONS_FAILURE = '/session/GET_SESSIONS_FAILURE';

export const GET_SESSION_REQUEST = '/session/GET_SESSION_REQUEST';
export const GET_SESSION_SUCCESS = '/session/GET_SESSION_SUCCESS';
export const GET_SESSION_FAILURE = '/session/GET_SESSION_FAILURE';

export const UPDATE_CURRENT_SESSION = '/session/UPDATE_CURRENT_SESSION';

// getters
const getters = {
    // cartProducts: (state: any, getters, rootState) => {
    //     return state.items.map(({ id, quantity }) => {
    //         const product = rootState.products.all.find(product => product.id === id)
    //         return {
    //             title: product.title,
    //             price: product.price,
    //             quantity
    //         }
    //     })
    // },
    //
    taskTargetTime(state: any): any {
        return state.currentSession.TaskTargetTime;
    },
    totalItems(state: any): any {
        return state.currentSession.TotalItems;
    },
    getCurrentSessionStatus(state: any): any {
        return state.currentSession.SessionStatus;
    },
};

// actions
const actions = {
    async startSession({ commit, state, rootState }: any, session: any) {

        commit(START_SESSION_REQUEST);

        const locationId = rootState.admin.currentClientLocation && rootState.admin.currentClientLocation.ID;
        try {
            const result: any = await axios.post('http://localhost:7788/api/v1/session/start', {
                ClientID: rootState.admin.currentClient.ID,
                ...session,
            });

            if (result && !result.error) {
                commit(START_SESSION_SUCCESS, result);
            } else if (!result || (result && result.error)) {
                commit(START_SESSION_FAILURE, result.error);
            }
        } catch (error) {
            commit(START_SESSION_FAILURE, {error});
        }
    },
    async updateSession({ commit, state }: any, valuesToUpdate: any) {

        commit(UPDATE_SESSION_REQUEST);

        try {
            const sessionId = valuesToUpdate.ID;
            delete valuesToUpdate.ID;

            const baseUrl = 'http://localhost:7788/api/v1/session/update/';
            const result: any = await axios.post(`${baseUrl}${sessionId || state.currentSession.ID}`, valuesToUpdate);

            if (result && !result.error) {
                commit(UPDATE_SESSION_SUCCESS, result);
            } else if (!result || (result && result.error)) {
                commit(UPDATE_SESSION_FAILURE, result.error);
            }
        } catch (error) {
            commit(UPDATE_SESSION_FAILURE, {error});
        }
    },
    async getSessions({ commit, state, rootState }: any) {

        commit(GET_SESSIONS_REQUEST);

        try {
            const baseUrl = 'http://localhost:7788/api/v1/session/all/';
            const result: any = await axios.get(`${baseUrl}${rootState.admin.currentClient.ID}`);

            if (result && !result.error) {
                commit(GET_SESSIONS_SUCCESS, result);
            } else if (!result || (result && result.error)) {
                commit(GET_SESSIONS_FAILURE, result.error);
            }
        } catch (error) {
            commit(GET_SESSIONS_FAILURE, {error});
        }
    },
    async getSession({ commit, state, rootState }: any) {

        commit(GET_SESSION_REQUEST);

        try {
            const baseUrl = 'http://localhost:7788/api/v1/session/';
            const result: any = await axios.get(`${baseUrl}${state.currentSession.ID}`);

            if (result && !result.error) {
                commit(GET_SESSION_SUCCESS, result);
            } else if (!result || (result && result.error)) {
                commit(GET_SESSION_FAILURE, result.error);
            }
        } catch (error) {
            commit(GET_SESSION_FAILURE, {error});
        }
    },
};

// mutations
const mutations = {
    [START_SESSION_REQUEST](state: any, payload: any) {
        state.sessionStartRequested = true;
        state.sessionStartSuccess = false;
        state.sessionStartFailed = false;
    },
    [START_SESSION_SUCCESS](state: any, { data }: any) {
        state.sessionStartRequested = false;
        state.sessionStartSuccess = true;
        state.currentSession = data;
    },
    [START_SESSION_FAILURE](state: any, { error }: any) {
        state.sessionStartRequested = false;
        state.sessionStartSuccess = false;
        state.sessionStartFailed = error;
    },
    [UPDATE_SESSION_REQUEST](state: any) {
        state.sessionUpdateRequested = true;
        state.sessionUpdateSuccess = false;
        state.sessionUpdateFailed = false;
    },
    [UPDATE_SESSION_SUCCESS](state: any, { data }: any) {
        state.sessionUpdateRequested = false;
        state.sessionUpdateSuccess = true;
        state.currentSession = data;
    },
    [UPDATE_SESSION_FAILURE](state: any, { error }: any) {
        state.sessionUpdateRequested = false;
        state.sessionUpdateSuccess = false;
        state.sessionUpdateFailed = error;
    },
    [GET_SESSIONS_REQUEST](state: any) {
        state.sessionsRequested = true;
        state.sessionsSuccess = false;
        state.sessionsFailed = false;
    },
    [GET_SESSIONS_SUCCESS](state: any,  { data }: any) {
        state.sessionsRequested = false;
        state.sessionsSuccess = true;
        state.currentSessions = data;
    },
    [GET_SESSIONS_FAILURE](state: any, { error }: any) {
        state.sessionsRequested = false;
        state.sessionsSuccess = false;
        state.sessionsFailed = error;
    },
    [GET_SESSION_REQUEST](state: any) {
        state.sessionRequested = true;
        state.sessionSuccess = false;
        state.sessionFailed = false;
    },
    [GET_SESSION_SUCCESS](state: any,  { data }: any) {
        state.sessionRequested = false;
        state.sessionSuccess = true;
        state.currentSession = data;
    },
    [GET_SESSION_FAILURE](state: any, { error }: any) {
        state.sessionRequested = false;
        state.sessionSuccess = false;
        state.sessionFailed = error;
    },
    [UPDATE_CURRENT_SESSION](state: any, payload: any) {
        state.currentSession = {
            ...state.currentSession,
            ...payload,
        };
    },
};

export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations,
};
