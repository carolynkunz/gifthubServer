'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('recipients', (table) => {
    table.increments('id');
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.string('first_name').notNullable().defaultTo('');
    table.string('last_name').notNullable().defaultTo('');
    table.string('address_line_one').defaultTo('');
    table.string('address_line_two').defaultTo('');
    table.string('address_city').defaultTo('');
    table.string('address_state').defaultTo('');
    table.string('address_zip').defaultTo('');
    table.string('birthday').defaultTo('');
    table.string('note').defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('recipients');
};
