'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('recipients_reminders', (table) => {
    table.increments('id');
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();
    table.integer('recipient_id')
      .notNullable()
      .references('id')
      .inTable('recipients')
      .onDelete('CASCADE')
      .index();
    table.integer('reminder_id')
      .notNullable()
      .references('id')
      .inTable('reminders')
      .onDelete('CASCADE')
      .index();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('recipients_reminders');
};
