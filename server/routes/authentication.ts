// 'use strict';
//
// // include external dependencies
// const Boom = require('boom');
// const Joi = require('joi');
//
// const handler = require('../handlers/Authentication.js');
//
// module.exports = [
//     {
//         method: 'POST',
//         path: '/auth/token',
//         config: {
//             auth: false,
//             validate: {
//                 payload: {
//                     email: Joi.string().required().min(3),
//                     password: Joi.string().required().min(3)
//                 }
//             },
//             handler: handler.generateJWT
//         }
//     },
//     {
//         method: 'POST',
//         path: '/auth/token/refresh',
//         config: {
//             handler: handler.refreshJWT
//         }
//     }
// ];
