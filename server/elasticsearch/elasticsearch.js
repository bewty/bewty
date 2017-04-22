const elasticsearch = require('elasticsearch');
const database = require('../db/dbHelpers.js');

const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

const bulkIndex = (index, type, data) => {
  let bulkBody = [];
  data.forEach(item => {
    bulkBody.push({
      index: {
        _index: index,
        _type: type,
        _id: item._id
      }
    });
    delete item._id;
    bulkBody.push(item);
  });

  esClient.bulk({body: bulkBody})
  .then(response => {
    console.log('here');
    let errorCount = 0;
    response.items.forEach(item => {
      if (item.index && item.index.error) {
        console.log(++errorCount, item.index.error);
      }
    });
    console.log(
      `Successfully indexed ${data.length - errorCount}
       out of ${data.length} items`
    );
  })
  .catch(console.err);
};



const indexUsers = () => {
  console.log('test...');
  // const articlesRaw = fs.readFileSync('data.json');
  // bulkIndex('user', 'entries', articles);
  database.retrieveUsers()
  .then((user) => {
    bulkIndex('user', 'entries', user);
  })
  .catch((err) => {
    console.log('Received err:', err);
  });
};

indexUsers();

