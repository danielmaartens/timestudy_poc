'use strict';

// external modules
const Model = require('objection').Model;
const UUID = require('uuid');
const moment = require('moment');

export class Clients extends Model {

    static get idColumn() {
        return 'ID';
    }

    // Table name is the only required property.
    static get tableName() {
        return 'Clients';
    }

    $beforeInsert() {

        this.CreatedAt = moment().toISOString();
    };

    $beforeUpdate() {

        this.UpdatedAt = moment().toISOString();
    };

    static get relationMappings() {
        return {
            locations: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/ClientLocations',
                join: {
                    from: 'Clients.ID',
                    to: 'ClientLocations.ClientID'
                }
            },
            users: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/Users',
                join: {
                    from: 'Clients.ID',
                    to: 'Users.ClientID'
                }
            }
        };
    }

}
