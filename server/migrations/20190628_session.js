
exports.up = function(knex, Promise) {
    return knex.schema.createTable('Session', function (table) {

        // uuid id for uniqueness
        table.uuid('ID').primary();


        table.integer('ClientID').notNullable();
        table.integer('LocationID').nullable();
        table.integer('SupervisorID').notNullable();
        table.integer('OperatorID').notNullable();
        table.integer('TaskID').notNullable();
        table.integer('TaskTargetTime').notNullable();
        table.integer('TotalItems').notNullable();
        table.integer('ItemsCompleted').defaultTo(0);
        table.integer('CurrentTime').defaultTo(0);
        table.integer('AverageItemTime').defaultTo(0);
        table.integer('BestTime');
        table.integer('WorstTime');
        table.integer('PauseTaken');
        table.string('SessionStatus', 50);
        table.float('SupervisorRating').defaultTo(0);
        table.timestamp('CreatedAt').notNullable();
        table.timestamp('UpdatedAt');

    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('TaskTracker');
};
