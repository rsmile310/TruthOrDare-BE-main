/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async function up(knex) {
    return Promise.all([ 
      knex.schema.alterTable('player',(table)=>{
          table.boolean('hasPlayed').defaultTo(0)
          table.boolean('hasVoted').defaultTo(0);
      })
    ] )
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   export async function down(knex) {
    
  };
  