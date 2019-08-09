import express from "express"
import config from "../config.json";
import bodyParser from "body-parser";
import { randexp } from "randexp";

const app: express.Application = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

interface User {
  id: string,
  userName: string,
  inviteCode: string,
  invitedUser: number
}

let db: User[] = [];
let lastId = 0;
const generateInviteCode = () => {
  return randexp(`[${config.inviteCodeChars}]{50}`);
};

/*
There is something off with viral-growth task. When I post solution, test fails with message "Register should return user ID". But my solution returns single string in the body, representing the user ID. Response is exactly like in example, but it doesn't work
 */

app.post("/register", (req, res) => {
  if(!req.body || !req.body.userName) {
    res.sendStatus(400).end();
    return;
  }
  lastId++;
  db.push({
    id: lastId.toString(),
    inviteCode: generateInviteCode(),
    invitedUser: 0,
    userName: req.body.userName
  });

  if(req.body.inviteCode) {
    const whoInvited = db.find(user => user.inviteCode === req.body.inviteCode);
    if (whoInvited)
      whoInvited.invitedUser += 1;
  }
  res.send(`"${lastId}"`);
});

app.get("/userProfile", (req, res) => {
  console.log(JSON.stringify(req.query))
  if(!req.query || !req.query.id) {
    res.sendStatus(400).end();
    return;
  }

  const user = db.find(user => user.id === req.query.id);
  if(!user) {
    res.sendStatus(400).end();
    return;
  }

  const response = JSON.stringify({
      userName: user.userName,
      inviteCode: user.inviteCode,
      invitedUsers: user.invitedUser
  });

  res.send(response);
});

app.listen(config.port || 3000);
