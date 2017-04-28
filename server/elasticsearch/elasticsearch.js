const mongoDatabase = require('../db/index.js');
const Response = mongoDatabase.Response;

exports.eSearch = (query) => {
  let identification = query.phonenumber;
  let search = query.search;
  let eSearchQ = 
    { 'bool': {
      'must': [{
        'term': {phonenumber: identification}}, {
          'match': {
            'text': {
              'query': search,
              'fuzziness': 'AUTO'
            }
          }
        }
      ] 
    },
  }; 
  return new Promise((resolve, reject) => {
    Response.search(eSearchQ, {hydrate: true}, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.stringify(results.hits.hits));
      }
    }
    );
  });
};
