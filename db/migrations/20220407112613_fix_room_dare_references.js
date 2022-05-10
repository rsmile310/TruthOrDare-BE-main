/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async    function up(knex) {
    return Promise.all([ 
        knex.schema.renameTable('dares', 'dare'),
        knex.schema.renameTable('truths', 'truth'),

      knex.schema.alterTable('room_dare', (table)=>{

       ;
       table.foreign('roomId').references('room.id') ;
       
        table.foreign('dareId').references('dare.id') ;
      }) ,
      knex.schema.alterTable('room_truth', (table)=>{
        
        table.foreign('roomId').references('room.id')  ;
     
        table.foreign('truthId').references('truth.id') ;
         
      }) 
      
    ] )
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   export async   function down(knex) {
    
  };
  