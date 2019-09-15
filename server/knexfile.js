/**
 * Knex expects there to be a knexfile.js with connection details defined for each environment. We want this tool to work using .env variables to avoid
 * exposing secrets in source control.
 *
 * @type {Object}
 */

// get a ref to our shard config object
const config = require('./config/index.js');

console.log(`DB CONNECTION: ${JSON.stringify(config.db, null, 4)}`);

module.exports = {
    client: 'postgresql',
    connection: config.db,
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
};

