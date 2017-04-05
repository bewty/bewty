const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, '..', 'dist')));

app.get('/test', (req, res) => {
  res.send('hello world');
});

app.get('*', (req, res) => {
  res.sendFile( path.resolve(__dirname, '..', 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app listening on', port);
});