/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async function up(knex) {
    return Promise.all([ 
        knex.schema.alterTable('player',(table)=>{
            table.string('avatar')
        }),
    ] )
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   export async function down(knex) {
    
  };
