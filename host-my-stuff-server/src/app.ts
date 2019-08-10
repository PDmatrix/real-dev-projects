import express from "express"
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import fs from "fs";

const app: express.Application = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(fileUpload());

app.post("/upload", (req, res) => {
  if(!req.files) {
    return res.sendStatus(400).end();
  }

  const file = req.files.file;
  // @ts-ignore
  file.mv(`/tmp/hms/${file.name}`, (err) => {
    if (err)
      return res.status(500).send(err);

    // @ts-ignore
    res.send(file.name);
  });
});

app.get("/:name", (req, res) => {
  fs.readFile(`/tmp/hms/${req.params.name}`, "utf-8", (err, data) => {
    res.send(data);
  })
});

app.listen(3000);
