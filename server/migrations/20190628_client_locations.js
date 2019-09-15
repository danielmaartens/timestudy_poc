const moment = require('moment');

exports.up = function(knex, Promise) {
	return knex.schema.createTable('ClientLocations', function (table) {

        // uuid id for uniqueness
        table.increments('ID');
        table.integer('ClientID', 30).notNullable();
        table.string('Name', 30).notNullable();
        table.timestamp('CreatedAt').notNullable();
        table.timestamp('UpdatedAt');

    }).then(function () {
            return knex("ClientLocations").insert([
                {ClientID: 1, Name: "Cape Town", CreatedAt: moment().toISOString()},
                {ClientID: 1, Name: "Johannesburg", CreatedAt: moment().toISOString()},
                {ClientID: 2, Name: "Stellenbosch", CreatedAt: moment().toISOString()},
                {ClientID: 2, Name: "Malmesbury", CreatedAt: moment().toISOString()}
            ]);
        }
    );

};

exports.down = function(knex, Promise) {
   return knex.schema.dropTableIfExists('ClientLocations');
};
