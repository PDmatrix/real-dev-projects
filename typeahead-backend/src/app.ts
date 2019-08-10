import express from "express"
import dotenv from "dotenv";
import names from "../names.json"
import bodyParser from "body-parser";
dotenv.config();

const app: express.Application = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

interface Db {
  [key: string]: number;
}

const db: Db = names;

app.get("/typeahead/:prefix?", (req, res) => {
  console.log("prefix: " + req.params.prefix);
  if(!req.params.prefix) {
    const entries = Object.entries(db).map(([name, times]) => ({name, times}));
    entries.sort((a, b) => {
      if(a.times < b.times)
        return 1;
      if(a.times > b.times)
        return -1;
      return 0;
    });
    console.log("Empty: " +JSON.stringify(entries.slice(0, +(process.env.SUGGESTION_NUMBER || 0))));
    res.send(JSON.stringify(entries.slice(0, +(process.env.SUGGESTION_NUMBER || 0)))).end();
    return;
  }

  let exact;
  let entries = Object.entries(db)
    .map(([name, times]) => ({name, times}))
    .filter(({name, times}) => {
      if(name.toLowerCase() === req.params.prefix.toLowerCase()) {
        exact = {name, times};
        return false;
      }
      if (name.toLowerCase().slice(0, req.params.prefix.length) == req.params.prefix.toLowerCase()) {
        return true;
      }
    });

  entries.sort((a, b) => {
    if(a.times < b.times)
      return 1;
    if(a.times > b.times)
      return -1;
    return 0;
  });

  entries = entries.slice(0, +(process.env.SUGGESTION_NUMBER || 0));
  if(exact) {
    entries.splice(entries.length, 1);
    entries.unshift(exact);
  }
  console.log("entries: " + JSON.stringify(entries));
  res.send(JSON.stringify(entries));
});

app.post("/typeahead/set", (req, res) => {
  if(!req.body || !req.body.name) {
    res.sendStatus(400).end();
    return;
  }
  const username: string = req.body.name[0].toUpperCase() + (req.body.name.toLowerCase().slice(1, req.body.name.length));
  const name : any = db[username];
  console.log("Username: " + username);
  if(name === undefined || name === null) {
    res.sendStatus(400).end();
    return;
  }
  db[username]++;
  console.log("Result: " + JSON.stringify({ name: username, times: db[username]}));
  res.send(JSON.stringify({ name: username, times: db[username]}));
});

app.listen(process.env.PORT || 3000);
