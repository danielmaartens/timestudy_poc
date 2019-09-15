'use strict';

const NODE_ENV = process.env.NODE_ENV;

const API_PORT = process.env.API_PORT;
const API_HOST = process.env.API_HOST;

const VUE_APP_API_PORT = process.env.VUE_APP_API_PORT;
const VUE_APP_API_HOST = process.env.VUE_APP_API_HOST;


const BASE_API_URI = '/api/v1';
const VUE_APP_PORT = process.env.VUE_APP_PORT;
const VUE_APP_HOST = process.env.VUE_APP_HOST;

const DB_HOST = process.env.DB_HOST;
const DATABASE = process.env.DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

export const config = {
    environment: NODE_ENV,
    dev: {
        port: VUE_APP_PORT,
    },
    app: {
        host: VUE_APP_HOST,
        port: VUE_APP_PORT,
    },
    api: {
        host: VUE_APP_API_HOST,
        port: VUE_APP_API_PORT,
        // jwtSecret: JWT_SECRET,
        corsWhitelist: [
            'http://localhost',
        ],
        baseApiUri: BASE_API_URI,
        baseUrl: `${VUE_APP_API_HOST}/${BASE_API_URI}`,
        healthCheck: '/hc',
    },

};
