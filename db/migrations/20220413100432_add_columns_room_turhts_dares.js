/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async function up(knex) {
    return Promise.all([ 
        knex.schema.alterTable('room_truth',(table)=>{
            table.uuid('id').primary();
        }),
        knex.schema.alterTable('room_dare',(table)=>{
            table.uuid('id').primary();
        })
    ] )
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   export async function down(knex) {
    
  };
