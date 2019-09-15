'use strict';
// external modules
// const Bcrypt = require('bcrypt');
// const Boom = require('boom');
// const Crypto = require('crypto');
// const Jwt = require('jsonwebtoken');

// promisify bcrypt hash method for ease of chaining
// const hashPassword = Promise.promisify(Bcrypt.hash);
// const compareHash = Promise.promisify(Bcrypt.compare);

// external modules
const Model = require('objection').Model;
const UUID = require('uuid');
const moment = require('moment');

export class Users extends Model {

    static get idColumn() {
        return 'ID';
    }

    // Table name is the only required property.
    static get tableName() {
        return 'Users';
    }

    $beforeInsert() {

        // if (!this.ID) {
        //     this.ID = UUID.v4();
        // }

        this.CreatedAt = moment().toISOString();
    };

    $beforeUpdate() {

        this.UpdatedAt = moment().toISOString();
    };

    // toJWT(){
    //
    //     const token = Jwt.sign(this.toJSON(), config.api.jwtSecret, { expiresIn: '2h' });
    //     return { token: token };
    // }

    static get relationMappings() {
        return {
            role: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Roles',
                join: {
                    from: 'Users.RoleID',
                    to: 'Roles.ID'
                }
            },
            location: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/ClientLocations',
                join: {
                    from: 'Users.ClientLocationID',
                    to: 'ClientLocations.ID'
                }
            }
        };
    }

}
