'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/gifthub_db'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
