const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.set('X-Frame-Options', 'allow-from  https://review.docs.microsoft.com/en-us/graph/try-it?branch=task/tryit-concept');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 9000);
