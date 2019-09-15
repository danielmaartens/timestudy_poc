const moment = require('moment');

exports.up = function(knex, Promise) {
    return knex.schema.createTable('Users', function (table) {

        // uuid id for uniqueness
        // table.uuid('ID').primary();
        table.increments('ID');
        table.integer('ClientID').notNullable().index();
        table.integer('ClientLocationID').notNullable().index();
        table.integer('SupervisorID');
        table.integer('RoleID').notNullable().index();
        table.string('FirstName').notNullable().index();
        table.string('LastName').notNullable().index();
        table.string('Email').notNullable().index();
        table.string('Password').notNullable().index();
        table.timestamp('CreatedAt').notNullable();
        table.timestamp('UpdatedAt');

    }).then(function () {
            return knex("Users").insert([
                {FirstName: 'Sonny', LastName: 'Arendse', ClientID: 1, ClientLocationID: 1, RoleID: 1, Email: "sonny@ss.org", Password: "123", CreatedAt: moment().toISOString()},
                {FirstName: 'Bunny', LastName: 'Kwatcha', ClientID: 1, ClientLocationID: 1, RoleID: 2, Email: "bunny@ss.org", Password: "123", SupervisorID: 1, CreatedAt: moment().toISOString()},
                {FirstName: 'Leticia', LastName: 'Lewis', ClientID: 1, ClientLocationID: 2, RoleID: 2, Email: "leticia@ss.org", Password: "123", SupervisorID: 1, CreatedAt: moment().toISOString()},

                {FirstName: 'Beryl', LastName: 'Scholtz', ClientID: 2, ClientLocationID: 3, RoleID: 1, Email: "beryl@pp.org", Password: "123", CreatedAt: moment().toISOString()},
                {FirstName: 'Amanda', LastName: 'Heins', ClientID: 2, ClientLocationID: 4, RoleID: 1, Email: "amanda@pp.org", Password: "123", CreatedAt: moment().toISOString()},
                {FirstName: 'Boetie', LastName: 'de Bruyn', ClientID: 2, ClientLocationID: 3, RoleID: 2, Email: "boetie@pp.org", Password: "123", SupervisorID: 3, CreatedAt: moment().toISOString()},
                {FirstName: 'Karel', LastName: 'van der Merwe', ClientID: 2, ClientLocationID: 3, RoleID: 2, Email: "karel@pp.org", Password: "123", SupervisorID: 3, CreatedAt: moment().toISOString()},
                {FirstName: 'John', LastName: 'Habberdasher', ClientID: 2, ClientLocationID: 4, RoleID: 2, Email: "john@pp.org", Password: "123", SupervisorID: 4, CreatedAt: moment().toISOString()},
                {FirstName: 'Lewis', LastName: 'Lager', ClientID: 2, ClientLocationID: 4, RoleID: 2, Email: "lewis@pp.org", Password: "123", SupervisorID: 4, CreatedAt: moment().toISOString()},
            ]);
        }
    );
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('Users');
};
