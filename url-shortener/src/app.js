var express = require('express');
var app = express();
require('dotenv').config()
var bodyParser = require('body-parser')
//app.use(bodyParser.text())
app.use(function(req, res, next){
    req.text = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ req.text += chunk });
    req.on('end', next);
});

const lookupTable = {}
let idx = 1;
app.post('/generate', function (req, res) {
  const a = req.text;
  let short = lookupTable[a];
  if(!short) {
    lookupTable[a] = idx;
    short = idx
    idx += 1;
  } 
  res.send(''+short);
});

app.get('/follow/:short', function (req, res) {
  const shortUrl = req.params.short;
  const elem = Object.entries(lookupTable).find(([key, value]) => { 
    return value === shortUrl-0; 
  })
  if(!elem) {
    res.sendStatus(404);
  } else {
    res.statusCode = 302;
    res.setHeader("Location", elem[0]);
    res.end();
  }
})

app.listen(process.env.PORT || 3000, function () {
});
