const elasticsearch = require('elasticsearch');
const database = require('../db/dbHelpers.js');

const mongoDatabase = require('../db/index.js');
const User = mongoDatabase.User;

User.search(
  {
    query_string: {
      query: 'dog'
    }}, 
    {hydrate: true, hydrateOptions: {select: 'entries'}}, (err, results) => {
    if (err) {
      console.log('Received error in ES search:', err);
    } else {
      console.log('Received results in ES search:', results.hits.hits[0].call_entries);
    }
  }
);