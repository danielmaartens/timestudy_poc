'use strict';

// external modules
const Model = require('objection').Model;
const UUID = require('uuid');
const moment = require('moment');

export class Roles extends Model {

    static get idColumn() {
        return 'ID';
    }

    // Table name is the only required property.
    static get tableName() {
        return 'Roles';
    }

    $beforeInsert() {

        this.CreatedAt = moment().toISOString();
    };

    $beforeUpdate() {

        this.UpdatedAt = moment().toISOString();
    };

}
