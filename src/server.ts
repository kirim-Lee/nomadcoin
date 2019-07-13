import express = require("express");
import bodyParser = require("body-parser");
import morgan = require("morgan");
import { getBlockchain, createNewBlock } from "./blockchain";

const PORT = process.env.HTTP_PORT || 3300;

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/blocks", (req, res) => {
  res.send(getBlockchain());
});

app.post("/blocks", (req, res) => {
  const { data } = req.body;
  const newBlock = createNewBlock(data);
  res.send(newBlock);
});

app.listen(PORT, () => console.log(`Nomadcoin server running on ${PORT}`));
