import WebSockets from "ws";
import { Server } from "http";
import { getLastestBlock } from "./blockchain";

const sockets: WebSockets[] = [];

// message types
const GET_LATEST = "GET_LATEST";
const GET_ALL = "GET_ALL";
const BLOCKCHAIN_RESPONSE = "BLOCKCHAIN_RESPONSE";

// message creators
const getLatest = () => ({ type: GET_LATEST, data: null });
const getAll = () => ({ type: GET_ALL, data: null });
const blockchainResponse = data => ({ type: BLOCKCHAIN_RESPONSE, data });

const getSockets = () => sockets;

const startP2PServer = (server: Server) => {
  const wsServer = new WebSockets.Server({ server });
  wsServer.on("connection", (ws: WebSockets) => {
    initSocketConnection(ws);
    console.log(`hello, socket!!`);
  });
  console.log("Nomadcoin P2P Server running");
};

const initSocketConnection = (ws: WebSockets): void => {
  sockets.push(ws);
  ws.on("close", () => closeSockeConnection(ws));
  ws.on("error", () => closeSockeConnection(ws));
  ws.on("message", data => handleSocketMessages(ws, data));
  sendMessage(ws, getLatest());
};

const parseData = (data: any): any => {
  try {
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return null;
  }
};
const handleSocketMessages = (ws, data) => {
  const message = parseData(data);
  if (message === null) {
    return;
  }
  console.log(message);
  switch (message.type) {
    case GET_LATEST:
      sendMessage(ws, getLastestBlock());
      break;
  }
};

const sendMessage = (ws: WebSockets, message: any) =>
  ws.send(JSON.stringify(message));

const closeSockeConnection = (ws: WebSockets): void => {
  ws.close();
  sockets.splice(sockets.indexOf(ws), 1);
};

const connectToPeers = (newPeer: string): void => {
  const ws = new WebSockets(newPeer);
  ws.on("open", () => {
    initSocketConnection(ws);
  });
};

export { startP2PServer, connectToPeers };
