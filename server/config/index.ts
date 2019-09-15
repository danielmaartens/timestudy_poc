'use strict';

const NODE_ENV = process.env.NODE_ENV;

const API_PORT = process.env.API_PORT;
const API_HOST = process.env.API_HOST;
const BASE_API_URI = '/api/v1';
const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;

const DB_HOST = process.env.DB_HOST;
const DATABASE = process.env.DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const config = {
    environment: NODE_ENV,
    dev: {
        port: APP_PORT
    },
    serviceSettings: {
        logsDir: "logs/",
        env: process.env.environment || "local"
    },
    app: {
        host: APP_HOST,
        port: APP_PORT
    },
    api: {
        host: API_HOST,
        port: API_PORT,
        // jwtSecret: JWT_SECRET,
        corsWhitelist: [
            'http://localhost'
        ],
        baseApiUri: BASE_API_URI,
        baseUrl: `${API_HOST}/${BASE_API_URI}`,
        healthCheck: "/hc"
    },
    db: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DATABASE
    },

};

export default config;