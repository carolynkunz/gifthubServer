/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('reminders').del()
    .then(() => {
      return knex('reminders').insert([{
        id: 1,
        recipient_id: 1,
        title: 'Birthday is Nov. 23'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('reminders_id_seq', (SELECT MAX(id) FROM reminders));"
      );
    });
};
