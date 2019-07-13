import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { getBlockchain, createNewBlock } from "./blockchain";
import { startP2PServer, connectToPeers } from "./p2p";

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

app.post("/peers", (req, res) => {
  const { peer } = req.body;
  connectToPeers(peer);
  res.send("success");
});

const server = app.listen(PORT, () =>
  console.log(`Nomadcoin HTTP server running on ${PORT}`)
);

startP2PServer(server);
