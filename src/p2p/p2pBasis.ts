import WebSockets from "ws";

const sockets: WebSockets[] = [];

export const getSockets = (): WebSockets[] => sockets;
export const addToSocket = (ws: WebSockets) => sockets.push(ws);
export const removeFromSocket = (ws: WebSockets) =>
  sockets.splice(sockets.indexOf(ws), 1);
