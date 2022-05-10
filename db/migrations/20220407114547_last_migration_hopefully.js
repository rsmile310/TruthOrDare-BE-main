/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

//room.currentplayer, room.ownerId, playerId
export async    function up(knex) {
    return Promise.all([ 


       //room.currentplayer make it a forgin key to player table
      

      knex.schema.alterTable('room', (table)=>{

       ;
       table.foreign('currentPlayerId').references('player.id') ;
       table.foreign('ownerId').references('player.id') ;
      }) ,
      knex.schema.alterTable('player', (table)=>{
        
        table.foreign('roomId').references('room.id')  ;
      
         
      }) 
      
    ] )
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   export async   function down(knex) {
    
  };
  