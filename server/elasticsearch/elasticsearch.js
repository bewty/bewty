const elasticsearch = require('elasticsearch');
const database = require('../db/dbHelpers.js');

const mongoDatabase = require('../db/index.js');
const User = mongoDatabase.User;

User.search(
  {
    'query': {
      'nested': {
        'path': 'entries',
        'query': {
          'match_all': {}
        }
      }
    }
  }, 
  (err, results) => {
    if (err) {
      console.log('Received error in ES search:', err);
    } else {
      console.log('Received results in ES search:', results.hits.hits);
    }
  }
);