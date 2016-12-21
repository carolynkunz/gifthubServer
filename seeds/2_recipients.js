/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('recipients').del()
    .then(() => {
      return knex('recipients').insert([{
        id: 1,
        user_id: 1,
        first_name: 'Del',
        last_name: 'Lori',
        address_line_one: '201 Otter Rock Drive',
        address_city: 'Greenwich',
        address_state: 'CT',
        address_zip: '06830',
        birthday: '2003-11-24',
        note: 'Loves anything Purdue, NY Giants, Yankees, Knicks',
        // reminder_id: 1,
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('recipients_id_seq', (SELECT MAX(id) FROM recipients));"
      );
    });
};
