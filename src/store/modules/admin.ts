import axios from 'axios';
import {config} from '@/config';

// console.log('\n\nADMIN STORE\n\n');

const initialState = {
    currentClient: null,
    currentClientLocation: null,
    currentSupervisor: null,
    clientSupervisors: [],
    clientLocations: [],
    clients: [],
    operators: [],
    tasks: [],
    operatorListRequested: false,
    operatorListSuccess: false,
    operatorListFailed: false,
    clientsRequested: false,
    clientsSuccess: false,
    clientsFailed: false,
    getTasksRequested: false,
    getTasksSuccess: false,
    getTasksFailed: false,
    showSummaryModal: false,
};

export const SET_CURRENT_SUPERVISOR = '/admin/SET_CURRENT_SUPERVISOR';
export const SET_CURRENT_CLIENT = '/admin/SET_CURRENT_CLIENT';
export const SET_CURRENT_LOCATION = '/admin/SET_CURRENT_LOCATION';

export const OPERATOR_LIST_REQUEST = '/admin/OPERATOR_LIST_REQUEST';
export const OPERATOR_LIST_SUCCESS = '/admin/OPERATOR_LIST_SUCCESS';
export const OPERATOR_LIST_FAILURE = '/admin/OPERATOR_LIST_FAILURE';

export const GET_TASKS_REQUEST = '/admin/GET_TASKS_REQUEST';
export const GET_TASKS_SUCCESS = '/admin/GET_TASKS_SUCCESS';
export const GET_TASKS_FAILURE = '/admin/GET_TASKS_FAILURE';

export const GET_ALL_SUPERVISORS_REQUEST = '/admin/GET_ALL_SUPERVISORS_REQUEST';
export const GET_ALL_SUPERVISORS_SUCCESS = '/admin/GET_ALL_SUPERVISORS_SUCCESS';
export const GET_ALL_SUPERVISORS_FAILURE = '/admin/GET_ALL_SUPERVISORS_FAILURE';

export const GET_CLIENTS_REQUEST = '/admin/GET_CLIENTS_REQUEST';
export const GET_CLIENTS_SUCCESS = '/admin/GET_CLIENTS_SUCCESS';
export const GET_CLIENTS_FAILURE = '/admin/GET_CLIENTS_FAILURE';

export const TOGGLE_SUMMARY_MODAL = '/admin/TOGGLE_SUMMARY_MODAL';

// getters
const getters = {
    currentSupervisor: (state: any) => {
        return state.currentSupervisor;
    },
};

// actions
const actions = {
    async login({commit, state}: any, session: any) {
        return true;
    },
    async getOperators({commit, state, rootState}: any, session: any) {

        try {
            commit(OPERATOR_LIST_REQUEST);

            const apiHost = process.env.APP_VUE_API_HOST;

            // const result: any = await axios.get(`${config.api.baseUrl}/users/${state.currentSupervisor}`);
            const result: any = await axios.get(`http://localhost:7788/api/v1/users/${state.currentClient.ID}`);

            if (result && !result.error) {
                commit(OPERATOR_LIST_SUCCESS, result);
            } else if (!result || (result && result.error)) {
                commit(OPERATOR_LIST_FAILURE, result.error);
            }
        } catch (error) {
            commit(OPERATOR_LIST_FAILURE, {error});
        }
    },
    async getTasks({commit, state}: any, session: any) {

        try {
            commit(GET_TASKS_REQUEST);

            const baseUrl = 'http://localhost:7788/api/v1/tasks';
            const result: any = await axios.get(`${baseUrl}?client=${state.currentClient.ID}`);

            if (result && !result.error) {
                commit(GET_TASKS_SUCCESS, result);
            } else if (!result || (result && result.error)) {
                commit(GET_TASKS_FAILURE, result.error);
            }
        } catch (error) {
            commit(GET_TASKS_FAILURE, {error});
        }

    },
    async getClients({commit, state}: any) {

        try {
            commit(GET_CLIENTS_REQUEST);

            const baseUrl = 'http://localhost:7788/api/v1/clients';
            const result: any = await axios.get(`${baseUrl}`);

            if (result && !result.error) {
                commit(GET_CLIENTS_SUCCESS, result);
            } else if (!result || (result && result.error)) {
                commit(GET_CLIENTS_FAILURE, result.error);
            }
        } catch (error) {
            commit(GET_CLIENTS_FAILURE, {error});
        }
    },
    toggleSummaryModal({commit, state}: any) {
        commit(TOGGLE_SUMMARY_MODAL);
    },

    setClient({commit, state}: any, client: any) {
        commit(SET_CURRENT_CLIENT, client);
    },

    setLocation({commit, state}: any, location: any) {
        commit(SET_CURRENT_LOCATION, location);
    },

    setSupervisor({commit, state}: any, supervisor: any) {
        commit(SET_CURRENT_SUPERVISOR, supervisor);
    },

};

