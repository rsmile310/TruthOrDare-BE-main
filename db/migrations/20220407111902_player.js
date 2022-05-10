/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async    function up(knex) {
    return Promise.all([ 
      knex.schema.createTable('player',(table)=>{
         
        //we know this is forgein key for room...references room.id
          table.uuid('id').primary();
          table.string('socketId');
          table.integer('truthScore');
          table.integer('dareScore');
          table.string('playerStatus');
          //fk for room
          table.string('roomId');
      })
    ] )
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   export async   function down(knex) {
    
  };
  