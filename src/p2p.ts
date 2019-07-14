import WebSockets from "ws";
import { Server } from "http";

const sockets: WebSockets[] = [];

const getSockets = () => sockets;

const startP2PServer = (server: Server) => {
  const wsServer = new WebSockets.Server({ server });
  wsServer.on("connection", (ws: WebSockets) => {
    initSocketConnection(ws);
    console.log(`hello, socket!!`);
  });
  console.log("Nomadcoin P2P Server running");
};

const initSocketConnection = (socket: WebSockets): void => {
  sockets.push(socket);
  hanldeSocketError(socket);
  socket.on("message", data => {
    console.log(data);
  });
  setTimeout(() => {
    socket.send("welcome");
  }, 2000);
};

const hanldeSocketError = ws => {
  const closeSockeConnection = ws => {
    ws.close();
    sockets.splice(sockets.indexOf(ws), 1);
  };
  ws.on("close", () => closeSockeConnection(ws));
  ws.on("error", () => closeSockeConnection(ws));
};

const connectToPeers = (newPeer: string): void => {
  const ws = new WebSockets(newPeer);
  ws.on("open", () => {
    initSocketConnection(ws);
  });
};

export { startP2PServer, connectToPeers };
