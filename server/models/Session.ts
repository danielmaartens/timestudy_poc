'use strict';

const Model = require('objection').Model;
const UUID = require('uuid');
const moment = require('moment');

export class Session extends Model {

    static get idColumn() {
        return 'ID';
    }

    static get tableName() {
        return 'Session';
    }

    $beforeInsert() {

        if (!this.ID) {
            this.ID = UUID.v4();
        }

        this.CreatedAt = moment().toISOString();

    };

    $beforeUpdate() {

        this.UpdatedAt = moment().toISOString();
    };

    $formatJson(json: any) {

        const returnJson = super.$formatJson(json);

        return returnJson;
    }

    static get relationMappings() {
        return {
            operator: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Users',
                join: {
                    from: 'Session.OperatorID',
                    to: 'Users.ID'
                }
            },
            supervisor: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Users',
                join: {
                    from: 'Session.SupervisorID',
                    to: 'Users.ID'
                }
            },
            location: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/ClientLocations',
                join: {
                    from: 'Session.LocationID',
                    to: 'ClientLocations.ID'
                }
            },
            task: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Tasks',
                join: {
                    from: 'Session.TaskID',
                    to: 'Tasks.ID'
                }
            }
        };
    }
}
