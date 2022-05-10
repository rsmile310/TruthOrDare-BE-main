/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async    function up(knex) {
    return Promise.all([ 
      knex.schema.alterTable('player',(table)=>{
         
        //we know this is forgein key for room...references room.id
          table.string('name');
      })
    ] )
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   export async   function down(knex) {
    
  };
  