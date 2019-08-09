import express from 'express';
import dotenv from "dotenv";
import db from "../db.json";

dotenv.config();
// Create a new express application instance
const app: express.Application = express();

app.get('/logs', function (req, res) {
  db.sort((a, b) => {
    if (a.pk > b.pk)
      return -1;

    if (a.pk < b.pk)
      return 1;
    
    return 0;
  });
  const cursor = +(req.query.cursor || 1);
  const pageSize = +(process.env.PAGE_SIZE || 0);
  const results = db.slice((pageSize * cursor) - pageSize, pageSize * cursor).map(item => item.fields);
  
  const previous = cursor === 1 ? null : `http://localhost:${process.env.PORT}/logs?cursor=${cursor - 1}`;
  const next = Math.ceil(db.length / pageSize) === cursor ? null : `http://localhost:${process.env.PORT}/logs?cursor=${cursor + 1}`;

  if(Math.ceil(db.length / pageSize) < cursor)
    res.sendStatus(400);
  else {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({next, previous, results}));
  }
});

app.listen(process.env.PORT || 3000);