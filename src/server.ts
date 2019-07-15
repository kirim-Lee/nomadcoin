import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { getBlockchain } from "./blockchain";
import { startP2PServer, connectToPeers } from "./p2p";
import { createNewBlockWithBroadCast } from "./p2pMessage";

const PORT = process.env.HTTP_PORT || 3300;

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/blocks", (_req: Request, res: Response) => {
  res.send(getBlockchain());
});

app.post("/blocks", (req: Request, res: Response) => {
  const { data } = req.body;
  const newBlock = createNewBlockWithBroadCast(data);
  res.send(newBlock);
});

app.post("/peers", (req: Request, res: Response) => {
  const { peer } = req.body;
  connectToPeers(peer);
  res.send("success");
});

const server = app.listen(PORT, () =>
  console.log(`Nomadcoin HTTP server running on ${PORT}`)
);

startP2PServer(server);
