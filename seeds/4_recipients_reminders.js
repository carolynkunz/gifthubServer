/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('recipients_reminders').del()
    .then(() => {
      return knex('recipients_reminders').insert([{
        id: 1,
        user_id: 1,
        recipient_id: 1,
        reminder_id: 1
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('recipients_reminders_id_seq', (SELECT MAX(id) FROM recipients_reminders));"
      );
    });
};
