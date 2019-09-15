const moment = require('moment');

exports.up = function(knex, Promise) {
	return knex.schema.createTable('Tasks', function (table) {

        // uuid id for uniqueness
        table.increments('ID');
        table.integer('UserID');
        table.integer('ClientID');
        table.integer('ClientLocationID');
        table.string('Description', 30).notNullable();
        table.timestamp('CreatedAt').notNullable();
        table.timestamp('UpdatedAt');

    }).then(function () {
            return knex("Tasks").insert([
                {ClientID: 1, ClientLocationID: 1, Description: "Stitching", CreatedAt: moment().toISOString()},
                {ClientID: 1, ClientLocationID: 1, Description: "Templating", CreatedAt: moment().toISOString()},
                {ClientID: 1, ClientLocationID: 1, Description: "Cutting", CreatedAt: moment().toISOString()},
                {ClientID: 2, ClientLocationID: 2, Description: "Packing", CreatedAt: moment().toISOString()},
                {ClientID: 2, ClientLocationID: 2, Description: "Wrapping", CreatedAt: moment().toISOString()},
                {ClientID: 2, ClientLocationID: 2, Description: "Sealing", CreatedAt: moment().toISOString()}
            ]);
        }
    );

};

exports.down = function(knex, Promise) {
   return knex.schema.dropTableIfExists('Tasks');
};
