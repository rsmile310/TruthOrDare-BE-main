/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
//knex migrate:make --migrations-directory . -x ts rooms  
export async function up(knex) 
{
    return Promise.all([
        knex.schema.createTable('room', function(table) {
            table.increments('id').primary();
            table.string('ownerId');
            table.text('players');
            table.text('discPlayers');
            table.text('truths');
            table.text('dares');
            table.string('lobbyStatus');
            table.string('gameStatus');
            table.integer('currentPlayer');
        })
    ])
}


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex){
    return Promise.all([
    knex.schema.dropTable('room')
])
}

