const moment = require('moment');

exports.up = function(knex, Promise) {
	return knex.schema.createTable('Roles', function (table) {

        // uuid id for uniqueness
        table.increments('ID');
        table.string('Role', 30).notNullable();
        table.timestamp('CreatedAt').notNullable();
        table.timestamp('UpdatedAt');

    }).then(function () {
            return knex("Roles").insert([
                {Role: "supervisor", CreatedAt: moment().toISOString()},
                {Role: "operator", CreatedAt: moment().toISOString()}
            ]);
        }
    );

};

exports.down = function(knex, Promise) {
   return knex.schema.dropTableIfExists('Roles');
};
