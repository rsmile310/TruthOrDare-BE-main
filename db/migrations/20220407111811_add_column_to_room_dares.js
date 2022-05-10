/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async    function up(knex) {
    return Promise.all([ 
      knex.schema.createTable('room_dare',(table)=>{
         
        //we know this is forgein key for room...references room.id
          table.string('roomId');
          //fk for the dare table
          table.integer('dareId');
      })
    ] )
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   export async   function down(knex) {
    
  };
  