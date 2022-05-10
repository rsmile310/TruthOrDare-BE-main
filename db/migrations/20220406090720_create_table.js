/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return Promise.all([
        knex.schema.createTable('truths', function(table) {
            table.increments('id').primary();
            table.text('text');
        })
    ])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return Promise.all([
        knex.schema.dropTable('truths')
      ])
};
