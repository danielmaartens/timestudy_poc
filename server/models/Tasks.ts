'use strict';

// external modules
const Model = require('objection').Model;
const UUID = require('uuid');
const moment = require('moment');

export class Tasks extends Model {

    static get idColumn() {
        return 'ID';
    }

    // Table name is the only required property.
    static get tableName() {
        return 'Tasks';
    }

    $beforeInsert() {

        this.CreatedAt = moment().toISOString();
    };

    $beforeUpdate() {

        this.UpdatedAt = moment().toISOString();
    };

    static get relationMappings() {
        return {
            location: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/ClientLocations',
                join: {
                    from: 'Tasks.ClientLocationID',
                    to: 'ClientLocations.ID'
                }
            }
        };
    }

}
