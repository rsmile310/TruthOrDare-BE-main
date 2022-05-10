//cd db

//npx knex migrate:make something
//npx knex migrate:latest

//npx knex seed:make something
//npx knex seed:run  
const config = {
  development: {
    client: 'pg',
    connection: {
        host: 'test-truthordare-db.cld6abd0wpzy.eu-west-2.rds.amazonaws.com',
        database: 'tord',
        user:     'administrator',
        password: 'r02UU8ln6yVW3g4wreo5'
      },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    debug: true
  },
  production: {
    client: 'pg',
    connection: {
      host: 'test-truthordare-db.cld6abd0wpzy.eu-west-2.rds.amazonaws.com',
      database: 'tord',
      user:     'administrator',
      password: 'r02UU8ln6yVW3g4wreo5'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
};

export default config;