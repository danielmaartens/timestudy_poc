'use strict';

const API_PORT = process.env.API_PORT;

const NODE_ENV = process.env.NODE_ENV;
const DB_HOST = process.env.DB_HOST;
const DATABASE = process.env.DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

module.exports = {
    environment: NODE_ENV,
    dev: {
        port: process.env.APP_PORT
    },
    app: {
        host: process.env.APP_HOST,
        port: process.env.APP_PORT
    },
    api: {
        host: process.env.API_HOST,
        port: API_PORT,
        // jwtSecret: JWT_SECRET,
        baseApiUri: "/api/v1",
        healthCheck: "/hc",
        corsWhitelist: [
            'http://localhost'
        ]
    },
    db: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DATABASE
    },

};
