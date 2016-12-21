/* eslint-disable max-len, camelcase */

'use strict';

exports.seed = function(knex) {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([{
        id: 1,
        first_name: 'Carolyn',
        last_name: 'Kunz',
        email: 'carolyn.delbeccaro@gmail.com',
        username: 'cdelkunz',
        hashed_password: '$2a$12$90rTf0MuRp0zOpfpcWnzgeF1fJ9iYpR.CveEU3hD5nWY0uDoOzoxO'
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};
