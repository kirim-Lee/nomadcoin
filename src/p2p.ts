import WebSockets from "ws";
import { Server } from "http";
import { addToSocket, removeFromSocket } from "./p2pBasis";
import { getLatest, handleSocketMessages, sendMessage } from "./p2pMessage";

const startP2PServer = (server: Server) => {
  const wsServer = new WebSockets.Server({ server });
  wsServer.on("connection", (ws: WebSockets) => {
    initSocketConnection(ws);
    console.log(`hello, socket!!`);
  });
  console.log("Nomadcoin P2P Server running");
};

const initSocketConnection = (ws: WebSockets): void => {
  addToSocket(ws);
  ws.on("close", () => closeSockeConnection(ws));
  ws.on("error", () => closeSockeConnection(ws));
  ws.on("message", data => handleSocketMessages(ws, data));
  sendMessage(ws, getLatest());
};

const closeSockeConnection = (ws: WebSockets): void => {
  ws.close();
  removeFromSocket(ws);
};

const connectToPeers = (newPeer: string): void => {
  const ws = new WebSockets(newPeer);
  ws.on("open", () => {
    initSocketConnection(ws);
  });
};

export { startP2PServer, connectToPeers };
