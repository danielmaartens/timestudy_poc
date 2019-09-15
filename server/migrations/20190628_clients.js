const moment = require('moment');

exports.up = function(knex, Promise) {
	return knex.schema.createTable('Clients', function (table) {

        // uuid id for uniqueness
        table.increments('ID');
        table.string('Name', 30).notNullable();
        table.string('Email', 30);
        table.string('Telephone', 30);
        table.string('Address', 30);
        table.timestamp('CreatedAt').notNullable();
        table.timestamp('UpdatedAt');

    }).then(function () {
            return knex("Clients").insert([
                {Name: 'Super Stitchers', Email: 'info@superstitchers.co.za', Telephone: '091 555 7866', Address: '4 Thread Avenue, Needlama', CreatedAt: moment().toISOString()},
                {Name: 'Perfect Packers', Email: 'info@perfectpackers.co.za', Telephone: '052 651 9970', Address: '61 Box Street, Ribbon Ways', CreatedAt: moment().toISOString()}
            ]);
        }
    );

};

exports.down = function(knex, Promise) {
   return knex.schema.dropTableIfExists('Clients');
};
