/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export async function up(knex) {
    return Promise.all([ 
        knex.schema.alterTable('room',(table)=>{
            table.string('truthOrDare')
        }),
        knex.schema.alterTable('room_truth',(table)=>{
            table.boolean('isInPlay').defaultTo(0);
        }),
        knex.schema.alterTable('room_dare',(table)=>{
            table.boolean('isInPlay').defaultTo(0);
        })
    ] )
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
   export async function down(knex) {
    
  };
