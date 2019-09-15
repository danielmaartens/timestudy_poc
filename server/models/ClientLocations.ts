'use strict';

// external modules
const Model = require('objection').Model;
const UUID = require('uuid');
const moment = require('moment');

export class ClientLocations extends Model {

    static get idColumn() {
        return 'ID';
    }

    // Table name is the only required property.
    static get tableName() {
        return 'ClientLocations';
    }

    $beforeInsert() {

        this.CreatedAt = moment().format();
    };

    $beforeUpdate() {

        this.UpdatedAt = moment().format();
    };

    static get relationMappings() {
        return {
            client: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/ClientLocations',
                join: {
                    from: 'ClientLocations.ClientID',
                    to: 'Users.ID'
                }
            }
        };
    }

}
