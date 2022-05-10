/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async    function up(knex) {
  return Promise.all([
    knex.schema.dropTable('room'),
    knex.schema.createTable('room',(table)=>{
        table.uuid('id').primary();
        table.uuid('ownerId');
        table.uuid('currentPlayerId');
        table.string('lobbyStatus');
        table.string('gameStatus');
    })
  ] )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async   function down(knex) {
  
};
