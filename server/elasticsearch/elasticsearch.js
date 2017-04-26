const elasticsearch = require('elasticsearch');
const database = require('../db/dbHelpers.js');

const mongoDatabase = require('../db/index.js');
const Response = mongoDatabase.Response;

let eSearch = (query) => {
  let identification = query.phonenumber;
  let search = query.search;

  let eSearchQ = 
    { 'bool': {
      'must': [
      {'term': {phonenumber: identification}},
      {'match': {'text': 'apple message'}}
      ] 
    },
  }; 
  return new Promise((resolve, reject) => {
    Response.search(eSearchQ, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.hits.hits);
      }
    }
    );
  });
};

eSearch({phonenumber: '17143389938', search: 'apple'})
.then((result) => {
  console.log('Found result:', result);
});