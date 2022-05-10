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
       table.uuid('currentPlayerId').nullable().alter();//('player.id') ;
       table.uuid('ownerId').nullable().alter();//('player.id') ;
      })  
      
    ] )
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   export async   function down(knex) {
    
  };
  