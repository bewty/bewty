const mongoDatabase = require('../db/index.js');
const Response = mongoDatabase.Response;

exports.eSearch = (query) => {
  let identification = query.phonenumber;
  let search = query.search;
  console.log('eSearch triggered with:', identification, search);
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
    Response.search(eSearchQ, (err, results) => {
      if (err) {
        reject(err);
      } else {
        // console.log('Sending result from eSearch:', results.hits.hits);
        resolve(results.hits.hits);
      }
    }
    );
  });
};

// exports.eSearch({phonenumber: '17143389938', search: 'apple'})
// .then((result) => {
//   console.log('Found result:', result);
// })
// .catch((err) => {
//   console.log('Received error:', err);
// });
