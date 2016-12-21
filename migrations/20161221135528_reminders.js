'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('reminders', (table) => {
    table.increments('id');
    table.integer('recipient_id')
      .notNullable()
      .references('id')
      .inTable('recipients')
      .onDelete('CASCADE')
      .index();
    table.string('title').defaultTo('');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reminders');
};