// mutations
const mutations = {
    [SET_CURRENT_CLIENT](state: any, payload: any) {
        const supervisors = payload.users.filter((u: any) => u.role.Role === 'supervisor');

        const client = payload;

        client.users = client.users.map((u: any) => {
            return {
                ...u,
                Role: u.role.Role,
                LocationName: u.location.Name,
            };
        });

        state.currentClient = client;
        state.clientSupervisors = supervisors;
        state.clientLocations = payload.locations;
        state.currentClientLocation = null;
        state.currentSupervisor = null;
    },
    [SET_CURRENT_LOCATION](state: any, payload: any) {
        state.clientSupervisors = state.currentClient.users.filter((cs: any) => {
            return cs.location.ID === payload.ID
                && cs.role.Role === 'supervisor';
        });
        state.currentClientLocation = payload;
    },
    [SET_CURRENT_SUPERVISOR](state: any, payload: any) {
        state.currentSupervisor = payload;
    },
    [OPERATOR_LIST_REQUEST](state: any) {
        state.operatorListRequested = true;
        state.operatorListSuccess = false;
        state.operatorListFailed = false;
    },
    [OPERATOR_LIST_SUCCESS](state: any, {data}: any) {

        const operators = data.filter((d: any) => d.role.Role !== 'supervisor');
        state.operatorListRequested = false;
        state.operatorListSuccess = true;
        state.operators = operators;
    },
    [OPERATOR_LIST_FAILURE](state: any, {error}: any) {
        state.operatorListRequested = false;
        state.operatorListSuccess = false;
        state.operatorListFailed = error;
    },
    [GET_TASKS_REQUEST](state: any) {
        state.getTasksRequested = true;
        state.getTasksSuccess = false;
        state.getTasksFailed = false;
    },
    [GET_TASKS_SUCCESS](state: any, {data}: any) {
        state.getTasksRequested = false;
        state.getTasksSuccess = true;
        state.tasks = data;
    },
    [GET_TASKS_FAILURE](state: any, {error}: any) {
        state.getTasksRequested = false;
        state.getTasksSuccess = false;
        state.getTasksFailed = error;
    },
    [GET_CLIENTS_REQUEST](state: any) {
        state.clientsRequested = true;
        state.clientsSuccess = false;
        state.clientsFailed = false;
        state.clientSupervisors = [];
        state.clientLocations = [];
        state.clients = [];
        state.currentClient = null;
        state.currentClientLocation = null;
        state.currentSupervisor = null;
    },
    [GET_CLIENTS_SUCCESS](state: any, {data}: any) {

        state.clientsRequested = false;
        state.clientsSuccess = true;
        state.clients = data;
    },
    [GET_CLIENTS_FAILURE](state: any, {error}: any) {
        state.clientsRequested = false;
        state.clientsSuccess = false;
        state.clientsFailed = error;
    },
    [TOGGLE_SUMMARY_MODAL](state: any) {
        state.showSummaryModal = !state.showSummaryModal;
    },
};

export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations,
};
